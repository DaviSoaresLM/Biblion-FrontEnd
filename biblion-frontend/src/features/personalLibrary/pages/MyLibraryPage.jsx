import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useBooks } from '../../home/hooks/useBooks.js';
import { useNavigate } from 'react-router-dom';
import '../../shared/styles/HomePage.css';

// Components
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../shared/components/layout/SectionHeader.jsx';
import BooksGrid from '../../shared/components/books/BooksGrid.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';
import { LoadingState, EmptyState, AccessRestricted } from '../../shared/components/content/ContentComponents.jsx';

const MyLibraryPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const { allBooks } = useBooks();
    const [savedBooks, setSavedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadSavedBooks();
        }
    }, [isAuthenticated]);

    const loadSavedBooks = () => {
        setTimeout(() => {
            // Construir savedBooks diretamente a partir do catálogo
            const savedIds = [1, 11, 3]; // 
            const merged = savedIds.map((id, idx) => {
                const found = allBooks.find(b => Number(b.id) === Number(id));
                return {
                    id,
                    title: found?.title || `Livro ${id}`,
                    author: found?.author || '',
                    cover: found?.cover || '',
                    description: found?.description,
                    savedDate: ['2024-01-15', '2024-02-01', '2024-01-05'][idx] || null
                };
            });
            setSavedBooks(merged);
            setLoading(false);
        }, 1000);
    };

    const handleBookClick = (bookId) => {
        const found = savedBooks.find(b => Number(b.id) === Number(bookId));
        navigate(`/book/${bookId}`, { state: { book: found || { id: bookId } } });
    };

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/home/user/WishlistPage');
        } else {
            navigate(`/auth/login?next=${encodeURIComponent('/home/user/WishlistPage')}`);
        }
    };

    const handleMyLibraryClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            navigate('/home/user/MyLibraryPage');
        } else {
            navigate(`/auth/login?next=${encodeURIComponent('/home/user/MyLibraryPage')}`);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/auth/login');
    };

    if (!isAuthenticated) {
        return (
            <PageLayout>
                <Sidebar
                    isAuthenticated={isAuthenticated}
                    user={user}
                    currentPage="library"
                    onMyLibraryClick={() => {}}
                    onWishlistClick={handleWishlistClick}
                    onLogout={handleLogout}
                />

                <MainLayout>
                    <AccessRestricted
                        title="Acesso Restrito"
                        message="Você precisa estar logado para acessar sua biblioteca pessoal"
                        actionText="Fazer Login"
                        actionUrl={`/auth/login?next=${encodeURIComponent('/home/user/MyLibraryPage')}`}
                    />
                </MainLayout>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Sidebar
                isAuthenticated={isAuthenticated}
                user={user}
                currentPage="library"
                onMyLibraryClick={handleMyLibraryClick}
                onWishlistClick={handleWishlistClick}
                onLogout={handleLogout}
            />

            <MainLayout>
                <PageHeader
                    title="Minha Biblioteca"
                    subtitle="Seus livros salvos e favoritos"
                />

                <SectionLayout>
                    <SectionHeader
                        title="Livros Salvos"
                        subtitle="Livros que você salvou para leitura posterior"
                    />
                    
                    {loading ? (
                        <LoadingState message="Carregando seus livros..." />
                    ) : savedBooks.length > 0 ? (
                        <BooksGrid books={savedBooks} onBookClick={handleBookClick} />
                    ) : (
                        <EmptyState
                            title="Nenhum livro salvo ainda"
                            message="Comece explorando nossa biblioteca e salve seus livros favoritos!"
                            actionText="Explorar Biblioteca"
                            actionUrl="/home/user/HomePage"
                        />
                    )}
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default MyLibraryPage;
