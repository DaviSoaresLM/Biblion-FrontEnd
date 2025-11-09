import { useState } from 'react';

/**
 * useAdminForm
 *
 * Gerencia o estado do formulário de adicionar/atualizar livro.
 * Fornece helpers para mudança de campos, tratamento de arquivos e reset.
 *
 * Observações para integração com backend (Spring Boot):
 * - Ao enviar um livro com arquivos (capa/pdf), monte um FormData:
 *     const fd = new FormData();
 *     fd.append('title', form.title);
 *     fd.append('author', form.author);
 *     fd.append('cover', form.coverFile); // File
 *     fd.append('pdf', form.pdf); // File
 * - Envie o FormData para o endpoint POST/PUT com axios sem definir Content-Type
 *   (o browser adiciona o multipart boundary automaticamente).
 */
const initialForm = () => ({
    isbn: '',
    title: '',
    author: '',
    type: '',
    year: '',
    copiesLoaned: 0,
    pdf: null,
    coverFile: null,
    coverPreview: '',
    pdfName: '',
    coverName: ''
});

const useAdminForm = () => {
    const [form, setForm] = useState(initialForm());

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

    const resetForm = () => setForm(initialForm());

    const populateFromBook = (book) => {
        if (!book) return;
        setForm({
            isbn: book.isbn || '',
            title: book.title || '',
            author: book.author || '',
            type: book.type || book.genre || '',
            year: book.year || '',
            copiesLoaned: book.copiesLoaned ?? 0,
            pdf: book.pdf || null,
            coverFile: null,
            coverPreview: book.cover || '',
            pdfName: '',
            coverName: ''
        });
    };

    const getFormData = () => {
        // Converte o estado do form em FormData (para envios multipart ao backend)
        const fd = new FormData();
        fd.append('isbn', form.isbn || '');
        fd.append('title', form.title || '');
        fd.append('author', form.author || '');
        fd.append('type', form.type || '');
        fd.append('year', form.year || '');
        fd.append('copiesLoaned', String(form.copiesLoaned || 0));
        if (form.coverFile) fd.append('cover', form.coverFile);
        if (form.pdf) fd.append('pdf', form.pdf);
        return fd;
    };

    return {
        form,
        setForm,
        handleChange,
        handleFileChange,
        resetForm,
        populateFromBook,
        getFormData
    };
};

export default useAdminForm;
