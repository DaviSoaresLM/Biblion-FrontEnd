import React from 'react';

const PDFContainer = ({ loading, pdfUrl, textMode, textContent, twoColumns, zoom }) => {
    return (
        <main className="reader-frame-wrapper" role="main">
            {loading ? (
                <div style={{ padding: 20 }}>Carregando...</div>
            ) : textMode && textContent ? (
                <article className={`reader-content ${twoColumns ? 'two-columns' : ''}`} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                    <div dangerouslySetInnerHTML={{ __html: textContent }} />
                </article>
            ) : !pdfUrl ? (
                <section style={{ padding: 20 }}>PDF não disponível para este livro.</section>
            ) : (
                <iframe title={`Leitor`} src={pdfUrl} className="reader-frame" loading="lazy" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} />
            )}
        </main>
    );
};

export default PDFContainer;
