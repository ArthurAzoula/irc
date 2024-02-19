import axios from '../api/axios.config';

const authService = {
    login: async (credentials, controller) => {
        const response = await axios.post('/auth/login', credentials, {
            signal: controller?.signal
        });
        return response.data;
    },
    register: async (credentials, controller) => {
        const response = await axios.post('/auth/register', credentials, {
            signal: controller?.signal
        });
        return response.data;
    },
    loginAsAnonymous: async (nickname, controller) => {
        const response = await axios.post('/anonymous', nickname, {
            signal: controller?.signal
        });
        return response.data;
    },
    logout: async (controller) => {
        const response = await axios.get('/auth/logout', {
            signal: controller?.signal
        });
        return response.data;
    },
    getMe: async (controller) => {
        const response = await axios.get('/auth/me', {
            signal: controller?.signal
        });
        return response.data;
    },
};

export default authService;