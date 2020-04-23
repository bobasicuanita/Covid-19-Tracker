// Get all data
export const getAll = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/data/',
            redirect: 'follow',
        });

        return response;
    } catch (err) {
        console.log('error', err);
    }
};