import { BookService } from '../services/BookService.js';

export const getBookFromContext = async (allBooks, id, locationState) => {
    const bookId = Number(id);
    let book = null;
    if (Array.isArray(allBooks)) {
        book = allBooks.find(b => Number(b.id) === bookId) || null;
    }

    if (!book && locationState && locationState.book) {
        book = locationState.book;
    }

    if (!book) {
        // fallback: tentar buscar no backend
        try {
            book = await BookService.getBook(bookId);
        } catch (err) {
            console.warn('Erro ao buscar book do backend:', err?.message || err);
            book = null;
        }
    }

    return book;
};

export const getPdfUrl = (book) => {
    if (!book) return null;
    return book.pdf || book.pdfPath || book.pdfUrl || null;
};

export default { getBookFromContext, getPdfUrl };
