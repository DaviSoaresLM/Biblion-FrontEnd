import React, { useState } from 'react';
import '../styles/LoginStyle.css';
import '../styles/AuthStyle.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService.js';
import { useAuth } from '../hooks/useAuth.js';
import AlertMessage from '../../shared/components/alert/AlertMessage.jsx';
import logo from '../../../../src/assets/images/logo.png';
import TextInput from '../../shared/components/inputs/TextInput.jsx';
import PasswordInput from '../../shared/components/inputs/PasswordInput.jsx';
import SubmitButton from '../../shared/components/buttons/SubmitButton.jsx';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const submitData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authService.authenticate({ email, password });
            // checa role
            if (response.userRole && response.userRole.toUpperCase() === 'ADMIN') {
                login(response.token, response.userEmail, response.userRole);
                navigate('/home/user/HomePageAdmin');
            } else {
                setAlert({ message: 'Usuário não tem permissão de administrador.', type: 'error' });
            }
        } catch (err) {
            setAlert({ message: err.message || 'Erro ao autenticar', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const seedAdmin = () => {
        const usersJson = localStorage.getItem('biblion_users');
        const users = usersJson ? JSON.parse(usersJson) : [];
        const adminEmail = 'admin@admin.com';
        const exists = users.some(u => u.email === adminEmail && u.role === 'ADMIN');
        if (!exists) {
            const newUser = { id: (users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1), email: adminEmail, password: 'admin', firstName: 'Admin', lastName: 'Local', role: 'ADMIN' };
            users.push(newUser);
            localStorage.setItem('biblion_users', JSON.stringify(users));
            setAlert({ message: `Usuário admin criado: ${adminEmail} / admin`, type: 'success' });
        } else {
            setAlert({ message: `Usuário admin já existe: ${adminEmail}`, type: 'success' });
        }
    };

    return (
        <>
            {alert.message && <AlertMessage message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />}

            <div className="layout">
                <div className="main-container">
                    <div className="content-container">
                        <div className="auth-container">
                            <form className="auth-form-container" onSubmit={submitData}>
                                <img src={logo} className="logo" alt="logo" />
                                <h1 className="form-title">Login Admin</h1>

                                <div className="form-footer">
                                    <span className="link">Atenção: este login é para administração do acervo.</span>
                                </div>

                                <div className="inputs-container">
                                    <TextInput
                                        type="email"
                                        label="E-mail"
                                        value={email}
                                        placeholder="admin@exemplo.com"
                                        onChange={(e) => setEmail(e.target.value)} />

                                    <PasswordInput
                                        label="Senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />

                                    <div style={{ display: 'flex', gap: 12, marginTop: 12, width: '100%' }}>
                                        <div style={{ flex: 1 }}>
                                            <SubmitButton text={isLoading ? 'Entrando...' : 'Entrar como Admin'} type="submit" disabled={isLoading} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button type="button" className="secondary-button" onClick={() => navigate('/home/user/HomePage')}>Cancelar</button>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                                        <button type="button" className="pagination-btn" onClick={seedAdmin}>Criar conta Admin de teste</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLoginPage;
