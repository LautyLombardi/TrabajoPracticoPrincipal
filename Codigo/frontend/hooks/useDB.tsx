import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
import {openDatabaseAsync} from 'expo-sqlite/next';
import {useState} from 'react';

const localDatabase = require('@/assets/db/dataBase.db');

const DB_NAME = 'dataBase.db';

function useDb() {
    const [loading, setLoading] = useState(false);
    const createDB = async () => {
        setLoading(true);
        try {
        if (!(await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite`)).exists) {
            await FileSystem.makeDirectoryAsync(
            `${FileSystem.documentDirectory}SQLite`
            );
        }
        const [{localUri, uri}] = await Asset.loadAsync(localDatabase);
        const result = await FileSystem.downloadAsync(
            uri,
            `${FileSystem.documentDirectory}SQLite/${DB_NAME}`
        );

        console.log('Local uri in create db ',localUri,'---uri in create db--- ', uri);

        console.log(result, 'result');

        return await openDatabaseAsync(`${DB_NAME}`);
        } catch (error) {
        console.error('Error creating database', error);
        } finally {
        setLoading(false);
        }
    };

    return {createDB, loading};
}

export default useDb;
