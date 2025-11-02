import { useState, useMemo } from 'react';
import cursoPython from '../../../assets/images/covers/curso-intensivo-de-python.jpg';
import decifrando from '../../../assets/images/covers/decifrando-arquitetura-de-dados.jpg';
import essencialismo from '../../../assets/images/covers/essencialismo-greg-mckeown.jpg';
import fundamentos from '../../../assets/images/covers/funddamentos-de-engenharia-de-dados.jpg';
import logicaJs from '../../../assets/images/covers/Llogica-de-programacao-crie-seus-primeiros-programas-usando-javascript.jpg';
import pythonWes from '../../../assets/images/covers/python-para-analise-de-dados-wes-mckinney.jpg';
import turmaMonica from '../../../assets/images/covers/turma-monica-lendas-brasileiras.webp';
import useJava from '../../../assets/images/covers/use-a-cabeca-java.jpg';
import useJs from '../../../assets/images/covers/use-a-cabeca-javascript.jpg';
import usePadroes from '../../../assets/images/covers/use-a-cabeca-padroes-de-projetos.jpg';

export const useBooks = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(15);
    const [showLoadMore, setShowLoadMore] = useState(true);

    // Lista completa de livros
    const allBooks = [
        { id: 1, title: "Curso Intensivo de Python", author: "Eric Matthes", cover: cursoPython },
        { id: 2, title: "Decifrando Arquitetura de Dados", author: "James Serra", cover: decifrando },
        { id: 3, title: "Essencialismo", author: "Greg McKeown", cover: essencialismo },
        { id: 4, title: "Fundamentos de Engenharia de Dados", author: "Joe Reis e Matt Housley", cover: fundamentos },
        { id: 5, title: "Lógica de Programação", author: "Paulo Silveira e Adriano Almeida", cover: logicaJs },
        { id: 6, title: "Python para Análise de Dados", author: "Wes McKinney", cover: pythonWes },
        { id: 7, title: "Turma da Mônica: Lendas Brasileiras", author: "Mauricio de Sousa", cover: turmaMonica },
        { id: 8, title: "Use a Cabeça! Java", author: "Kathy Sierra", cover: useJava },
        { id: 9, title: "Use a Cabeça! JavaScript", author: "Michael Morrison", cover: useJs },
        { id: 10, title: "Use a Cabeça! Padrões de Projetos", author: "Eric Freeman", cover: usePadroes },
        { id: 11, title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR1" },
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
