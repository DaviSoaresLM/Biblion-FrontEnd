import api from '../../../config/AxiosConfig.jsx';

/**
 * BookService
 * - Chamadas ao backend.
 * - Endpoints esperados:
 *   - Público: GET /api/books/preview, GET /api/books/{id}
 *   - Admin:  GET /api/admin/books, POST /api/admin/books, PUT /api/admin/books/{id}, DELETE /api/admin/books/{id}
 */
export const BookService = {
    async listBooks() {
        const res = await api.get('/api/admin/books');
        return res.data;
    },

    async getBook(id) {
        const res = await api.get(`/api/books/${id}`);
        return res.data;
    },

    async listPreviewBooks() {
        const res = await api.get('/api/books/preview');
        return res.data;
    },

    async createBook(payload) {
        // payload pode ser FormData ou objeto simples
        const res = await api.post('/api/admin/books', payload);
        return res.data;
    },

    async updateBook(id, payload) {
        const res = await api.put(`/api/admin/books/${id}`, payload);
        return res.data;
    },

    async deleteBook(id) {
        const res = await api.delete(`/api/admin/books/${id}`);
        return res.data;
    }
};

// aliases para compatibilidade
BookService.create = BookService.createBook;
BookService.listbooks = BookService.listBooks;
BookService.update = BookService.updateBook;
BookService.deletebooks = BookService.deleteBook;

export default BookService;
