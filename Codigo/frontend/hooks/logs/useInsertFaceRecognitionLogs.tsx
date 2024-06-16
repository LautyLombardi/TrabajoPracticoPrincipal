import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertFaceRecognitionLogs = () => {
    const db = useSQLiteContext();

    const insertFaceRecognitionLog = useCallback(async (client_Id: number | null, admDni: number | null, type_adm: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ', client_Id, admDni);
        var number
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            if(type_adm=== 'usuario'){
                const result = await db.runAsync(
                    `INSERT INTO logs (userId, admDni, hasAccess, isFaceRecognition,description, createDate, isAutomatic) VALUES (?, ?, 1, 1, 'se realizo una autenticacion con reconocimiento facial exitosa ', ?, 0);`,
                    [client_Id, admDni, createDate]
                );

                number = result.lastInsertRowId


            }else{
                const result = await db.runAsync(
                    `INSERT INTO logs (visitorId, admDni, hasAccess, isFaceRecognition,description, createDate, isAutomatic) VALUES (?, ?, 1, 1, 'se realizo una autenticacion con reconocimiento facial exitosa ', ?, 0);`,
                    [client_Id, admDni, createDate]
                );
                number = result.lastInsertRowId

            }
            
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