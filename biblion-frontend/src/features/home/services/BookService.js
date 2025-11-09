import { booksCatalog } from '../data/booksCatalog.js';

const simulateDelay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * BookService (modo frontend-only)
 * - Implementação local que usa `booksCatalog` como fonte única.
 * - Mantém API assíncrona (Promisses/async) para facilitar futura troca pela versão com backend.
 */

// Mantemos uma cópia mutável em memória para simular CRUD durante o desenvolvimento frontend-only.
let localCatalog = booksCatalog.slice();

export const BookService = {
    async listBooks({ delay = 0 } = {}) {
        if (delay > 0) await simulateDelay(delay);
        // Retorna cópia para evitar mutações externas
        return localCatalog.map(b => ({ ...b }));
    },

    async getBook(id, { delay = 0 } = {}) {
        if (delay > 0) await simulateDelay(delay);
        const book = localCatalog.find(b => String(b.id) === String(id));
        return book ? { ...book } : null;
    },

    async listPreviewBooks() {
        return localCatalog.map(b => ({ id: b.id, title: b.title, author: b.author, coverPath: b.cover, description: b.description || '' }));
    },

    async createBook(payload) {
        // payload pode ser FormData ou objeto simples
        const nextId = localCatalog.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
        let created = {
            id: nextId,
            isbn: payload?.isbn || `ISBN-${nextId}`,
            title: payload?.title || (payload instanceof FormData ? payload.get('title') : 'Título sem nome'),
            author: payload?.author || (payload instanceof FormData ? payload.get('author') : 'Autor desconhecido'),
            type: payload?.type || (payload instanceof FormData ? payload.get('type') : 'Geral'),
            year: payload?.year || (payload instanceof FormData ? payload.get('year') : '-'),
            copiesLoaned: Number(payload?.copiesLoaned || (payload instanceof FormData ? payload.get('copiesLoaned') : 0)) || 0,
            cover: undefined,
            pdf: undefined,
            description: payload?.description || (payload instanceof FormData ? payload.get('description') : '')
        };

        if (payload instanceof FormData) {
            const coverFile = payload.get('cover');
            const pdfFile = payload.get('pdf');
            if (coverFile && typeof URL !== 'undefined' && typeof coverFile !== 'string') {
                created.cover = URL.createObjectURL(coverFile);
            } else if (payload.get('coverPath')) {
                created.cover = payload.get('coverPath');
            }
            if (pdfFile && typeof URL !== 'undefined' && typeof pdfFile !== 'string') {
                created.pdf = URL.createObjectURL(pdfFile);
            } else if (payload.get('pdfPath')) {
                created.pdf = payload.get('pdfPath');
            }
        } else {
            created.cover = payload?.cover;
            created.pdf = payload?.pdf;
        }

        // fallback cover
        if (!created.cover) created.cover = `https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=BK${nextId}`;

        localCatalog = [created, ...localCatalog];
        return { ...created };
    },

    async updateBook(id, payload) {
        const idx = localCatalog.findIndex(b => String(b.id) === String(id));
        if (idx === -1) throw new Error('Livro não encontrado');
        const existing = localCatalog[idx];
        const updated = { ...existing };

        if (payload instanceof FormData) {
            updated.title = payload.get('title') || updated.title;
            updated.author = payload.get('author') || updated.author;
            updated.isbn = payload.get('isbn') || updated.isbn;
            const coverFile = payload.get('cover');
            if (coverFile && typeof URL !== 'undefined' && typeof coverFile !== 'string') {
                updated.cover = URL.createObjectURL(coverFile);
            } else if (payload.get('coverPath')) {
                updated.cover = payload.get('coverPath');
            }
        } else {
            updated.title = payload.title ?? updated.title;
            updated.author = payload.author ?? updated.author;
            updated.isbn = payload.isbn ?? updated.isbn;
            updated.cover = payload.cover ?? updated.cover;
        }

        localCatalog[idx] = updated;
        return { ...updated };
    },

    async deleteBook(id) {
        const before = localCatalog.length;
        localCatalog = localCatalog.filter(b => String(b.id) !== String(id));
        return localCatalog.length < before;
    }
};

// aliases mantidos
BookService.create = BookService.createBook;
BookService.listbooks = BookService.listBooks;
BookService.update = BookService.updateBook;
BookService.deletebooks = BookService.deleteBook;

export default BookService;
