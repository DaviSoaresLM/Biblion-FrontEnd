import React from 'react';

const PageLayout = ({ children, className = '' }) => {
    return (
        <div className={`homepage ${className}`}>
            {children}
        </div>
    );
};

const MainLayout = ({ children }) => {
    return (
        <main className="main-content">
            <div className="content-wrapper">
                {children}
            </div>
        </main>
    );
};

const SidebarLayout = ({ children }) => {
    return (
        <aside className="sidebar">
            {children}
        </aside>
    );
};

const SectionLayout = ({ children, className = '' }) => {
    return (
        <section className={`books-section ${className}`}>
            {children}
        </section>
    );
};

const HeaderLayout = ({ children, className = '' }) => {
    return (
        <header className={`page-header ${className}`}>
            {children}
        </header>
    );
};

export { PageLayout, MainLayout, SidebarLayout, SectionLayout, HeaderLayout };
