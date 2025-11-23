import api from "../../../config/AxiosConfig.jsx";

const useMock = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export const authService = {
    authenticate: async (userData) => {
        if (useMock) {
            // Simula latência
            await sleep(400);
            // Normaliza e valida entradas mínimas
            const email = (userData?.email || '').trim().toLowerCase();
            const password = userData?.password || '';

            if (!email || !password) {
                const err = new Error('E-mail e senha são obrigatórios');
                err.status = 400;
                throw err;
            }

            const usersJson = localStorage.getItem('biblion_users');
            const users = usersJson ? JSON.parse(usersJson) : [];

            const found = users.find(u => (u.email || '').toLowerCase() === email && u.password === password);

            if (found) {
                return {
                    token: 'mock-token',
                    userEmail: found.email,
                    userRole: found.role || 'COMMON'
                };
            }

            const err = new Error('Credenciais inválidas');
            err.status = 401;
            throw err;
        }

        try {
            const response = await api.post("/auth/login", userData);

            // Aceita qualquer 2xx e normaliza formatos diferentes
            if (response && response.status >= 200 && response.status < 300) {
                const data = response.data || {};

                // backend retorna { accessToken, userData }
                if (data.accessToken) {
                    return {
                        token: data.accessToken,
                        userEmail: data.userData?.email ?? null,
                        userRole: data.userData?.role ?? data.userData?.authority ?? null,
                        raw: data
                    };
                }

                // se já estiver no formato esperado, ou mapear campos conhecidos
                return {
                    token: data.token ?? data.accessToken ?? null,
                    userEmail: data.userEmail ?? data.user?.email ?? data.userData?.email ?? null,
                    userRole: data.userRole ?? data.user?.role ?? data.userData?.role ?? null,
                    raw: data
                };
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
            // Normaliza e valida apenas o mínimo necessário para o modo mock
            const email = (userData?.email || '').trim().toLowerCase();
            const password = userData?.password || '';

            if (!email || !password) {
                const err = new Error('E-mail e senha são obrigatórios');
                err.status = 400;
                throw err;
            }

            if (password.length < 8) {
                const err = new Error('A senha deve conter no mínimo 8 caracteres');
                err.status = 400;
                throw err;
            }

            const usersJson = localStorage.getItem('biblion_users');
            const users = usersJson ? JSON.parse(usersJson) : [];

            const exists = users.some(u => (u.email || '').toLowerCase() === email);
            if (exists) {
                const err = new Error('Já existe um usuário cadastrado com este e-mail');
                err.status = 409;
                throw err;
            }

            const newUser = {
                id: (users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1),
                email: email,
                password: password,
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

            if (response && response.status >= 200 && response.status < 300) {
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
