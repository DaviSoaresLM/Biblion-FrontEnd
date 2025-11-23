import React from 'react';

const BookDescription = ({ book }) => {
    return (
        <section className="book-description" aria-label="Descrição do livro">
            <p className="book-description-text">
                {book.description || 'Descrição não disponível no momento. Esta é uma versão de pré-visualização do layout de detalhes do livro.'}
            </p>
        </section>
    );
};

export default BookDescription;
