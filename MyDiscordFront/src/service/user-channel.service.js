import axios from "../api/axios.config";

const userChannelService = {
    getUserChannels: async (queryParams, controller) => {
        try {
            const response = await axios.get("/user-channels", { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting userChannels : ", error);
            throw error;
        }
    },
    getUserChannelById: async (id, controller) => {
        try {
            const response = await axios.get(`/user-channels/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting userChannel by id : ", error);
            throw error;
        }
    },
    getChannelsByUserId: async (id, queryParams, controller) => {
        try {
            const response = await axios.get(`/user-channels/user/${id}/channels`, { params: queryParams }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting channels by user id : ", error);
            throw error;
        }
    },
    getUserChannelsByChannelId: async (id, controller) => {
        try {
            const response = await axios.get(`/user-channels/channel/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting userChannels by channel id : ", error);
            throw error;
        }
    },
    createUserChannel: async (userChannel, controller) => {
        try {
            const response = await axios.post("/user-channels", userChannel, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error creating userChannel : ", error);
            throw error;
        }
    },
    updateUserChannel: async (id, userChannel, controller) => {
        try {
            const response = await axios.put(`/user-channels/${id}`, userChannel, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error updating userChannel : ", error);
            throw error;
        }
    },
    deleteUserChannel: async (id, controller) => {
        try {
            const response = await axios.delete(`/user-channels/${id}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting userChannel : ", error);
            throw error;
        }
    },
    updateUserNickname: async (id, nickname, controller) => {
        try {
            const response = await axios.put(`/user-channels/${id}/nickname`, { nickname }, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error updating userChannel nickname : ", error);
            throw error;
        }
    },
    getUserChannelByUserIdAndChannelId: async (userId, channelId, controller) => {
        try {
            const response = await axios.get(`/user-channels/channel/${channelId}/user/${userId}`, {
                signal: controller?.signal
            });
            return response.data;
        } catch (error) {
            console.error("Error getting userChannel by userId and channelId : ", error);
            throw error;
        }
    }

};

export default userChannelService;