import React from 'react';

const BookForm = ({ mode = 'add', form, handleChange, handleFileChange, onSubmit, onCancel }) => {
    return (
        <div className="search-section">
            <div className="search-container">
                <form onSubmit={onSubmit} className="search-form">
                    <div className="search-input-group" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
                        <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" className="search-input" style={{ maxWidth: 260 }} />
                        <input name="title" value={form.title} onChange={handleChange} placeholder="Título" className="search-input" style={{ flex: 1 }} />
                        <input name="author" value={form.author} onChange={handleChange} placeholder="Autor" className="search-input" style={{ maxWidth: 260 }} />
                    </div>

                    <div className="search-input-group" style={{ marginBottom: 12 }}>
                        <input name="type" value={form.type} onChange={handleChange} placeholder="Gênero / Tipo" className="search-input" style={{ maxWidth: 260 }} />
                        <input name="year" value={form.year} onChange={handleChange} placeholder="Ano" className="search-input" style={{ maxWidth: 140 }} />
                        <input name="copiesLoaned" value={form.copiesLoaned} onChange={handleChange} placeholder="Cópias em empréstimo" type="number" className="search-input" style={{ maxWidth: 220 }} />
                    </div>

                    <div className="search-input-group file-input" style={{ marginBottom: 12, alignItems: 'center' }}>
                        <label className="file-btn">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', color: '#2c3e50' }}>Arquivo PDF</span>
                                <button type="button" className="file-choose-btn" onClick={() => document.getElementById('pdf-input').click()}>Selecionar PDF</button>
                            </div>
                            <span className="file-name">{form.pdfName || 'Nenhum arquivo selecionado'}</span>
                            <input name="pdf" id="pdf-input" type="file" accept="application/pdf" onChange={handleFileChange} className="file-input-el" />
                        </label>

                        <label className="file-btn">
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.9rem', color: '#2c3e50' }}>Imagem da Capa</span>
                                <button type="button" className="file-choose-btn" onClick={() => document.getElementById('cover-input').click()}>Selecionar imagem</button>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span className="file-name">{form.coverName || 'Nenhuma imagem'}</span>
                                {form.coverPreview && (
                                    <img src={form.coverPreview} alt="preview" className="file-preview" />
                                )}
                            </div>
                            <input name="cover" id="cover-input" type="file" accept="image/*" onChange={handleFileChange} className="file-input-el" />
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="search-button" type="submit">{mode === 'add' ? 'Adicionar Livro' : 'Salvar Alterações'}</button>
                        <button type="button" className="pagination-btn" onClick={onCancel}>{mode === 'add' ? 'Cancelar' : 'Cancelar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
