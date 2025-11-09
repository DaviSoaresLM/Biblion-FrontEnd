import React from 'react';
import BookForm from './BookForm.jsx';

/**
 * AddTab
 * - Wrapper simples para o BookForm no modo de adição
 */
const AddTab = ({ form, handleChange, handleFileChange, onSubmit, onCancel }) => {
    return (
        <BookForm mode="add" form={form} handleChange={handleChange} handleFileChange={handleFileChange} onSubmit={onSubmit} onCancel={onCancel} />
    );
};

export default AddTab;
