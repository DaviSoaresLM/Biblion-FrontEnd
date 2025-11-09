import React from 'react';
import { SidebarLayout } from '../../../shared/components/layout/LayoutComponents.jsx';
import { SidebarHeader, SidebarFooter } from '../../../shared/components/layout/SidebarComponents.jsx';

const AdminSidebar = ({ currentTab, setCurrentTab, user, onLogout }) => {
    return (
        <SidebarLayout>
            <SidebarHeader />

            <div className="sidebar-menu">
                <h3>ACERVO</h3>
                <nav className="sidebar-nav">
                    <a href="#" className={`nav-item ${currentTab === 'listar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('listar'); }}>Listar</a>
                    <a href="#" className={`nav-item ${currentTab === 'adicionar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('adicionar'); }}>Adicionar</a>
                    <a href="#" className={`nav-item ${currentTab === 'atualizar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('atualizar'); }}>Atualizar</a>
                    <a href="#" className={`nav-item ${currentTab === 'deletar' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentTab('deletar'); }}>Deletar</a>
                </nav>
            </div>

            <SidebarFooter isAuthenticated={!!user} user={user} onLogout={onLogout} />
        </SidebarLayout>
    );
};

export default AdminSidebar;
