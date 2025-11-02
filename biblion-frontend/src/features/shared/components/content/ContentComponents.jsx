import React from 'react';

const LoadingState = ({ message = "Carregando..." }) => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>{message}</p>
    </div>
);

const EmptyState = ({ title, message, actionText, actionUrl }) => (
    <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>{title}</h3>
        <p>{message}</p>
        {actionText && actionUrl && (
            <a 
                href={actionUrl} 
                className="load-more-btn" 
                style={{ textDecoration: 'none', display: 'inline-block', marginTop: '20px' }}
            >
                {actionText}
            </a>
        )}
    </div>
);

const AccessRestricted = ({ title, message, actionText, actionUrl }) => (
    <>
        <header className="page-header">
            <h1>{title}</h1>
            <p>{message}</p>
        </header>

        <section className="books-section">
            <div className="section-header">
                <h2>Faça login para continuar</h2>
                <p>Entre com sua conta para continuar</p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <a 
                    href={actionUrl} 
                    className="load-more-btn" 
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                    {actionText}
                </a>
            </div>
        </section>
    </>
);

const SearchForm = () => (
    <form className="search-form">
        <div className="search-input-group">
            <input
                type="text"
                placeholder="Pesquise por título, autor ou gênero"
                className="search-input"
            />
            <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
                Pesquisar
            </button>
        </div>
    </form>
);

const GenreFilters = () => (
    <div className="filters-container">
        <h4>Gêneros:</h4>
        <div className="filter-tags">
            <button className="filter-tag active">Todos</button>
            <button className="filter-tag">Fantasia</button>
            <button className="filter-tag">Ficção Científica</button>
            <button className="filter-tag">Romance</button>
            <button className="filter-tag">Mistério</button>
            <button className="filter-tag">Thriller</button>
            <button className="filter-tag">Aventura</button>
            <button className="filter-tag">História</button>
            <button className="filter-tag">Biografia</button>
            <button className="filter-tag">Autoajuda</button>
            <button className="filter-tag">Negócios</button>
            <button className="filter-tag">Tecnologia</button>
            <button className="filter-tag">Saúde</button>
        </div>
    </div>
);

export { 
    LoadingState, 
    EmptyState, 
    AccessRestricted, 
    SearchForm, 
    GenreFilters 
};
