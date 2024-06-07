import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite/next';
import { useState } from 'react';

const localDatabase = require('@/assets/db/dataBase.db');

const DB_NAME = 'dataBase.db';

function useDb() {
    const [loading, setLoading] = useState(false);

    const createDB = async (): Promise<SQLiteDatabase | undefined> => {
        setLoading(true);
        try {
            const dbDirectory = `${FileSystem.documentDirectory}SQLite`;

            // Verifica si el directorio SQLite existe, de lo contrario créalo
            const dirInfo = await FileSystem.getInfoAsync(dbDirectory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dbDirectory);
            }

            // Copia el archivo de la base de datos al directorio SQLite
            const dbFileUri = `${dbDirectory}/${DB_NAME}`;
            const fileInfo = await FileSystem.getInfoAsync(dbFileUri);
            if (!fileInfo.exists) {
                const [{ localUri, uri }] = await Asset.loadAsync(localDatabase);
                await FileSystem.copyAsync({
                    from: uri,
                    to: dbFileUri
                });
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
