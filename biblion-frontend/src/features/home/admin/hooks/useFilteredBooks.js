import { useMemo } from 'react';

/**
 * useFilteredBooks
 * - Separa a lógica de filtragem e extração de gêneros para o admin
 * - Retorna { filteredBooks, genres }
 *
 * Observação: mantive a implementação síncrona para desempenho local. Quando
 * a lista vier do backend, a filtragem continua válida no cliente para UX.
 */
const useFilteredBooks = (books = [], searchQuery = '', genreFilter = 'all') => {
  const genres = useMemo(() => {
    const s = new Set(books.map(b => b.type || b.genre).filter(Boolean));
    return ['all', ...Array.from(s)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    return books.filter(b => {
      const matchesQuery = q === '' || [b.title, b.author, b.isbn].some(f => f && String(f).toLowerCase().includes(q));
      const matchesGenre = genreFilter === 'all' || (b.type || b.genre) === genreFilter;
      return matchesQuery && matchesGenre;
    });
  }, [books, searchQuery, genreFilter]);

  return { filteredBooks, genres };
};

export default useFilteredBooks;
