import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { Logs } from '@/api/model/interfaces';

const useInsertLoginLog = () => {
    const db = useSQLiteContext();

    const insertLoginLog = useCallback(async (admDni: number, dniCliente: number, table_login: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', admDni, dniCliente, table_login);
        let description = `se logeo manualmente un ${table_login}`;

        const getLatestLogQuery = (table: string) => `
            SELECT * FROM logs
            WHERE ${table}Id = ?
            ORDER BY createDate DESC
            LIMIT 1;
        `;

        try {
            await db.execAsync('BEGIN TRANSACTION;');
            
            const tableId = table_login.toLowerCase() === "visitante" ? "visitor" : "user";
            const latestLog = await db.getFirstAsync<Logs>(getLatestLogQuery(tableId), [dniCliente]);

            let isEnter = 1;
            if (latestLog) {
                const latestLogDate = new Date(latestLog.createDate).toDateString();
                const currentDate = new Date(createDate).toDateString();
                
                if (latestLogDate === currentDate && latestLog.isEnter === 1) {
                    isEnter = 0;
                }
            }

            const result = await db.runAsync(
                `INSERT INTO logs (admDni, ${tableId}Id, description, createDate, isEnter) VALUES (?, ?, ?, ?, ?);`,
                [admDni, dniCliente, description, createDate, isEnter]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');
            console.log('Log inserted with ID:', logId);
            return logId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log:', error);
            return 0;
        }
    }, [db]);

    return insertLoginLog;
};

export default useInsertLoginLog;
