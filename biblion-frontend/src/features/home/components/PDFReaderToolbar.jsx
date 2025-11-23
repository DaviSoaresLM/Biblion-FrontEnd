import React from 'react';
import ActionButton from '../../shared/components/ui/ActionButton.jsx';
import '../pages/styles/PDFReader.css';

const PDFReaderToolbar = ({ onBack, onOpenOriginal, hasPdf, textMode, toggleTextMode, twoColumns, toggleTwoColumns, zoom, setZoom }) => {
    return (
        <div className="reader-toolbar" role="toolbar" aria-label="Leitor de PDF Controles">
            <div className="left">
                <ActionButton onClick={onBack}>Fechar</ActionButton>
                {hasPdf && <a className="small-btn" href={onOpenOriginal} target="_blank" rel="noreferrer">Abrir original</a>}
                {textMode !== undefined && <ActionButton onClick={toggleTextMode}>{textMode ? 'Modo PDF' : 'Modo Texto'}</ActionButton>}
            </div>

            <div className="right">
                {textMode && (
                    <>
                        <label className="control-label">Colunas</label>
                        <ActionButton onClick={toggleTwoColumns}>{twoColumns ? '1' : '2'}</ActionButton>
                    </>
                )}
                <label className="control-label">Zoom</label>
                <input className="zoom-input" type="number" step="0.1" min="0.5" max="3" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value) || 1)} />
            </div>
        </div>
    );
};

export default PDFReaderToolbar;
