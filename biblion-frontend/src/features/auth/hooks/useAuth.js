import { useState, useEffect } from 'react';
import authStore from '../../../utils/authStore';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            const token = authStore.getToken();
            const storedUser = authStore.getUser();

            if (token && storedUser && storedUser.email) {
                setIsAuthenticated(true);
                setUser(storedUser);
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
        // salvar em sessionStorage via authStore
        authStore.setToken(token);
        authStore.setUser({ email: userEmail, role: userRole });

        setIsAuthenticated(true);
        setUser({ email: userEmail, role: userRole });
    };

    const logout = () => {
        authStore.clearAuth();
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
