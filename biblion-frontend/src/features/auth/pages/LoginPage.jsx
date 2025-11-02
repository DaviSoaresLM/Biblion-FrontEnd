import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/LoginStyle.css';
import '../styles/AuthStyle.css';

// COMPONENTS
import logo from "../../../assets/images/logo.png";
import TextInput from "../../shared/components/inputs/TextInput.jsx";
import PasswordInput from "../../shared/components/inputs/PasswordInput.jsx";
import SubmitButton from "../../shared/components/buttons/SubmitButton.jsx";
import AlertMessage from "../../shared/components/alert/AlertMessage.jsx";

// SERVICE
import {authService} from "../services/AuthService.js";

// Hooks
import {useEmailHook} from "../hooks/useEmailHook.js";
import {usePasswordValidator} from "../hooks/usePasswordValidator.js";
import {useAuth} from "../hooks/useAuth.js";

const LoginPage = () => {
    const {email, handleEmailChange} = useEmailHook();
    const {password, handlePasswordChange} = usePasswordValidator();
    const {login, isAuthenticated, loading} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const nextParam = params.get('next');
    const [asAdmin, setAsAdmin] = useState(false);
    const next = nextParam || '/home/user/HomePage';
    const adminDefault = '/home/user/HomePageAdmin';

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({message: "", type: ""});

    // Redirecionar se já estiver logado
    useEffect(() => {
        if (!loading && isAuthenticated) {
            const target = asAdmin ? adminDefault : next;
            navigate(target, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, next, asAdmin]);

    const submitData = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // Se tentando entrar como admin, verifique se já existe um usuário admin criado no mock
        if (asAdmin) {
            try {
                const usersJson = localStorage.getItem('biblion_users');
                const users = usersJson ? JSON.parse(usersJson) : [];
                const hasAdmin = users.some(u => (u.role || '').toString().toUpperCase() === 'ADMIN');
                if (!hasAdmin) {
                    setAlert({ message: 'Nenhuma conta admin encontrada. Acesse /auth/admin-login e clique em "Criar conta Admin de teste".', type: 'error' });
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                // ignore parsing errors and continue to authenticate (will likely fail)
            }
        }

        const userData = {email, password};

        try {
            const response = await authService.authenticate(userData);

            // Se tentou login como admin, valide a role
            if (asAdmin && (!response.userRole || response.userRole.toUpperCase() !== 'ADMIN')) {
                setAlert({ message: 'Credenciais válidas, mas o usuário não é administrador.', type: 'error' });
                setIsLoading(false);
                return;
            }

            // Usar o hook de autenticação para fazer login
            login(response.token, response.userEmail, response.userRole);

            // Redirecionar para a rota solicitada (next) ou painel admin quando solicitado
            const target = asAdmin ? adminDefault : next;
            navigate(target, { replace: true });
        } catch (error) {
            setAlert({message: error.message, type: "error"});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <div className="layout">
                    <div className="main-container">
                        <div className="content-container">
                            <div className="auth-container">
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <img src={logo} className="logo" alt="logo" style={{ marginBottom: '20px' }}/>
                                    <h1 className="form-title">Verificando autenticação...</h1>
                                    <p>Por favor, aguarde.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {alert.message && (
                        <AlertMessage
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert({message: "", type: ""})}
                        />
                    )}

                    <div className="layout">
                        <div className="main-container">
                            <div className="content-container">
                                <div className="auth-container">
                                    <form className="auth-form-container" onSubmit={submitData}>
                                        <img src={logo} className="logo" alt="logo"/>
                                        <h1 className="form-title">Login</h1>
                                        <div className="form-footer">
                                        <span className="link">
                                            Não possui uma conta? <a href="/auth/register">Criar uma conta</a>
                                        </span>
                                        </div>
                                        <div className="inputs-container">
                                            <TextInput
                                                type="email"
                                                label="E-mail"
                                                value={email}
                                                placeholder="Digite seu email"
                                                onChange={handleEmailChange}/>

                                            <PasswordInput
                                                label="Senha"
                                                value={password}
                                                onChange={handlePasswordChange}/>

                                            <div style={{ marginTop: 8 }}>
                                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                                    <input type="checkbox" checked={asAdmin} onChange={(e) => setAsAdmin(e.target.checked)} />
                                                    Entrar como administrador
                                                </label>
                                            </div>
                                        </div>

                                        <SubmitButton
                                            text={isLoading ? "Enviando..." : "Entrar"}
                                            type="submit"
                                            disabled={isLoading}
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default LoginPage;
