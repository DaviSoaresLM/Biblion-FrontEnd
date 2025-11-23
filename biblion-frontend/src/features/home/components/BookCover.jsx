import React from 'react';

const BookCover = ({ book }) => {
    return (
        <aside className="book-cover">
            {book && book.cover ? (
                <img src={book.cover} alt={book.title} className="book-cover-img" />
            ) : (
                <div className="book-cover-placeholder">
                    <div className="emoji">📘</div>
                    <div className="no-cover-text">Sem capa</div>
                </div>
            )}
        </aside>
    );
};

export default BookCover;
