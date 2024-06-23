import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';

const useEditLogUserVisitor = () => {
    const db = useSQLiteContext();

    const editLogUserVisitor = useCallback(async ( table_adm: string, dni_client : number) => {
        const createDate = getCurrentCreateDate();
        const admDni = await getAdmDni();
        console.log('data a cargar',  table_adm , dni_client);
        await db.execAsync('BEGIN TRANSACTION;');
        var number =0
        try {
            if(table_adm === "usuario"){
                const abm = "Modificacion de " + table_adm
                const description = "Se modifico a un " + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, userId, abm, abmType, description, createDate) VALUES (?,?,?, "modificacion", ?, ?);`,
                    [admDni,dni_client,abm, description, createDate]
                );
                number = result.lastInsertRowId
            }
            else{
                
                const abm = "Modificacion de " + table_adm
                const description = "Se modifico a un " + table_adm
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, visitorId, abm, abmType, description, createDate) VALUES (?,?,?, "modificacion", ?, ?);`,
                    [admDni,dni_client,abm, description, createDate]
                );
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

    return editLogUserVisitor;
};
export default useEditLogUserVisitor;
