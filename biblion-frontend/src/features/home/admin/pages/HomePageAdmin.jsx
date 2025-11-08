import React, { useMemo, useState, useEffect } from 'react';
import '../../../shared/styles/HomePage.css';

// Layout components
import { PageLayout, MainLayout, SidebarLayout, SectionLayout } from '../../../shared/components/layout/LayoutComponents.jsx';
import PageHeader from '../../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../../shared/components/layout/SectionHeader.jsx';
import { useBooks } from '../../../home/hooks/useBooks.js';

import { SidebarHeader, SidebarFooter } from '../../../shared/components/layout/SidebarComponents.jsx';

const AdminSidebar = ({ currentTab, setCurrentTab, user }) => {
    return (
        <SidebarLayout>
            <SidebarHeader />

            <div className="sidebar-menu">
                <h3>ACERVO</h3>
                <nav className="sidebar-nav">
                    <a href="#" className={`nav-item ${currentTab === 'listar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('listar'); }}>Listar</a>
                    <a href="#" className={`nav-item ${currentTab === 'adicionar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('adicionar'); }}>Adicionar</a>
                    <a href="#" className={`nav-item ${currentTab === 'atualizar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('atualizar'); }}>Atualizar</a>
                    <a href="#" className={`nav-item ${currentTab === 'deletar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('deletar'); }}>Deletar</a>
                </nav>
            </div>

            <SidebarFooter isAuthenticated={!!user} user={user} onLogout={() => { /* noop - Admin logout handled in main */ }} />
        </SidebarLayout>
    );
};

const BooksTable = ({ books, onEdit, onDelete, selectable = false, onSelectToggle, selectedIds = new Set() }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        {selectable && <th style={thStyle}></th>}
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>ISBN</th>
                        <th style={thStyle}>TÍTULO</th>
                        <th style={thStyle}>AUTOR</th>
                        <th style={thStyle}>TIPO</th>
                        <th style={thStyle}>ANO</th>
                        <th style={thStyle}>CÓPIAS EM EMPRÉSTIMO</th>
                        <th style={thStyle}>AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((b) => (
                        <tr key={b.id} style={{ borderTop: '1px solid #e6e6e6' }}>
                            {selectable && (
                                <td style={tdStyle}>
                                    <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => onSelectToggle && onSelectToggle(b.id)} />
                                </td>
                            )}
                            
                            <td style={tdStyle}>{b.id}</td>
                            <td style={tdStyle}>{b.isbn || '-'}</td>
                            <td style={tdStyle}>{b.title}</td>
                            <td style={tdStyle}>{b.author}</td>
                            <td style={tdStyle}>{b.type || b.genre || '-'}</td>
                            <td style={tdStyle}>{b.year || '-'}</td>
                            <td style={tdStyle}>{b.copiesLoaned ?? 0}</td>
                            <td style={tdStyle}>
                                {onEdit && <button className="quick-view-btn" onClick={() => onEdit(b.id)} style={{ marginRight: 8 }}>Editar</button>}
                                {onDelete && <button className="quick-view-btn" onClick={() => onDelete(b.id)} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>Deletar</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = { textAlign: 'left', padding: '12px', color: '#2c3e50' };
const tdStyle = { padding: '12px', verticalAlign: 'middle' };

const AdminMain = () => {
    const { allBooks } = useBooks();
    const [books, setBooks] = useState([]);
    const [currentTab, setCurrentTab] = useState('listar');
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());

    // Form state for add/update
    const [form, setForm] = useState({ isbn: '', title: '', author: '', type: '', year: '', copiesLoaned: 0, pdf: null, coverFile: null, coverPreview: '', pdfName: '', coverName: '' });

    const genres = useMemo(() => {
        const set = new Set(books.map(b => b.type || b.genre).filter(Boolean));
        return ['all', ...Array.from(set)];
    }, [books]);

    const filteredBooks = books.filter(b => {
        const matchesQuery = searchQuery.trim() === '' || [b.title, b.author, b.isbn].some(f => f && f.toString().toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGenre = genreFilter === 'all' || (b.type || b.genre) === genreFilter;
        return matchesQuery && matchesGenre;
    });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (name === 'pdf') {
            setForm(prev => ({ ...prev, pdf: file, pdfName: file.name }));
        } else if (name === 'cover') {
            const preview = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, coverFile: file, coverPreview: preview, coverName: file.name }));
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const nextId = books.reduce((max, b) => Math.max(max, b.id || 0), 0) + 1;
        const newBook = {
            id: nextId,
            isbn: form.isbn || `ISBN-${nextId}`,
            title: form.title || 'Título sem nome',
            author: form.author || 'Autor desconhecido',
            type: form.type || form.genre || 'Geral',
            year: form.year || '-',
            copiesLoaned: Number(form.copiesLoaned) || 0,
            cover: form.coverPreview || form.cover || `https://via.placeholder.com/150x200/2C3E50/FFFFFF?text=BK${nextId}`,
            pdf: form.pdf ? URL.createObjectURL(form.pdf) : undefined
        };
        setBooks(prev => [newBook, ...prev]);
        setForm({ isbn: '', title: '', author: '', type: '', year: '', copiesLoaned: 0, pdf: null, coverFile: null, coverPreview: '' });
        setCurrentTab('listar');
    };

    const handleEdit = (id) => {
        const book = books.find(b => b.id === id);
        if (!book) return;
        setSelectedBookId(id);
    setForm({ isbn: book.isbn || '', title: book.title || '', author: book.author || '', type: book.type || book.genre || '', year: book.year || '', copiesLoaned: book.copiesLoaned ?? 0, coverPreview: book.cover || '', pdf: book.pdf || null });
        setCurrentTab('atualizar');
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (selectedBookId == null) return;
        setBooks(prev => prev.map(b => {
            if (b.id !== selectedBookId) return b;
            const updated = {
                ...b,
                isbn: form.isbn,
                title: form.title,
                author: form.author,
                type: form.type,
                year: form.year,
                copiesLoaned: Number(form.copiesLoaned)
            };

            if (form.coverPreview) updated.cover = form.coverPreview;

            if (form.pdf) {
                // form.pdf might be a File or a string (existing url)
                updated.pdf = typeof form.pdf === 'string' ? form.pdf : URL.createObjectURL(form.pdf);
            }

            return updated;
        }));

        setSelectedBookId(null);
        setForm({ isbn: '', title: '', author: '', type: '', year: '', copiesLoaned: 0, pdf: null, coverFile: null, coverPreview: '' });
        setCurrentTab('listar');
    };

    const handleDelete = (id) => {
        if (!window.confirm('Deseja realmente deletar este livro?')) return;
        setBooks(prev => prev.filter(b => b.id !== id));
        setSelectedIds(prev => {
            const copy = new Set(prev);
            copy.delete(id);
            return copy;
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const copy = new Set(prev);
            if (copy.has(id)) copy.delete(id); else copy.add(id);
            return copy;
        });
    };

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return alert('Nenhum livro selecionado');
        if (!window.confirm(`Deletar ${selectedIds.size} livros selecionados?`)) return;
        setBooks(prev => prev.filter(b => !selectedIds.has(b.id)));
        setSelectedIds(new Set());
    };

    return (
        <PageLayout>
            <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} user={{ email: 'admin@admin.com' }} />

            <MainLayout>
                <PageHeader title={<span className="small-title">Painel Administrativo</span>} subtitle="Gerencie o acervo da biblioteca" />

                <SectionLayout>
                    <SectionHeader title="Acervo" subtitle="Gerencie livros: listar, adicionar, atualizar e deletar" />

                    {/* Controls common to some tabs */}
                    {(currentTab === 'listar' || currentTab === 'deletar') && (
                        <div className="search-section" style={{ marginBottom: 16 }}>
                            <div className="search-container">
                                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                                    <div className="search-input-group">
                                        <input className="search-input" placeholder="Pesquisar por título, autor ou ISBN" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                        <select className="search-input" style={{ maxWidth: 240 }} value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                                            {genres.map(g => <option key={g} value={g}>{g === 'all' ? 'Todos os gêneros' : g}</option>)}
                                        </select>
                                        <button className="search-button" onClick={() => { /* placeholder for search */ }}>Pesquisar</button>
                                    </div>
                                </form>

                                {currentTab === 'deletar' && (
                                    <div style={{ marginTop: 12 }}>
                                        <button className="load-more-btn" onClick={handleBulkDelete} style={{ backgroundColor: '#ff6b6b' }}>Deletar Selecionados</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentTab === 'listar' && (
                        <BooksTable books={filteredBooks} onEdit={handleEdit} onDelete={handleDelete} selectable={false} />
                    )}

                    {currentTab === 'adicionar' && (
                        <div className="search-section">
                            <div className="search-container">
                                <form onSubmit={handleAdd} className="search-form">
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
                                        <button className="search-button" type="submit">Adicionar Livro</button>
                                        <button type="button" className="pagination-btn" onClick={() => setCurrentTab('listar')}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {currentTab === 'atualizar' && (
                        <div>
                            {!selectedBookId && (
                                <div>
                                    <p>Selecione um livro na lista para editar.</p>
                                    <BooksTable books={filteredBooks} onEdit={handleEdit} onDelete={null} />
                                </div>
                            )}

                            {selectedBookId && (
                                <div className="search-section">
                                    <div className="search-container">
                                        <form onSubmit={handleUpdate} className="search-form">
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

                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <button className="search-button" type="submit">Salvar Alterações</button>
                                                <button type="button" className="pagination-btn" onClick={() => { setSelectedBookId(null); setCurrentTab('listar'); }}>Cancelar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {currentTab === 'deletar' && (
                        <div>
                            <BooksTable books={filteredBooks} onEdit={null} onDelete={handleDelete} selectable={true} onSelectToggle={toggleSelect} selectedIds={selectedIds} />
                        </div>
                    )}

                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default AdminMain;
