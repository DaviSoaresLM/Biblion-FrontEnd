import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <header className="page-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </header>
    );
};

export default PageHeader;
