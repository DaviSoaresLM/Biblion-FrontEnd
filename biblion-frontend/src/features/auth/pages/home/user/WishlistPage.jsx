import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import '../../../styles/HomePage.css';

// Components
import Sidebar from '../../../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../../../shared/components/layout/SectionHeader.jsx';
import BooksGrid from '../../../../shared/components/books/BooksGrid.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../../../shared/components/layout/LayoutComponents.jsx';
import { LoadingState, EmptyState, AccessRestricted } from '../../../../shared/components/content/ContentComponents.jsx';

const WishlistPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadWishlistBooks();
        }
    }, [isAuthenticated]);

    const loadWishlistBooks = () => {
        setTimeout(() => {
            const mockWishlistBooks = [
                { id: 4, title: "Harry Potter e o Cálice de Fogo", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP4", addedDate: "2024-01-20" },
                { id: 9, title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR1", addedDate: "2024-01-18" },
                { id: 13, title: "Percy Jackson e o Ladrão de Raios", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ1", addedDate: "2024-01-15" },
                { id: 21, title: "Jogos Vorazes", author: "Suzanne Collins", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HG1", addedDate: "2024-01-12" },
                { id: 24, title: "A Canção do Assassino", author: "Patrick Rothfuss", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=KKC1", addedDate: "2024-01-10" }
            ];
            setWishlistBooks(mockWishlistBooks);
            setLoading(false);
        }, 1000);
    };

    const handleRemoveFromWishlist = (bookId) => {
        setWishlistBooks(prev => prev.filter(book => book.id !== bookId));
    };

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            window.location.href = '/home/user/WishlistPage';
        } else {
            window.location.href = '/auth/login';
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        window.location.href = '/auth/login';
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
                        actionUrl="/auth/login"
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
                onMyLibraryClick={() => {}}
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