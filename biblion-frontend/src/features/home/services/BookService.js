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
        // admin: GET /books
        const res = await api.get('/books');
        return res.data;
    },

    async getBook(id) {
        // public details: GET /books/details?id={id}
        const res = await api.get('/books/details', { params: { id } });
        return res.data;
    },

    async listPreviewBooks() {
        // public preview list: GET /books/home
        const res = await api.get('/books/home');
        return res.data;
    },

    async createBook(payload) {
        // payload deve ser FormData com 'data' JSON + pdf + image
        const res = await api.post('/books', payload);
        return res.data;
    },

    async updateBook(id, payload) {
        const res = await api.put(`/books/${id}`, payload);
        return res.data;
    },

    async deleteBook(id) {
        const res = await api.delete(`/books/${id}`);
        return res.data;
    }
};

// aliases para compatibilidade
BookService.create = BookService.createBook;
BookService.listbooks = BookService.listBooks;
BookService.update = BookService.updateBook;
BookService.deletebooks = BookService.deleteBook;

export default BookService;
