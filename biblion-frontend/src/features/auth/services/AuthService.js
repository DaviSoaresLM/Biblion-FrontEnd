import api from "../../../config/AxiosConfig.jsx";

export const authService = {
    authenticate: async (userData) => {
        try {
            const response = await api.post("/auth/login", userData);

            if (response.status === 200) {
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
