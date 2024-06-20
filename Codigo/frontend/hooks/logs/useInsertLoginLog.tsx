import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertLoginLog = () => {
    const db = useSQLiteContext();

    const insertLoginLog = useCallback(async (admDni: number, dniCliente: number, table_login: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', admDni, dniCliente, table_login);
        if(table_login.toLowerCase()=="visitante") {
            try {
                await db.execAsync('BEGIN TRANSACTION;');
                let description="se logeo manualmente un "+table_login
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, visitorId, description, createDate, isEnter) VALUES (?, ?, ?, ?, 1);`,
                    [admDni, dniCliente, description, createDate]
                );

                console.log('Insert result:', result.lastInsertRowId, result.changes);
                const logId = result.lastInsertRowId;

                await db.execAsync('COMMIT;');

                console.log('log inserted with ID:', logId);
                return logId;
            } catch (error) {
                await db.execAsync('ROLLBACK;');
                console.error('Error inserting log:', error);
                return 0;
            }
        }else{
            try {
                await db.execAsync('BEGIN TRANSACTION;');
                let description="se logeo manualmente un "+table_login
                const result = await db.runAsync(
                    `INSERT INTO logs (admDni, userId, description, createDate, isEnter) VALUES (?, ?, ?, ?, 1);`,
                    [admDni, dniCliente, description, createDate]
                );

                console.log('Insert result:', result.lastInsertRowId, result.changes);
                const logId = result.lastInsertRowId;

                await db.execAsync('COMMIT;');

                console.log('Log inserted with ID:', logId);
                return logId;
            } catch (error) {
                await db.execAsync('ROLLBACK;');
                console.error('Error inserting Log:', error);
                return 0;
            }
        }
    }, [db]);

    return insertLoginLog;
};

export default useInsertLoginLog;