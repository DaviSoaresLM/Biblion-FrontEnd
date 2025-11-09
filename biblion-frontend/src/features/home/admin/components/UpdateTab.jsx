import React from 'react';
import BookForm from './BookForm.jsx';

/**
 * UpdateTab
 * - Wrapper simples para o BookForm no modo de edição
 */
const UpdateTab = ({ form, handleChange, handleFileChange, onSubmit, onCancel }) => {
    return (
        <BookForm mode="edit" form={form} handleChange={handleChange} handleFileChange={handleFileChange} onSubmit={onSubmit} onCancel={onCancel} />
    );
};

export default UpdateTab;
