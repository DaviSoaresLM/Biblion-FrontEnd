import { useState, useMemo } from 'react';

export const useBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(15);
    const [showLoadMore, setShowLoadMore] = useState(true);

    // Lista completa de livros
    const allBooks = [
        { id: 1, title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP1" },
        { id: 2, title: "Harry Potter e a Câmara Secreta", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP2" },
        { id: 3, title: "Harry Potter e o Prisioneiro de Azkaban", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP3" },
        { id: 4, title: "Harry Potter e o Cálice de Fogo", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP4" },
        { id: 5, title: "Harry Potter e a Ordem da Fênix", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP5" },
        { id: 6, title: "Harry Potter e o Enigma do Príncipe", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP6" },
        { id: 7, title: "Harry Potter e as Relíquias da Morte", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP7" },
        { id: 8, title: "Harry Potter e a Criança Amaldiçoada", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP8" },
        { id: 9, title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR1" },
        { id: 10, title: "O Senhor dos Anéis: As Duas Torres", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR2" },
        { id: 11, title: "O Senhor dos Anéis: O Retorno do Rei", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR3" },
        { id: 12, title: "O Hobbit", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HOBBIT" },
        { id: 13, title: "Percy Jackson e o Ladrão de Raios", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ1" },
        { id: 14, title: "Percy Jackson e o Mar de Monstros", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ2" },
        { id: 15, title: "Percy Jackson e a Maldição do Titã", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ3" },
        { id: 16, title: "Percy Jackson e a Batalha do Labirinto", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ4" },
        { id: 17, title: "Percy Jackson e o Último Olimpiano", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ5" },
        { id: 18, title: "O Último Desejo", author: "Andrzej Sapkowski", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=WITCHER1" },
        { id: 19, title: "A Espada do Destino", author: "Andrzej Sapkowski", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=WITCHER2" },
        { id: 20, title: "O Sangue dos Elfos", author: "Andrzej Sapkowski", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=WITCHER3" },
        { id: 21, title: "Jogos Vorazes", author: "Suzanne Collins", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HG1" },
        { id: 22, title: "Em Chamas", author: "Suzanne Collins", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HG2" },
        { id: 23, title: "A Esperança", author: "Suzanne Collins", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HG3" },
        { id: 24, title: "A Canção do Assassino", author: "Patrick Rothfuss", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=KKC1" }
    ];

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
