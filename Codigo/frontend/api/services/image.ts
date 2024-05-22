import axios from 'axios';
import { URL } from "@/api/constantes";
import { CameraCapturedPicture } from 'expo-camera';

const BASE_URL = `${URL}/image`;

export const insertImage = async (dni: number, photoUri: string, type: string, dniType: string): Promise<number> => {
    console.log('Data to send', dni, ' ', photoUri);

    try {
        // Fetch the image data from the URI
        const response = await fetch(photoUri);

        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error('Error fetching the image data');
        }

        const blob = await response.blob();

        // Create a new FormData
        const formData = new FormData();
        formData.append(dniType, dni.toString());

        // Create a new file Blob with the given name and type
        const fileName = "photo.jpg"; // or the name you want
        const fileType = "image/jpeg"; // or the type you want
        const file = new File([blob], fileName, { type: fileType });

        // Append the File to the FormData
        formData.append("image", file);

        // Log the formData content for debugging
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Use formData to make a request
        const axiosResponse = await axios.post(`${BASE_URL}/${type}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('response', axiosResponse.status);
        return axiosResponse.status;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error desconocido');
        } else if (error instanceof Error) {
            console.error('Fetch error:', error.message);
            throw new Error('Error al obtener la imagen: ' + error.message);
        } else {
            throw new Error('Error al cargar la imagen');
        }
    }
};
