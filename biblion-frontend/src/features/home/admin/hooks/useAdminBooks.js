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
        // Chama o backend para criar o livro e atualiza o estado local com a resposta.
        const created = await BookService.create(bookPayload);
        if (created && (created.id || created.title)) {
            setBooks(prev => [created, ...prev]);
            return created;
        }
        // Se o servidor não retornar o novo recurso, lançamos erro para o chamador tratar.
        throw new Error('Resposta inválida ao criar livro');
    };

    const updateBook = async (id, bookPayload) => {
        // Atualiza via backend e aplica o resultado ao estado local.
        const updatedFromServer = await BookService.update(id, bookPayload);
        if (updatedFromServer) {
            setBooks(prev => prev.map(b => (b.id === id ? { ...b, ...updatedFromServer } : b)));
            return updatedFromServer;
        }
        throw new Error('Resposta inválida ao atualizar livro');
    };

    const deleteBook = async (id) => {
        // Deleta no backend e atualiza estado local apenas se sucesso.
        await BookService.deletebooks(id);
        setBooks(prev => prev.filter(b => b.id !== id));
        setSelectedIds(prev => {
            const copy = new Set(prev);
            copy.delete(id);
            return copy;
        });
    };

    const bulkDelete = async (idsSet) => {
        // idsSet: Set<number>
        const ids = Array.from(idsSet);
        await Promise.all(ids.map(async (id) => {
            await BookService.deletebooks(id);
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
