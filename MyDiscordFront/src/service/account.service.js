import axios from "../api/axios.config";

const accountService = {
    getAccounts: async (queryParams, controller) => {
        const response = await axios.get("/accounts", { params: queryParams }, {
            signal: controller?.signal
        });
        return response.data;
    },
    getAccountById: async (id, controller) => {
        const response = await axios.get(`/accounts/${id}`, {
            signal: controller?.signal
        });
        return response.data;
    },
    createAccount: async (account, controller) => {
        const response = await axios.post("/accounts", account, {
            signal: controller?.signal
        });
        return response.data;
    },
    updateAccount: async (id, account, controller) => {
        const response = await axios.put(`/accounts/${id}`, account, {
            signal: controller?.signal
        });
        return response.data;
    },
    deleteAccount: async (id, controller) => {
        const response = await axios.delete(`/accounts/${id}`, {
            signal: controller?.signal
        });
        return response.data;
    },
};

export default accountService;
