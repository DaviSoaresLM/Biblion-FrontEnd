import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookService } from '../services/BookService.js';
import '../../shared/styles/HomePage.css';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';

const PDFReaderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [title, setTitle] = useState('Leitor de PDF');

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);

                // Permite ?src=... para testes locais sem backend
                const params = new URLSearchParams(location.search);
                const srcParam = params.get('src');
                if (srcParam) {
                    setPdfUrl(srcParam);
                    setTitle(params.get('title') || 'Leitor de PDF');
                    return;
                }

                const book = await BookService.getBook(id);
                if (!mounted) return;
                if (book) {
                    setTitle(book.title || 'Leitor de PDF');
                    setPdfUrl(book.pdf || book.pdfPath || book.pdfUrl || null);
                }
            } catch (err) {
                console.warn('Erro ao carregar livro para leitura:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [id, location.search]);

    const { isAuthenticated, user, logout } = useAuth();

    const handleMyLibraryClick = (e) => { e && e.preventDefault(); if (isAuthenticated) navigate('/home/user/MyLibraryPage'); else navigate(`/auth/login?next=${encodeURIComponent('/home/user/MyLibraryPage')}`); };
    const handleWishlistClick = (e) => { e && e.preventDefault(); if (isAuthenticated) navigate('/home/user/WishlistPage'); else navigate(`/auth/login?next=${encodeURIComponent('/home/user/WishlistPage')}`); };
    const handleLogout = (e) => { e && e.preventDefault(); logout(); navigate('/auth/login'); };

    return (
        <PageLayout>
            <Sidebar isAuthenticated={isAuthenticated} user={user} currentPage="home" onMyLibraryClick={handleMyLibraryClick} onWishlistClick={handleWishlistClick} onLogout={handleLogout} />

            <MainLayout>
                <PageHeader title={title} subtitle="Leitor de PDF" />

                <SectionLayout>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <button className="pagination-btn" onClick={() => navigate(-1)}>Fechar</button>
                        </div>
                        <div>
                            {!loading && pdfUrl ? <a className="search-button" href={pdfUrl} target="_blank" rel="noreferrer">Abrir original</a> : null}
                        </div>
                    </div>

                    <div style={{ height: '72vh', border: '1px solid #eee' }}>
                        {loading ? (
                            <div style={{ padding: 20 }}>Carregando...</div>
                        ) : !pdfUrl ? (
                            <div style={{ padding: 20 }}>PDF não disponível para este livro.</div>
                        ) : (
                            <iframe title={`Leitor - ${title}`} src={pdfUrl} style={{ width: '100%', height: '100%', border: 'none' }} />
                        )}
                    </div>
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default PDFReaderPage;
