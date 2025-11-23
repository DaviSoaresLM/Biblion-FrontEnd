import { useState, useEffect } from 'react';
import { useBooks } from './useBooks.js';
import { getBookFromContext } from '../utils/bookUtils.js';

export const useBook = (id, locationState) => {
    const { allBooks } = useBooks();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setNotFound(false);

        (async () => {
            try {
                const b = await getBookFromContext(allBooks, id, locationState);
                if (!mounted) return;
                if (b) {
                    setBook(b);
                    setNotFound(false);
                } else {
                    setBook(null);
                    setNotFound(true);
                }
            } catch (err) {
                if (!mounted) return;
                console.warn('useBook: erro ao obter livro', err?.message || err);
                setBook(null);
                setNotFound(true);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [allBooks, id, locationState]);

    return { book, loading, notFound };
};

export default useBook;
