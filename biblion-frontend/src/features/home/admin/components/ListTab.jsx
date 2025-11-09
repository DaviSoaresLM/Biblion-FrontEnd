import React from 'react';
import BooksTable from './BooksTable.jsx';

/**
 * ListTab
 * - Exibe a tabela de livros (modo leitura)
 * - Recebe handlers de edição/remoção via props
 */
const ListTab = ({ books = [], onEdit, onDelete }) => {
    return (
        <div>
            <BooksTable books={books} onEdit={onEdit} onDelete={onDelete} selectable={false} />
        </div>
    );
};

export default ListTab;
