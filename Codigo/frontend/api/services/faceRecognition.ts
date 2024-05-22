import axios from 'axios';

export const faceRecognition = async (imageFile: File, type: string): Promise<number> => {    
    console.log('Data to send ', imageFile);
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
        const response = await axios.post(`http://34.125.221.164/faceRecognition/${type}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        console.log(`${type} response dni `, response.data.dni);
        return response.data.dni;  
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al cargar la imagen:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error desconocido');
        } else {
            throw new Error('Error al cargar la imagen');
        }
    }
};