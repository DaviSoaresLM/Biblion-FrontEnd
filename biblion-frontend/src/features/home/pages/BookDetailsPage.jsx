import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import '../../shared/styles/HomePage.css';

// Layout components
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../shared/components/layout/SectionHeader.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';

const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allBooks } = useBooks();
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    const handleMyLibraryClick = (e) => {
        e && e.preventDefault();
        if (isAuthenticated) navigate('/home/user/MyLibraryPage');
        else navigate(`/auth/login?next=${encodeURIComponent('/home/user/MyLibraryPage')}`);
    };

    const handleWishlistClick = (e) => {
        e && e.preventDefault();
        if (isAuthenticated) navigate('/home/user/WishlistPage');
        else navigate(`/auth/login?next=${encodeURIComponent('/home/user/WishlistPage')}`);
    };

    const handleLogout = (e) => {
        e && e.preventDefault();
        logout();
        navigate('/auth/login');
    };

    const bookId = Number(id);
    // Primeiro tenta achar no catálogo principal
    let book = allBooks.find(b => Number(b.id) === bookId) || null;

    // Se não encontrou, pode ter vindo de uma lista local (Minha Biblioteca / Wishlist)
    // passada via navigation state: navigate(path, { state: { book } })
    if (!book && location && location.state && location.state.book) {
        book = location.state.book;
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
                <PageHeader title={book ? book.title : 'Livro não encontrado'} subtitle={book ? `por ${book.author}` : ''} />

                <SectionLayout>
                    <SectionHeader title="Detalhes do Livro" subtitle="Informações e ações disponíveis" />

                    {!book ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <h3>Livro não encontrado</h3>
                            <p>O livro que você procura não está disponível.</p>
                            <div style={{ marginTop: 18 }}>
                                <button className="load-more-btn" onClick={() => navigate('/home/user/HomePage')}>Voltar para a biblioteca</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ minWidth: 220, maxWidth: 320, flex: '0 0 320px' }}>
                                {book.cover ? (
                                    <img src={book.cover} alt={book.title} style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }} />
                                ) : (
                                    <div style={{ width: '100%', height: 420, borderRadius: 12, background: 'linear-gradient(135deg,#e6eefc,#f3f5ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#556', border: '1px dashed rgba(0,0,0,0.06)' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 54 }}>📘</div>
                                            <div style={{ marginTop: 8, color: '#6b7280' }}>Sem capa</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: 260 }}>
                                <h2 style={{ marginTop: 0 }}>{book.title}</h2>
                                <p style={{ color: '#7f8c8d', marginTop: 6, marginBottom: 18 }}>Autor: <strong style={{ color: '#2c3e50' }}>{book.author}</strong></p>

                                <p style={{ color: '#444', lineHeight: 1.6 }}>
                                    {/* Texto de descrição mock — substituir por dado real quando houver backend */}
                                    {book.description || 'Descrição não disponível no momento. Esta é uma versão de pré-visualização do layout de detalhes do livro.'}
                                </p>

                                <div style={{ marginTop: 22, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                    {/* Ler agora: navega para o leitor de PDF */}
                                    <button
                                        className="search-button"
                                        onClick={() => {
                                            const pdfUrl = book.pdf || book.pdfPath || book.pdfUrl || null;
                                            if (pdfUrl) {
                                                navigate(`/book/${bookId}/read`);
                                            } else {
                                                alert('PDF não disponível para este livro');
                                            }
                                        }}
                                    >
                                        Ler Agora
                                    </button>

                                    <button
                                        className="search-button"
                                        onClick={() => {
                                            const pdfUrl = book.pdf || book.pdfPath || book.pdfUrl || null;
                                            if (pdfUrl) window.open(pdfUrl, '_blank');
                                            else alert('PDF não disponível para download');
                                        }}
                                    >
                                        Baixar PDF
                                    </button>

                                    <button className="pagination-btn" onClick={() => navigate(-1)}>Voltar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default BookDetailsPage;
