import React from 'react';

const Toolbar = ({ left, right, className = '' }) => {
    return (
        <nav className={`reader-toolbar ${className}`} aria-label="Reader toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="left">{left}</div>
            <div className="right">{right}</div>
        </nav>
    );
};

export default Toolbar;
