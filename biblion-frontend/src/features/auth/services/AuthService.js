import api from "../../../config/AxiosConfig.jsx";

const useMock = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export const authService = {
    authenticate: async (userData) => {
        if (useMock) {
            // Simula latência
            await sleep(400);

            const usersJson = localStorage.getItem('biblion_users');
            const users = usersJson ? JSON.parse(usersJson) : [];

            const found = users.find(u => u.email === userData.email && u.password === userData.password);

            if (found) {
                return {
                    token: 'mock-token',
                    userEmail: found.email,
                    userRole: found.role || 'COMMON'
                };
            }

            throw new Error('Credenciais inválidas');
        }

        try {
            const response = await api.post("/auth/login", userData);

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            const errorData = error?.response?.data || {};

            const {message, status, timestamp, path} = errorData;

            console.error("Erro de autenticação:", {
                mensagem: message,
                statusCode: status,
                url: path,
            });

            throw new Error(message || 'Erro ao autenticar');
        }
    },

    register: async (userData) => {
        if (useMock) {
            await sleep(300);

            const usersJson = localStorage.getItem('biblion_users');
            const users = usersJson ? JSON.parse(usersJson) : [];

            const exists = users.some(u => u.email === userData.email);
            if (exists) {
                throw new Error('Já existe um usuário cadastrado com este e-mail');
            }

            const newUser = {
                id: (users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1),
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                role: userData.role || 'COMMON'
            };

            users.push(newUser);
            localStorage.setItem('biblion_users', JSON.stringify(users));

            return 'Usuário cadastrado com sucesso';
        }

        try {
            const response = await api.post("/auth/register", userData);

            if (response.status === 201) {
                return response.data;
            }
        } catch (error) {
            const errorData = error?.response?.data || {};

            const {message, status, timestamp, path} = errorData;

            console.error("Erro durante o cadastro:", {
                mensagem: message,
                statusCode: status,
                url: path,
            });

            throw new Error(message || 'Erro ao cadastrar');
        }
    }
}
