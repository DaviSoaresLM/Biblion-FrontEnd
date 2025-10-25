import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const token = localStorage.getItem('token');
            const userEmail = localStorage.getItem('userEmail');
            const userRole = localStorage.getItem('userRole');

            if (token && userEmail) {
                setIsAuthenticated(true);
                setUser({
                    email: userEmail,
                    role: userRole
                });
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userEmail, userRole) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userRole', userRole);
        
        setIsAuthenticated(true);
        setUser({
            email: userEmail,
            role: userRole
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        
        setIsAuthenticated(false);
        setUser(null);
    };

    return {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuthStatus
    };
};
