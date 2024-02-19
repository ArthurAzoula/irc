import axios from "../api/axios.config";

const channelService = {
    getChannels: async (queryParams, controller) => {
        try {
            const response = await axios.get("/channels", { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting channels : ", error);
            throw error;
        }
    },
    getChannelById: async (id, controller) => {
        try {
            const response = await axios.get(`/channels/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting channel by id : ", error);
            throw error;
        }
    },
    getMessagesByChannelId: async (id, queryParams, controller) => {
        try {
            const response = await axios.get(`/channels/${id}/messages`, { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting messages by channel id : ", error);
            throw error;
        }
    },
    createChannel: async (channel, controller) => {
        try {
            const response = await axios.post("/channels", channel, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error creating channel : ", error);
            throw error;
        }
    },
    updateChannel: async (id, channel, controller) => {
        try {
            const response = await axios.put(`/channels/${id}`, channel, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error updating channel : ", error);
            throw error;
        }
    },
    deleteChannel: async (id, controller) => {
        try {
            const response = await axios.delete(`/channels/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting channel : ", error);
            throw error;
        }
    },
};

export default channelService;