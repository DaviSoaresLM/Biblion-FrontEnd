import React, { useMemo, useState, useCallback } from 'react';
import '../../../shared/styles/HomePage.css';

// layout & shared
import { PageLayout, MainLayout, SectionLayout } from '../../../shared/components/layout/LayoutComponents.jsx';
import PageHeader from '../../../shared/components/layout/PageHeader.jsx';
import SectionHeader from '../../../shared/components/layout/SectionHeader.jsx';

// admin components/hooks
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminControls from '../components/AdminControls.jsx';
import BooksTable from '../components/BooksTable.jsx';
import ListTab from '../components/ListTab.jsx';
import AddTab from '../components/AddTab.jsx';
import UpdateTab from '../components/UpdateTab.jsx';
import DeleteTab from '../components/DeleteTab.jsx';

import useAdminBooks from '../hooks/useAdminBooks.js';
import useAdminForm from '../hooks/useAdminForm.js';
import useFilteredBooks from '../hooks/useFilteredBooks.js';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth.js';

/**
 * HomePageAdmin
 *
 * Documentação rápida para integração com backend (Java + Spring Boot):
 * - Endpoints esperados (exemplos REST):
 *     GET  /api/books           -> lista livros (paginação opcional)
 *     GET  /api/books/{id}      -> obtém detalhes de um livro
 *     POST /api/books           -> cria um livro (multipart/form-data para arquivos)
 *     PUT  /api/books/{id}      -> atualiza um livro (multipart/form-data opcional)
 *     DELETE /api/books/{id}    -> remove um livro
 * - Autorização: rotas administrativas devem exigir um token JWT enviado no header
 *     Authorization: Bearer <token>
 * - Arquivos (PDF/capa): envie como multipart/form-data. No backend, armazene os arquivos
 *   (s3/local) e retorne URLs públicas para `cover` e `pdf` no recurso do livro.
 * - Consistência de dados: o frontend espera que o payload do livro contenha pelo menos
 *   { id, title, author, cover, isbn, type, year, copiesLoaned, pdf }
 * - Como integrar aqui: estenda `src/features/home/services/BookService.js` para chamar
 *   os endpoints acima e, no hook `useAdminBooks`, substitua as operações locais por
 *   chamadas `BookService.create`, `BookService.update`, `BookService.deletebooks`.
 */

const AdminMain = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    // Hook que apresenta a lista e operações de CRUD (no futuro: chamará backend via BookService)
    const { books, addBook, updateBook, deleteBook, bulkDelete, toggleSelect, selectedIds } = useAdminBooks();

    // Hook para gerenciar estado do formulário (add/update)
    const { form, handleChange, handleFileChange, resetForm, populateFromBook, getFormData } = useAdminForm();

    const [currentTab, setCurrentTab] = useState('listar');
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [selectedBookId, setSelectedBookId] = useState(null);

    // Observação: books agora carregado pelo hook useAdminBooks via BookService.

    // Separação de responsabilidade: lógica de filtros isolada em hook
    const { filteredBooks, genres } = useFilteredBooks(books, searchQuery, genreFilter);

    // form handlers provindos por useAdminForm: handleChange, handleFileChange

    // Helpers reutilizáveis para reduzir repetição
    const confirmAndRun = useCallback(async (message, action) => {
        if (!window.confirm(message)) return;
        await action();
    }, []);

    const resetAndList = useCallback(() => {
        resetForm();
        setSelectedBookId(null);
        setCurrentTab('listar');
    }, [resetForm]);

    const handleAdd = useCallback(async (e) => {
        e.preventDefault();
        await addBook(form);
        resetAndList();
    }, [addBook, form, resetAndList]);

    const handleEdit = useCallback((id) => {
        const book = books.find(b => b.id === id);
        if (!book) return;
        setSelectedBookId(id);
        populateFromBook(book);
        setCurrentTab('atualizar');
    }, [books, populateFromBook]);

    const handleUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (selectedBookId == null) return;
        await updateBook(selectedBookId, form);
        resetAndList();
    }, [selectedBookId, updateBook, form, resetAndList]);

    const handleDelete = useCallback((id) => confirmAndRun('Deseja realmente deletar este livro?', () => deleteBook(id)), [deleteBook, confirmAndRun]);

    // toggleSelect está disponível via hook useAdminBooks

    const handleBulkDelete = useCallback(() => confirmAndRun(`Deletar ${selectedIds.size} livros selecionados?`, () => bulkDelete(selectedIds)), [selectedIds, bulkDelete, confirmAndRun]);

    return (
        <PageLayout>
            <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} user={user} onLogout={() => { logout(); navigate('/admin/login'); }} />

            <MainLayout>
                <PageHeader title={<span className="small-title">Painel Administrativo</span>} subtitle="Gerencie o acervo da biblioteca" />

                <SectionLayout>
                    <SectionHeader title="Acervo" subtitle="Gerencie livros: listar, adicionar, atualizar e deletar" />

                    {/* Controls common to some tabs */}
                    {(['listar','deletar'].includes(currentTab)) && (
                        <AdminControls {...{ searchQuery, setSearchQuery, genreFilter, setGenreFilter, genres, onBulkDelete: handleBulkDelete, currentTab }} />
                    )}

                    {(() => {
                        const renderTab = () => ({
                            listar: <ListTab books={filteredBooks} onEdit={handleEdit} onDelete={handleDelete} />,
                            adicionar: <AddTab form={form} handleChange={handleChange} handleFileChange={handleFileChange} onSubmit={handleAdd} onCancel={resetAndList} />,
                            atualizar: selectedBookId ? <UpdateTab form={form} handleChange={handleChange} handleFileChange={handleFileChange} onSubmit={handleUpdate} onCancel={resetAndList} /> : (
                                <div>
                                    <p>Selecione um livro na lista para editar.</p>
                                    <BooksTable books={filteredBooks} onEdit={handleEdit} onDelete={null} />
                                </div>
                            ),
                            deletar: <DeleteTab books={filteredBooks} selectedIds={selectedIds} onSelectToggle={toggleSelect} onBulkDelete={handleBulkDelete} />
                        })[currentTab] || null;

                        return renderTab();
                    })()}

                </SectionLayout>
            </MainLayout>
        </PageLayout>
    );
};

export default AdminMain;
