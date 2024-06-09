import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';

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
                const description = "Se da de " + type_adm +  " a un "  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isAutomatic) VALUES (?, ?, ?, ?, ?, 1);`,
                    [admDni,abm, type_adm , description, createDate]
                );

                number = result.lastInsertRowId

            }
            else{

                const abm = type_adm + " de " + table_adm 
                const description = "Se desactiva un"  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isAutomatic) VALUES (?, ?, ?, ?, ?, 1);`,
                    [admDni,abm, type_adm , description, createDate]
                );
                number = result.lastInsertRowId


            }

            await db.execAsync('COMMIT;');

            console.log('Logs inserted with ID:', number);
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting place:', error);
            return 0;
        }
    }, [db]);

    return insertLogAdm;
};

export default useInsertLogAdm;
