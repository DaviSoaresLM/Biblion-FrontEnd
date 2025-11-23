import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getPdfUrl } from '../utils/bookUtils.js';

const BookActions = ({ book }) => {
    const navigate = useNavigate();
    const bookId = book?.id;

    const handleRead = () => {
        // Sempre navegar para a página de leitura; o hook `usePdfReader` fará fallback para o PDF local se necessário
        navigate(`/book/${bookId}/read`);
    };

    const handleDownload = () => {
        const pdfUrl = getPdfUrl(book);
        if (pdfUrl) window.open(pdfUrl, '_blank');
        else alert('PDF não disponível para download');
    };

    return (
        <nav className="book-actions" aria-label="Ações do livro">
            <button className="search-button" onClick={handleRead}>Ler Agora</button>
            <button className="search-button" onClick={handleDownload}>Baixar PDF</button>
            <button className="pagination-btn" onClick={() => navigate(-1)}>Voltar</button>
        </nav>
    );
};

export default BookActions;
