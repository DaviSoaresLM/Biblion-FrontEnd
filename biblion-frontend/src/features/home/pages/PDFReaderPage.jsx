import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../shared/styles/HomePage.css';
import './styles/PDFReader.css';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Sidebar from '../../shared/components/layout/Sidebar.jsx';
import PageHeader from '../../shared/components/layout/PageHeader.jsx';
import { PageLayout, MainLayout, SectionLayout } from '../../shared/components/layout/LayoutComponents.jsx';
import useNavigationActions from '../hooks/useNavigationActions.js';
import usePdfReader from '../hooks/usePdfReader.js';
import PDFReaderToolbar from '../components/PDFReaderToolbar.jsx';
import PDFContainer from '../../shared/components/ui/PDFContainer.jsx';

const PDFReaderPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { handleMyLibraryClick, handleWishlistClick, handleLogout, navigate } = useNavigationActions();
    const { isAuthenticated, user } = useAuth();

    const {
        loading,
        pdfUrl,
        title,
        textMode,
        toggleTextMode,
        twoColumns,
        toggleTwoColumns,
        zoom,
        setZoom,
        textContent,
        book
    } = usePdfReader(id, location.search, location.state);

    const paramsNow = new URLSearchParams(location.search);
    const srcParamNow = paramsNow.get('src');

    // Se houver PDF, src ou texto, renderizar modo leitor em tela cheia (navbar fina + iframe)
    const shouldShowReaderFullscreen = !!(srcParamNow || pdfUrl || textContent);

    if (shouldShowReaderFullscreen) {
        return (
            <div className="reader-fullscreen">
                <header className="reader-navbar">
                    <div className="nav-left">
                        <button className="small-btn" onClick={() => navigate(-1)}>Voltar</button>
                    </div>
                    <div className="nav-center">
                        <strong className="reader-title">{title}</strong>
                    </div>
                    <div className="nav-right" />
                </header>

                <div className="reader-fullbody">
                    <PDFContainer loading={loading} pdfUrl={pdfUrl || srcParamNow} textMode={textMode} textContent={textContent} twoColumns={twoColumns} zoom={zoom} />
                </div>
            </div>
        );
    }

    // early-return: se já carregou e não há book, src nem pdfUrl, exibe mensagem simples
    if (!loading && !srcParamNow && !book && !pdfUrl) {
        return (
            <PageLayout>
                <Sidebar isAuthenticated={isAuthenticated} user={user} currentPage="home" onMyLibraryClick={handleMyLibraryClick} onWishlistClick={handleWishlistClick} onLogout={handleLogout} />

                <MainLayout>
                    <PageHeader title={'Livro não encontrado'} subtitle={''} />
                    <SectionLayout>
                        <main className="not-found">
                            <h3>Livro não encontrado</h3>
                            <p>Não foi possível localizar este livro para leitura.</p>
                            <div style={{ marginTop: 18 }}>
                                <button className="load-more-btn" onClick={() => navigate('/home/user/HomePage')}>Voltar para a biblioteca</button>
                            </div>
                        </main>
                    </SectionLayout>
                </MainLayout>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Sidebar isAuthenticated={isAuthenticated} user={user} currentPage="home" onMyLibraryClick={handleMyLibraryClick} onWishlistClick={handleWishlistClick} onLogout={handleLogout} />

            <MainLayout>
                <PageHeader title={title} subtitle="Leitor de PDF" />

                <SectionLayout>
                    <div className="pdf-reader-wrapper">
                        <div className="book-page">
                            <PDFReaderToolbar
                                onBack={() => navigate(-1)}
                                onOpenOriginal={pdfUrl}
                                hasPdf={!loading && !!pdfUrl}
                                textMode={textMode}
                                toggleTextMode={toggleTextMode}
                                twoColumns={twoColumns}
                                toggleTwoColumns={toggleTwoColumns}
                                zoom={zoom}
                                setZoom={setZoom}
                            />

                            <PDFContainer loading={loading} pdfUrl={pdfUrl} textMode={textMode} textContent={textContent} twoColumns={twoColumns} zoom={zoom} />
                        </div>
                    </div>
                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default PDFReaderPage;
