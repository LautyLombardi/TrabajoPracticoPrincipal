import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertCierreAutom = () => {
    const db = useSQLiteContext();

    const insertCierreAutom = useCallback(async () => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar');
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (aperturaCierre, description, createDate) VALUES ('Cierre','Registro del cierre del día', ?);`,
                [createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logCierreAutomatic = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Log automatic closing inserted with ID:', logCierreAutomatic);
            return logCierreAutomatic;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log automatic closing:', error);
            return 0;
        }
    }, [db]);

    return insertCierreAutom;
};

export default useInsertCierreAutom;