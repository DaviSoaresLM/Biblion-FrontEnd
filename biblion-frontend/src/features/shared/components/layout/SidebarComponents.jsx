import React from 'react';

const Logo = () => (
    <div className="logo">
        <h2>Biblion</h2>
    </div>
);

const UserInfo = ({ user }) => (
    <div className="user-info" style={{ padding: '10px 20px', color: '#ccc', fontSize: '0.9rem' }}>
        <p>Logado como: {user?.email}</p>
    </div>
);

const NavigationMenu = ({ 
    currentPage, 
    onMyLibraryClick, 
    onWishlistClick, 
    isAuthenticated 
}) => (
    <nav className="sidebar-nav">
        <a href="/home/user/HomePage" className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}>
            Home
        </a>
        <a href="#" className={`nav-item ${currentPage === 'library' ? 'active' : ''}`} onClick={onMyLibraryClick}>
            Minha Biblioteca
        </a>
        <a href="#" className={`nav-item ${currentPage === 'wishlist' ? 'active' : ''}`} onClick={onWishlistClick}>
            Lista de Desejos
        </a>
        {isAuthenticated && (
            <a href="#" className="nav-item">
                Downloads
            </a>
        )}
    </nav>
);

const SidebarHeader = () => (
    <div className="sidebar-header">
        <Logo />
    </div>
);

const SidebarMenu = ({ 
    currentPage, 
    onMyLibraryClick, 
    onWishlistClick, 
    isAuthenticated 
}) => (
    <div className="sidebar-menu">
        <h3>MENU</h3>
        <NavigationMenu
            currentPage={currentPage}
            onMyLibraryClick={onMyLibraryClick}
            onWishlistClick={onWishlistClick}
            isAuthenticated={isAuthenticated}
        />
    </div>
);

const SidebarFooter = ({ isAuthenticated, user, onLogout }) => (
    <div className="sidebar-footer">
        {isAuthenticated ? (
            <>
                <UserInfo user={user} />
                <a href="#" className="nav-item logout" onClick={onLogout}>
                    Sair
                </a>
            </>
        ) : (
            <a href="/auth/login" className="nav-item logout">
                Entrar
            </a>
        )}
    </div>
);

const SidebarLayout = ({ children }) => (
    <aside className="sidebar">
        {children}
    </aside>
);

export { 
    Logo, 
    UserInfo, 
    NavigationMenu, 
    SidebarHeader, 
    SidebarMenu, 
    SidebarFooter,
    SidebarLayout
};
