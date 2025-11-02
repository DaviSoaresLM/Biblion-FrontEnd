import React from 'react';
import { SidebarLayout, SidebarHeader, SidebarMenu, SidebarFooter } from './SidebarComponents.jsx';

const Sidebar = ({ 
    isAuthenticated, 
    user, 
    currentPage, 
    onMyLibraryClick, 
    onWishlistClick, 
    onLogout 
}) => {
    return (
        <SidebarLayout>
            <SidebarHeader />
            <SidebarMenu
                currentPage={currentPage}
                onMyLibraryClick={onMyLibraryClick}
                onWishlistClick={onWishlistClick}
                isAuthenticated={isAuthenticated}
            />
            <SidebarFooter
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={onLogout}
            />
        </SidebarLayout>
    );
};

export default Sidebar;
