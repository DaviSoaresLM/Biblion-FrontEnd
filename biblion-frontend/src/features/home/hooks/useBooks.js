import { useState, useMemo, useEffect } from 'react';
import { BookService } from '../services/BookService.js';

export const useBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(15);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carrega livros via o serviço (backend). Em caso de erro a lista ficará vazia.
    useEffect(() => {
        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const list = await BookService.listBooks({ delay: 0 });
                if (!mounted) return;
                setAllBooks(Array.isArray(list) ? list : []);
            } catch (err) {
                if (!mounted) return;
                // Em caso de erro de rede ou outro problema, caímos para o catálogo local
                setAllBooks([]);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, []);

    // Calcular livros para a página atual
    const totalBooks = allBooks.length;
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const displayedBooks = allBooks.slice(startIndex, endIndex);

    // Gerar números das páginas para exibição
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const handleLoadMore = () => {
        setBooksPerPage(30);
        setShowLoadMore(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return {
        allBooks,
        loading,
        displayedBooks,
        currentPage,
        totalPages,
        booksPerPage,
        showLoadMore,
        getPageNumbers,
        handleLoadMore,
        handlePageChange
    };
};
