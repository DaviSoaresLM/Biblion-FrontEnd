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

const MyLibraryPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [savedBooks, setSavedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            loadSavedBooks();
        }
    }, [isAuthenticated]);

    const loadSavedBooks = () => {
        setTimeout(() => {
            const mockSavedBooks = [
                { id: 1, title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=HP1", savedDate: "2024-01-15" },
                { id: 2, title: "O Senhor dos Anéis: A Sociedade do Anel", author: "J.R.R. Tolkien", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=LOTR1", savedDate: "2024-01-10" },
                { id: 3, title: "Percy Jackson e o Ladrão de Raios", author: "Rick Riordan", cover: "https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=PJ1", savedDate: "2024-01-05" }
            ];
            setSavedBooks(mockSavedBooks);
            setLoading(false);
        }, 1000);
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
                currentPage="library"
                onMyLibraryClick={() => {}}
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
                        <BooksGrid books={savedBooks} />
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