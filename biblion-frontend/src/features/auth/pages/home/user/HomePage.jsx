import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useBooks } from '../../../hooks/useBooks.js';
import '../../../styles/HomePage.css';

// Components
import Sidebar from '../../../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../../../shared/components/layout/PageHeader.jsx';
import SearchSection from '../../../../shared/components/search/SearchSection.jsx';
import SectionHeader from '../../../../shared/components/layout/SectionHeader.jsx';
import BooksGrid from '../../../../shared/components/books/BooksGrid.jsx';
import Pagination from '../../../../shared/components/navigation/Pagination.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../../../shared/components/layout/LayoutComponents.jsx';

const HomePage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [showAuthPrompt, setShowAuthPrompt] = React.useState(false);
    const [authPromptTarget, setAuthPromptTarget] = React.useState(null); // 'library' | 'wishlist'
    const {
        displayedBooks,
        currentPage,
        totalPages,
        showLoadMore,
        getPageNumbers,
        handleLoadMore,
        handlePageChange
    } = useBooks();

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const handleMyLibraryClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/home/user/MyLibraryPage');
        } else {
            setAuthPromptTarget('library');
            setShowAuthPrompt(true);
        }
    };

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/home/user/WishlistPage');
        } else {
            setAuthPromptTarget('wishlist');
            setShowAuthPrompt(true);
        }
    };

    const proceedToLogin = () => {
        setShowAuthPrompt(false);
        const targetPath = authPromptTarget === 'library' ? '/home/user/MyLibraryPage' : authPromptTarget === 'wishlist' ? '/home/user/WishlistPage' : '/home/user/HomePage';
        navigate(`/auth/login?next=${encodeURIComponent(targetPath)}`);
    };

    const cancelAuthPrompt = () => {
        setShowAuthPrompt(false);
        setAuthPromptTarget(null);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        window.location.reload();
    };

    return (
        <PageLayout>
            <Sidebar
                isAuthenticated={isAuthenticated}
                user={user}
                currentPage="home"
                onMyLibraryClick={handleMyLibraryClick}
                onWishlistClick={handleWishlistClick}
                onLogout={handleLogout}
            />

            <MainLayout>
                <PageHeader 
                    title="Bem-vindo à Biblion"
                    subtitle="Descubra milhares de livros e expanda seu conhecimento"
                />

                <SearchSection />

                <SectionLayout>
                    <SectionHeader 
                        title="Títulos"
                        subtitle="Clique em um livro para saber mais"
                    />
                    
                    <BooksGrid 
                        books={displayedBooks}
                        onBookClick={handleBookClick}
                    />
                    
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageNumbers={getPageNumbers()}
                        onPageChange={handlePageChange}
                        showLoadMore={showLoadMore}
                        onLoadMore={handleLoadMore}
                    />
                </SectionLayout>
                {showAuthPrompt && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                        <div style={{ background: 'white', borderRadius: 12, padding: 24, maxWidth: 520, width: '90%', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', textAlign: 'center' }}>
                            <h3 style={{ marginTop: 0 }}>Você não está logado</h3>
                            <p style={{ color: '#666' }}>Para acessar esta área é necessário fazer login. Deseja ir para a tela de login?</p>
                            <div style={{ marginTop: 18, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                <button className="load-more-btn" onClick={proceedToLogin}>Ir para Login</button>
                                <button className="pagination-btn" onClick={cancelAuthPrompt}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}
            </MainLayout>
        </PageLayout>
    );
};

export default HomePage;