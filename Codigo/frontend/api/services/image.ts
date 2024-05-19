import axios from 'axios';

export const insertImage = async (dni: number, imageFile: Blob, type: string, dniType: string): Promise<number> => {    
    console.log('Data to send', dni, ' ', imageFile);
    const formData = new FormData();
    //formData.append(dniType, dni.toString());
    formData.append("image", {uri:imageFile,name:'imagen.jpg',type:'image/jpeg'});
  



    try {
        const response = await axios.post(`http://192.168.0.208:5000/image/${type}/`, formData);
        console.log('response', response.status);
        return response.status;  
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error al cargar la imagen:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error desconocido');
        } else {
            throw new Error('Error al cargar la imagen');
        }
    }
};