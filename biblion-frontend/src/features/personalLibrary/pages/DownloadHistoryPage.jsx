import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import '../../shared/styles/HomePage.css';

// Components
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../shared/components/layout/SectionHeader.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';
import { LoadingState, EmptyState, AccessRestricted } from '../../shared/components/content/ContentComponents.jsx';

const DownloadHistoryPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            // carregar histórico mock
            setTimeout(() => {
                const mock = [
                    { id: 1, fileName: 'curso-intensivo-de-python.pdf', bookTitle: 'Curso Intensivo de Python', date: '2025-10-01 14:22', size: '2.1 MB' },
                    { id: 2, fileName: 'use-a-cabeca-javascript.pdf', bookTitle: 'Use a Cabeça! JavaScript', date: '2025-09-20 09:10', size: '1.6 MB' },
                    { id: 3, fileName: 'fundamentos-de-engenharia.pdf', bookTitle: 'Fundamentos de Engenharia de Dados', date: '2025-08-13 18:45', size: '3.8 MB' }
                ];
                setHistory(mock);
                setLoading(false);
            }, 300);
        }
    }, [isAuthenticated]);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/auth/login');
    };

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

    if (!isAuthenticated) {
        return (
            <PageLayout>
                <Sidebar isAuthenticated={isAuthenticated} user={user} currentPage="downloads" onMyLibraryClick={handleMyLibraryClick} onWishlistClick={handleWishlistClick} onLogout={handleLogout} />
                <MainLayout>
                    <AccessRestricted
                        title="Acesso Restrito"
                        message="Você precisa estar logado para ver seu histórico de downloads"
                        actionText="Fazer Login"
                        actionUrl={`/auth/login?next=${encodeURIComponent('/home/user/DownloadHistoryPage')}`}
                    />
                </MainLayout>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Sidebar isAuthenticated={isAuthenticated} user={user} currentPage="downloads" onMyLibraryClick={handleMyLibraryClick} onWishlistClick={handleWishlistClick} onLogout={handleLogout} />

            <MainLayout>
                <PageHeader title="Histórico de Downloads" subtitle="Seus downloads recentes" />

                <SectionLayout>
                    <SectionHeader title="Downloads" subtitle="Arquivos baixados por você" />

                    {loading ? (
                        <LoadingState message="Carregando histórico..." />
                    ) : history.length === 0 ? (
                        <EmptyState
                            title="Nenhum download encontrado"
                            message="Você ainda não fez downloads. Explore a biblioteca e baixe um livro!"
                            actionText="Explorar Biblioteca"
                            actionUrl="/home/user/HomePage"
                        />
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Arquivo</th>
                                        <th style={thStyle}>Livro</th>
                                        <th style={thStyle}>Data</th>
                                        <th style={thStyle}>Tamanho</th>
                                        <th style={thStyle}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(h => (
                                        <tr key={h.id} style={{ borderTop: '1px solid #e6e6e6' }}>
                                            <td style={tdStyle}>{h.fileName}</td>
                                            <td style={tdStyle}>{h.bookTitle}</td>
                                            <td style={tdStyle}>{h.date}</td>
                                            <td style={tdStyle}>{h.size}</td>
                                            <td style={tdStyle}>
                                                <a href="#" className="quick-view-btn" onClick={(e) => { e.preventDefault(); alert('Ação de abrir arquivo (simulada)'); }}>Abrir</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

const thStyle = { textAlign: 'left', padding: '12px', color: '#2c3e50' };
const tdStyle = { padding: '12px', verticalAlign: 'middle' };

export default DownloadHistoryPage;
