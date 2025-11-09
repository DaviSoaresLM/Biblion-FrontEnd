import React from 'react';
import BooksTable from './BooksTable.jsx';

/**
 * DeleteTab
 * - Exibe tabela com seleção para deletar em massa
 * - Recebe selectedIds e onSelectToggle, onBulkDelete
 */
const DeleteTab = ({ books = [], selectedIds = new Set(), onSelectToggle, onBulkDelete }) => {
    return (
        <div>
            <BooksTable books={books} onEdit={null} onDelete={null} selectable={true} onSelectToggle={onSelectToggle} selectedIds={selectedIds} />
            {/* Botão de ação principal é renderizado pelo AdminControls quando currentTab === 'deletar' */}
        </div>
    );
};

export default DeleteTab;
