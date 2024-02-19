import axios from "../api/axios.config";

const messageService = {
    getMessages: async (queryParams, controller) => {
        try {
            const response = await axios.get("/messages", { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting messages : ", error);
            throw error;
        }
    },
    getMessageById: async (id, controller) => {
        try {
            const response = await axios.get(`/messages/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting message by id : ", error);
            throw error;
        }
    },
    createMessage: async (message, controller) => {
        try {
            const response = await axios.post("/messages", message, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error creating message : ", error);
            throw error;
        }
    },
    updateMessage: async (id, message, controller) => {
        try {
            const response = await axios.put(`/messages/${id}`, message, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error updating message : ", error);
            throw error;
        }
    },
    deleteMessage: async (id, controller) => {
        try {
            const response = await axios.delete(`/messages/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting message : ", error);
            throw error;
        }
    },
};

export default messageService;