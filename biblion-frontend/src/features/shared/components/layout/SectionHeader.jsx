import React from 'react';

const SectionHeader = ({ title, subtitle }) => {
    return (
        <header className="section-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </header>
    );
};

export default SectionHeader;
