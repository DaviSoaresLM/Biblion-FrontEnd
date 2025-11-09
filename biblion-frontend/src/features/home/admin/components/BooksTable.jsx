import React from 'react';

const thStyle = { textAlign: 'left', padding: '12px', color: '#2c3e50' };
const tdStyle = { padding: '12px', verticalAlign: 'middle' };

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

export default BooksTable;
