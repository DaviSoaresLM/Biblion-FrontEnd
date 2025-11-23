import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth.js';
import '../../shared/styles/HomePage.css';
import '../styles/BookDetails.css';

// Layout components
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../shared/components/layout/SectionHeader.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';

// Book pieces
import BookCover from '../components/BookCover.jsx';
import BookDescription from '../components/BookDescription.jsx';
import BookActions from '../components/BookActions.jsx';

// Hooks / utils
import useNavigationActions from '../hooks/useNavigationActions.js';
import useBook from '../hooks/useBook.js';
import BookNotFound from '../components/BookNotFound.jsx';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    // usar hook de navegação centralizado
    const { handleMyLibraryClick, handleWishlistClick, handleLogout } = useNavigationActions();

    const { book, loading } = useBook(id, location.state);
    // early-return para caso não encontre livro (após carregar)
    if (!loading && !book) {
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
                    <PageHeader title={'Livro não encontrado'} subtitle={''} />
                    <SectionLayout>
                        <SectionHeader title="Detalhes do Livro" subtitle="Informações e ações disponíveis" />
                        <BookNotFound onBack={() => navigate('/home/user/HomePage')} />
                    </SectionLayout>
                </MainLayout>
            </PageLayout>
        );
    }

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
                <PageHeader title={book ? book.title : 'Livro'} subtitle={book ? `por ${book.author}` : ''} />

                <SectionLayout>
                    <SectionHeader title="Detalhes do Livro" subtitle="Informações e ações disponíveis" />

                    <article className="book-details-article">
                        {/* Cover */}
                        {book && <BookCover book={book} />}

                        {/* Info */}
                        <main className="book-info-main">
                            <h2 className="book-title">{book?.title}</h2>
                            <p className="book-author">Autor: <strong style={{ color: '#2c3e50' }}>{book?.author}</strong></p>

                            {book && <BookDescription book={book} />}

                            {book && <BookActions book={book} />}
                        </main>
                    </article>
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default BookDetailsPage;
