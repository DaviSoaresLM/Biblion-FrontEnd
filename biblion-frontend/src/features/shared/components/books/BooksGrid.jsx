import React from 'react';

const BookCard = ({ book, onBookClick, onRemove, showRemoveButton = false }) => {
    return (
        <article className="book-card" onClick={() => onBookClick && onBookClick(book.id)}>
            <div className="book-cover">
                <img src={book.cover} alt={book.title} />
                {showRemoveButton && onRemove && (
                    <div className="book-overlay">
                        <button 
                            className="quick-view-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(book.id);
                            }}
                            style={{ backgroundColor: '#ff6b6b', color: 'white' }}
                        >
                            Remover
                        </button>
                    </div>
                )}
            </div>
            <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                {book.savedDate && (
                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                        Salvo em: {new Date(book.savedDate).toLocaleDateString('pt-BR')}
                    </p>
                )}
                {book.addedDate && (
                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '5px' }}>
                        Adicionado em: {new Date(book.addedDate).toLocaleDateString('pt-BR')}
                    </p>
                )}
            </div>
        </article>
    );
};

const BooksGrid = ({ books, onBookClick, onRemove, showRemoveButton = false }) => {
    if (!books || books.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3>Nenhum livro encontrado</h3>
                <p>Comece explorando nossa biblioteca!</p>
            </div>
        );
    }

    return (
        <div className="books-grid">
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    onBookClick={onBookClick}
                    onRemove={onRemove}
                    showRemoveButton={showRemoveButton}
                />
            ))}
        </div>
    );
};

export default BooksGrid;
