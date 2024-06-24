import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useInsertLogAdm = () => {
    const db = useSQLiteContext();

    const insertLogAdm = useCallback(async ( type_adm:string, table_adm: string) => {
        const createDate = getCurrentCreateDate();
        const admDni = await getAdmDni();
        console.log('data a cargar', type_adm, table_adm);
        await db.execAsync('BEGIN TRANSACTION;');
        var number =0
        try {
            if(type_adm !== "desactivacion"){

                const abm = type_adm + " de " + table_adm 
                const description = "Se realiza " + type_adm +  " de "  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate) VALUES (?, ?, ?, ?, ?);`,
                    [admDni,abm, type_adm , description, createDate]
                );

                number = result.lastInsertRowId
            }
            else{
                const abm = type_adm + " de " + table_adm 
                const description = "Se desactiva "  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate) VALUES (?, ?, ?, ?, ?);`,
                    [admDni,abm, type_adm , description, createDate]
                );
                number = result.lastInsertRowId

            }
            await db.execAsync('COMMIT;');

            console.log('Logs inserted with ID:', number);
            console.log('isNotSync');
            await AsyncStorage.setItem('isSync', 'false');
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting Logs:', error);
            return 0;
        }
    }, [db]);

    return insertLogAdm;
};

export default useInsertLogAdm;
