import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useSyncLog = () => {
    const db = useSQLiteContext();

    const syncLog = useCallback(async ( isError: number | null, description : string | null, entity : string) => {
        // const logsData = await db.getAllAsync<Logs>('SELECT * FROM logs WHERE abm = "sync" AND isError = 1');
        const createDate = getCurrentCreateDate();
        console.log('log to sync a cargar',  isError , description);
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            if(isError === 1){
                const setEntity = entity + " error de syncronización "
                const descriptionError = description ? setEntity + description : setEntity
                const result = await db.runAsync(
                    `INSERT INTO logs (abm, description, createDate, isAutomatic, isError) VALUES ("sync",?, 1, 1);`,
                    [descriptionError, createDate]
                );
                await db.execAsync('COMMIT;');
                console.log('Logs sync error inserted with ID:', result.lastInsertRowId);
            } else {
                const setEntity = entity + " syncronización exitosa "
                const result = await db.runAsync(
                    `INSERT INTO logs (abm, description, createDate, isAutomatic) VALUES ("sync",?, 1);`,
                    [setEntity, createDate]
                );
                await db.execAsync('COMMIT;');
                console.log('Logs sync inserted with ID:', result.lastInsertRowId);
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting Logs:', error);
            return 0;
        }
    }, [db]);

    return syncLog;
};
export default useSyncLog;
