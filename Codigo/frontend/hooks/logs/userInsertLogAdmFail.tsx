import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertLogAdmFail = () => {
    const db = useSQLiteContext();

    const insertLogAdmFail = useCallback(async ( adm_dni:number, type_adm:string, table_adm: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', adm_dni, type_adm, table_adm);
        await db.execAsync('BEGIN TRANSACTION;');
        var number =0
        try {
            if(type_adm !== "desactivar"){
                 
                const abm = type_adm + " de " + table_adm 
                const description = "Error al dar de  " + type_adm +  " un git"  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isAutomatic) VALUES (?, ?, ?, ?, ?, 1);`,
                    [adm_dni,abm, type_adm , description, createDate]
                );

                number = result.lastInsertRowId

            }
            else{

                const abm = type_adm + " de " + table_adm 
                const description = "Error al  desactivar un"  + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, abm, abmType, description, createDate, isAutomatic) VALUES (?, ?, ?, ?, ?, 1);`,
                    [adm_dni,abm, type_adm , description, createDate]
                );
                number = result.lastInsertRowId


            }

            await db.execAsync('COMMIT;');

            console.log('Place inserted with ID:', number);
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting place:', error);
            return 0;
        }
    }, [db]);

    return insertLogAdmFail;
};

export default useInsertLogAdmFail;
