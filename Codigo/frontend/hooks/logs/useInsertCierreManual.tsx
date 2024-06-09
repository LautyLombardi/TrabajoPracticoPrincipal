import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';

const useInsertCierreManual = () => {
    const db = useSQLiteContext();

    const insertCierreManual = useCallback(async () => {
        const createDate = getCurrentCreateDate();
        const admDni = await getAdmDni();
        console.log('data a cargar', admDni);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (userId, aperturaCierre, description, createDate) VALUES (?,'Cierre','Registro del cierre del día', ?);`,
                [admDni, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logCierreManual = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Log manual closing inserted with ID:', logCierreManual);
            return logCierreManual;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log manual closing:', error);
            return 0;
        }
    }, [db]);

    return insertCierreManual;
};

export default useInsertCierreManual;