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
            navigate('/auth/login');
        }
    };

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/home/user/WishlistPage');
        } else {
            navigate('/auth/login');
        }
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
            </MainLayout>
        </PageLayout>
    );
};

export default HomePage;