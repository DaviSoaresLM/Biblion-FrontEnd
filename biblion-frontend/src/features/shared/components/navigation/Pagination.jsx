import React from 'react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    pageNumbers, 
    onPageChange, 
    showLoadMore, 
    onLoadMore 
}) => {
    if (totalPages <= 1 && !showLoadMore) {
        return null;
    }

    return (
        <nav>
            {showLoadMore && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={onLoadMore}>
                        Ver Mais
                    </button>
                </div>
            )}
            
            {totalPages > 1 && (
                <div className="pagination-container">
                    <button 
                        className="pagination-btn"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        «
                    </button>
                    
                    {pageNumbers.map((page, index) => (
                        <button
                            key={index}
                            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                            disabled={page === '...'}
                            aria-label={typeof page === 'number' ? `Página ${page}` : 'Mais páginas'}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button 
                        className="pagination-btn"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Próxima página"
                    >
                        »
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Pagination;
