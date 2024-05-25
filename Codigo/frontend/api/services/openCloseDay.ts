import axios from 'axios';
import { URL } from '@/api/constantes'

export async function openDay(): Promise<number> {
    try {
        const response = await axios.post(`${URL}/open_day`);
        return response.status;
    } catch (error) {
        return 403;
    }
}

export async function closeDay(): Promise<number> {
    try {
        const response = await axios.post(`${URL}/close_day`);
        return response.status;
    } catch (error) {
        return 403;
    }
}

export async function statusDay(): Promise<number> {
    try {
        const response = await axios.get(`${URL}/status_dia`);
        return response.status;
    } catch (error) {
        return 403;
    }
}