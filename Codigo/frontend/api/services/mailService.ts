import axios from 'axios';
import { ONLINE } from '@/api/constantes';

const addThreeHours = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours + 3, minutes);
    return date.toTimeString().slice(0, 5);
};

const mapDayToEnglish = (day: string) => {
    const dayMap: { [key: string]: string } = {
        "Lunes": "mon",
        "Martes": "tue",
        "Miércoles": "wed",
        "Jueves": "thu",
        "Viernes": "fri",
        "Sábado": "sat",
        "Domingo": "sun",
    };
    return dayMap[day];
};

const sendEmail = async (email: string, day: string, hour: string) => {
    try {
        const adjustedHour = addThreeHours(hour);
        const englishDay = mapDayToEnglish(day);
        const response = await axios.post(`${ONLINE}/email`, {
            mail: email,
            day: englishDay,
            hour: adjustedHour
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status;
    } catch (error) {
        // Aquí puedes manejar el error como prefieras
        console.error('Error sending email:', error);
        return 409;
    }
};

export default sendEmail;
