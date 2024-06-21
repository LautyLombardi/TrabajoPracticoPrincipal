import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';

const useInsertLogAdmFail = () => {
    const db = useSQLiteContext();

    const insertLogAdmFail = useCallback(async ( type_adm:string, table_adm: string) => {
        const createDate = getCurrentCreateDate();
        const admDni = await getAdmDni();
        console.log('data a cargar', type_adm, table_adm);
        await db.execAsync('BEGIN TRANSACTION;');
        var number =0
        try {
            if(type_adm !== "desactivar"){
                 
                const abm = type_adm + " de " + table_adm 
                const description = "Error en " + type_adm +" "+ table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isError) VALUES (?, ?, ?, ?, ?, 1);`,
                    [admDni,abm, type_adm , description, createDate]
                );

                number = result.lastInsertRowId

            }
            else{

                const abm = type_adm + " de " + table_adm 
                const description = "Error al  desactivar un"  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isError) VALUES (?, ?, ?, ?, ?, 1);`,
                    [admDni,abm, type_adm , description, createDate]
                );
                number = result.lastInsertRowId


            }

            await db.execAsync('COMMIT;');

            console.log('Logs inserted with ID:', number);
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting Logs:', error);
            return 0;
        }
    }, [db]);

    return insertLogAdmFail;
};

export default useInsertLogAdmFail;
