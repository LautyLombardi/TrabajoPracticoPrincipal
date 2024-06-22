import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { Logs } from '@/api/model/interfaces';

const useInsertFaceRecognitionLogs = () => {
    const db = useSQLiteContext();

    const insertFaceRecognitionLog = useCallback(async (client_Id: number | null, admDni: number | null, type_adm: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ', client_Id, admDni);
        let number;
        let tableId = type_adm === 'usuario' ? 'user' : 'visitor';

        const getLatestLogQuery = (table: string) => `
            SELECT * FROM logs
            WHERE ${table}Id = ?
            ORDER BY createDate DESC
            LIMIT 1;
        `;

        try {
            await db.execAsync('BEGIN TRANSACTION;');

            // Obtener el último log
            const latestLog = await db.getFirstAsync<Logs>(getLatestLogQuery(tableId), [client_Id]);

            // Determinar el valor de isEnter
            let isEnter = 1;
            if (latestLog) {
                const latestLogDate = new Date(latestLog.createDate).toDateString();
                const currentDate = new Date(createDate).toDateString();
                
                if (latestLogDate === currentDate && latestLog.isEnter === 1) {
                    isEnter = 0;
                }
            }

            // Insertar el nuevo log
            const result = await db.runAsync(
                `INSERT INTO logs (${tableId}Id, admDni, hasAccess, isFaceRecognition, description, createDate, isEnter) VALUES (?, ?, 1, 1, 'se realizo una autenticacion con reconocimiento facial exitosa ', ?, ?);`,
                [client_Id, admDni, createDate, isEnter]
            );

            number = result.lastInsertRowId;

            await db.execAsync('COMMIT;');
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log image:', error);
            return 0;
        }
    }, [db]);

    return insertFaceRecognitionLog;
};

export default useInsertFaceRecognitionLogs;
