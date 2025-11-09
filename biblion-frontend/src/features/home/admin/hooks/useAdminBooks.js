import { useEffect, useState } from 'react';
import BookService from '../../services/BookService.js';

/**
 * Hook de administração de livros
 *
 * Responsabilidades:
 * - Carregar a lista de livros (interna ou via BookService)
 * - Fornecer operações locais de CRUD (add/update/delete/bulkDelete)
 * - Manter seleção para deleção em massa
 *
 * Observações para integração com backend (Spring Boot):
 * - Substitua as operações internas (addBook/updateBook/deleteBook) por chamadas
 *   a endpoints REST do backend, por exemplo:
 *     GET  /api/books         -> BookService.listbooks()
 *     POST /api/books         -> BookService.create(bookPayload)
 *     PUT  /api/books/{id}    -> BookService.update(id, bookPayload)
 *     DELETE /api/books/{id}  -> BookService.deletebooks(id)
 * - Para chamadas autenticadas, envie o token no header Authorization: Bearer <token>
 * - Trate erros (4xx/5xx) e atualize o estado local conforme a resposta do servidor
 */
const useAdminBooks = ({ initialDelay = 0 } = {}) => {
    const [books, setBooks] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        // Carrega catálogo via BookService. Em produção, BookService chamará o backend.
        let mounted = true;
        (async () => {
            try {
                const all = await BookService.listbooks({ delay: initialDelay });
                if (mounted) setBooks(all.map(b => ({ ...b })));
            } catch (err) {
                console.error('Erro ao carregar livros:', err);
            }
        })();

        return () => { mounted = false; };
    }, [initialDelay]);

    const refresh = async () => {
        const all = await BookService.listbooks();
        setBooks(all.map(b => ({ ...b })));
    };
    const addBook = async (bookPayload) => {
        // Tenta criar via backend usando BookService; se falhar, faz fallback local.
        try {
            const created = await BookService.create(bookPayload);
            if (created && (created.id || created.title)) {
                setBooks(prev => [created, ...prev]);
                return created;
            }
        } catch (err) {
            console.warn('BookService.create falhou, usando fallback local', err);
        }

        // Fallback local: criamos um id incremental.
        const nextId = books.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
        const newBook = {
            id: nextId,
            isbn: bookPayload.isbn || `ISBN-${nextId}`,
            title: bookPayload.title || 'Título sem nome',
            author: bookPayload.author || 'Autor desconhecido',
            type: bookPayload.type || bookPayload.genre || 'Geral',
            year: bookPayload.year || '-',
            copiesLoaned: Number(bookPayload.copiesLoaned) || 0,
            cover: bookPayload.coverPreview || bookPayload.cover || `https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=BK${nextId}`,
            pdf: bookPayload.pdf ? (typeof bookPayload.pdf === 'string' ? bookPayload.pdf : URL.createObjectURL(bookPayload.pdf)) : undefined
        };

        setBooks(prev => [newBook, ...prev]);
        return newBook;
    };

    const updateBook = async (id, bookPayload) => {
        // Integração: tenta chamar BookService.update(id, payload), com fallback local
        try {
            const updatedFromServer = await BookService.update(id, bookPayload);
            if (updatedFromServer) {
                setBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updatedFromServer } : b)));
                return updatedFromServer;
            }
        } catch (err) {
            console.warn('BookService.update falhou, usando fallback local', err);
        }

        setBooks(prev => prev.map(b => {
            if (b.id !== id) return b;
            const updated = {
                ...b,
                isbn: bookPayload.isbn,
                title: bookPayload.title,
                author: bookPayload.author,
                type: bookPayload.type,
                year: bookPayload.year,
                copiesLoaned: Number(bookPayload.copiesLoaned)
            };

            if (bookPayload.coverPreview) updated.cover = bookPayload.coverPreview;
            if (bookPayload.pdf) updated.pdf = typeof bookPayload.pdf === 'string' ? bookPayload.pdf : URL.createObjectURL(bookPayload.pdf);

            return updated;
        }));
    };

    const deleteBook = async (id) => {
        // Tenta deletar no backend; se falhar, remove localmente.
        try {
            await BookService.deletebooks(id);
            setBooks(prev => prev.filter(b => b.id !== id));
        } catch (err) {
            console.warn('BookService.deletebooks falhou, removendo localmente', err);
            setBooks(prev => prev.filter(b => b.id !== id));
        }

        setSelectedIds(prev => {
            const copy = new Set(prev);
            copy.delete(id);
            return copy;
        });
    };

    const bulkDelete = async (idsSet) => {
        // idsSet: Set<number>
        // Tenta deletar cada um no backend; mesmo em caso de falha removemos localmente para consistência na UI.
        const ids = Array.from(idsSet);
        await Promise.all(ids.map(async (id) => {
            try {
                await BookService.deletebooks(id);
            } catch (err) {
                console.warn(`Falha ao deletar ${id} no servidor:`, err);
            }
        }));

        setBooks(prev => prev.filter(b => !idsSet.has(b.id)));
        setSelectedIds(new Set());
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const copy = new Set(prev);
            if (copy.has(id)) copy.delete(id); else copy.add(id);
            return copy;
        });
    };

    return {
        books,
        setBooks,
        selectedIds,
        addBook,
        updateBook,
        deleteBook,
        bulkDelete,
        toggleSelect,
        refresh
    };
};

export default useAdminBooks;
