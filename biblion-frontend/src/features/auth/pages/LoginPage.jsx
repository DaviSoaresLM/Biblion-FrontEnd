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
    const next = nextParam || '/home/user/HomePage';

    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({message: "", type: ""});

    // Redirecionar se já estiver logado
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, next]);

    const submitData = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        // normal user login flow

        const userData = {email, password};

        try {
            const response = await authService.authenticate(userData);

            // Usar o hook de autenticação para fazer login
            login(response.token, response.userEmail, response.userRole);

            // Redirecionar para a rota solicitada (next)
            navigate(next, { replace: true });
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
                                            Não possui uma conta? <a href="/register">Criar uma conta</a>
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

                                            {/* admin-only login removed from common login page */}
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
