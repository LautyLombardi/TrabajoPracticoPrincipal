import axios, { AxiosResponse } from 'axios';
import { Rol } from '../model/interfaces';
import { URL } from '@/api/constantes'
import { Role } from 'react-native';
const BASE_URL = `${URL}/role`;
import { getAdmDni } from './storage';

export const crearRol = async (nombre: string, descripcion: string) => {
    try {
      const admDni = await getAdmDni();
      const data = {
        name: nombre,
        description: descripcion,
        adm_dni:admDni
      };
  
      const response = await axios.post(BASE_URL, data, {
      });

      // Si se registró correctamente, no necesitamos devolver ningún dato adicional
    } catch (error) {
      console.error('Error al registrar la rol:', error);
      throw new Error('Error al registrar la rol');
    }
};