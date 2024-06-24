import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite/next';
import { Asset } from 'expo-asset';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONLINE } from '@/api/constantes';
import { encode as btoa } from 'base-64';
import useSync from './useSync';

const localDatabase = require('@/assets/db/dataBase.db');
const DB_NAME = 'dataBase.db';

// Función para convertir ArrayBuffer a Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

function useDb() {
    const [loading, setLoading] = useState(false);
    const sync = useSync();
    const createDB = async (): Promise<SQLiteDatabase | undefined> => {
        setLoading(true);
        try {
            const dbDirectory = `${FileSystem.documentDirectory}SQLite`;
            const dbFileUri = `${dbDirectory}/${DB_NAME}`;

            // Verifica si el directorio SQLite existe, de lo contrario créalo
            const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dbDirectory);
            }

            // Verifica la conexión a internet
            const state = await NetInfo.fetch();
            const lastSync = await AsyncStorage.getItem('lastSync');
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 3600 * 1000);

            console.log(`Init DataBase`);
            if (state.isConnected && (!lastSync || new Date(lastSync) < oneHourAgo)) {
                const isFirstTime = await AsyncStorage.getItem('isFirstTime');
                if(isFirstTime === 'false'){
                    await sync()
                    // Descargar y copiar la base de datos
                    const response = await axios.get(`${ONLINE}/download_db`, { 
                        responseType: 'arraybuffer' 
                    });
                    const buffer = response.data;
                    const base64 = arrayBufferToBase64(buffer);

                    await FileSystem.writeAsStringAsync(dbFileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    await AsyncStorage.setItem('lastSync', now.toISOString());
                    console.log(`Database downloaded and copied to: ${dbFileUri}`);
                } else {
                    // Descargar y copiar la base de datos
                    const response = await axios.get(`${ONLINE}/download_db`, { 
                        responseType: 'arraybuffer' 
                    });
                    const buffer = response.data;
                    const base64 = arrayBufferToBase64(buffer);
    
                    await FileSystem.writeAsStringAsync(dbFileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    await AsyncStorage.setItem('lastSync', now.toISOString());
                    console.log(`Database downloaded and copied to: ${dbFileUri}`);
                    await AsyncStorage.setItem('isFirstTime', 'false');
                }
                
                
            } else {
                const fileInfo = await FileSystem.getInfoAsync(dbFileUri);
                if (!fileInfo.exists) {
                    // Si no hay conexión y la base de datos no existe localmente, usa el recurso local
                    const [{ localUri, uri }] = await Asset.loadAsync(localDatabase);
                    await FileSystem.copyAsync({
                        from: uri,
                        to: dbFileUri
                    });

                    console.log(`Database copied offline to: ${dbFileUri}`);
                }
            }

            console.log(`Database copied to: ${dbFileUri}`);
            // Abre la base de datos
            const db = await openDatabaseAsync(DB_NAME);
            return db;
        } catch (error) {
            console.error('Error creating database', error);
        } finally {
            setLoading(false);
        }
    };

    return { createDB, loading };
}

export default useDb;
