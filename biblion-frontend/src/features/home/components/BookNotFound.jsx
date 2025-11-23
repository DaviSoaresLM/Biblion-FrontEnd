import React from 'react';

const BookNotFound = ({ onBack }) => {
    return (
        <main className="not-found" style={{ textAlign: 'center', padding: 40 }}>
            <h3>Livro não encontrado</h3>
            <p>O livro que você procura não está disponível.</p>
            <div style={{ marginTop: 18 }}>
                <button className="load-more-btn" onClick={onBack}>Voltar para a biblioteca</button>
            </div>
        </main>
    );
};

export default BookNotFound;
