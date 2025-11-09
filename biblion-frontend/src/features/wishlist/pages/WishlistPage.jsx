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

const WishlistPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const { allBooks } = useBooks();
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadWishlistBooks();
        }
    }, [isAuthenticated]);

    const loadWishlistBooks = () => {
        setTimeout(() => {
            // Construir wishlist diretamente a partir do catálogo (ids escolhidos com capas locais)
            const wishlistIds = [4, 9, 13, 7, 8]; // 4: Fundamentos, 9: Use a Cabeça JS, 13: Dragões de Éter, 7: Turma da Mônica, 8: Use a Cabeça Java
            const merged = wishlistIds.map((id, idx) => {
                const found = allBooks.find(b => Number(b.id) === Number(id));
                return {
                    id,
                    title: found?.title || `Livro ${id}`,
                    author: found?.author || '',
                    cover: found?.cover || '',
                    description: found?.description,
                    addedDate: ['2024-01-20', '2024-01-18', '2024-01-15', '2024-01-12', '2024-01-10'][idx] || null
                };
            });
            setWishlistBooks(merged);
            setLoading(false);
        }, 1000);
    };

    const handleRemoveFromWishlist = (bookId) => {
        setWishlistBooks(prev => prev.filter(book => book.id !== bookId));
    };

    const handleBookClick = (bookId) => {
        const found = wishlistBooks.find(b => Number(b.id) === Number(bookId));
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
                    currentPage="wishlist"
                    onMyLibraryClick={() => {}}
                    onWishlistClick={handleWishlistClick}
                    onLogout={handleLogout}
                />

                <MainLayout>
                    <AccessRestricted
                        title="Acesso Restrito"
                        message="Você precisa estar logado para acessar sua lista de desejos"
                        actionText="Fazer Login"
                        actionUrl={`/auth/login?next=${encodeURIComponent('/home/user/WishlistPage')}`}
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
                currentPage="wishlist"
                onMyLibraryClick={handleMyLibraryClick}
                onWishlistClick={handleWishlistClick}
                onLogout={handleLogout}
            />

            <MainLayout>
                <PageHeader
                    title="Lista de Desejos"
                    subtitle="Livros que você deseja ler"
                />

                <SectionLayout>
                    <SectionHeader
                        title="Meus Desejos"
                        subtitle="Livros adicionados à sua lista de desejos"
                    />
                    
                    {loading ? (
                        <LoadingState message="Carregando sua lista de desejos..." />
                    ) : wishlistBooks.length > 0 ? (
                        <BooksGrid 
                            books={wishlistBooks}
                            onRemove={handleRemoveFromWishlist}
                            showRemoveButton={true}
                            onBookClick={handleBookClick}
                        />
                    ) : (
                        <EmptyState
                            title="Nenhum livro na lista de desejos"
                            message="Comece explorando nossa biblioteca e adicione livros à sua lista de desejos!"
                            actionText="Explorar Biblioteca"
                            actionUrl="/home/user/HomePage"
                        />
                    )}
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default WishlistPage;