import React from 'react';

const ActionButton = ({ children, onClick, className = '', type = 'button', title }) => {
    return (
        <button type={type} className={`small-btn ${className}`} onClick={onClick} title={title}>
            {children}
        </button>
    );
};

export default ActionButton;
