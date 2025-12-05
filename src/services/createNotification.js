import axiosInstance from './api';
const createNotiService = {
    createNotification: async (data) => {
        try {
            const response = await axiosInstance.post('/notification/create', {
                userIds: data.selectedUsers,
                title: data.title,
                content: data.content,
                toUrl: data.toUrl ? data.toUrl : '',
                type: data.type ? data.type : 'info',
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
};
export default createNotiService;
