import axios from 'axios';
import { ONLINE } from '@/api/constantes';

const sendEmail = async (email: string, reportDay: string, reportTime: string) => {
    try {
        const response = await axios.post(`${ONLINE}/email`, {
            email,
            reportDay,
            reportTime
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        // Aquí puedes manejar el error como prefieras
        console.error('Error sending email:', error);
        return 409
    }
};

export default sendEmail;
