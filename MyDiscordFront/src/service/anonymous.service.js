import axios from "../api/axios.config";

const anonymousService = {
    getAnonymous: async (queryParams, controller) => {
        try {
            const response = await axios.get("/anonymous", { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting anonymous : ", error);
            throw error;
        }
    },
    getAnonymousById: async (id, controller) => {
        try {
            const response = await axios.get(`/anonymous/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting anonymous by id : ", error);
            throw error;
        }
    },
    createAnonymous: async (anonymous, controller) => {
        try {
            const response = await axios.post("/anonymous", anonymous, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error creating anonymous : ", error);
            throw error;
        }
    },
    updateAnonymous: async (id, anonymous, controller) => {
        try {
            const response = await axios.put(`/anonymous/${id}`, anonymous, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error updating anonymous : ", error);
            throw error;
        }
    },
    deleteAnonymous: async (id, controller) => {
        try {
            const response = await axios.delete(`/anonymous/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting anonymous : ", error);
            throw error;
        }
    },
};

export default anonymousService;