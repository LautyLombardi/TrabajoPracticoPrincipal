import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertAperturaAutom = () => {
    const db = useSQLiteContext();

    const insertAperturaAutom = useCallback(async () => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar');
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (aperturaCierre, description, createDate) VALUES ('Apertura','Registro de apertura del día', ?);`,
                [createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logAperturaAutomatic = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Log automatic opening inserted with ID:', logAperturaAutomatic);
            return logAperturaAutomatic;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log automatic opening:', error);
            return 0;
        }
    }, [db]);

    return insertAperturaAutom;
};

export default useInsertAperturaAutom;