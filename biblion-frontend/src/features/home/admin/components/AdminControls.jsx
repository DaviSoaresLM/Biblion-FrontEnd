import React from 'react';

const AdminControls = ({ searchQuery, setSearchQuery, genreFilter, setGenreFilter, genres = [], onBulkDelete, currentTab }) => {
    return (
        <div className="search-section" style={{ marginBottom: 16 }}>
            <div className="search-container">
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="search-input-group">
                        <input className="search-input" placeholder="Pesquisar por título, autor ou ISBN" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <select className="search-input" style={{ maxWidth: 240 }} value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                            {genres.map(g => <option key={g} value={g}>{g === 'all' ? 'Todos os gêneros' : g}</option>)}
                        </select>
                        <button className="search-button" onClick={() => { /* placeholder for search */ }}>Pesquisar</button>
                    </div>
                </form>

                {currentTab === 'deletar' && (
                    <div style={{ marginTop: 12 }}>
                        <button className="load-more-btn" onClick={onBulkDelete} style={{ backgroundColor: '#ff6b6b' }}>Deletar Selecionados</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminControls;
