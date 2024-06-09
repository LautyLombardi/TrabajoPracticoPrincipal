import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { getAdmDni } from '@/api/services/storage';

const useInsertAperturaManual = () => {
    const db = useSQLiteContext();

    const insertAperturaManual = useCallback(async () => {
        const createDate = getCurrentCreateDate();
        const admDni = await getAdmDni();
        console.log('data a cargar', admDni);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (userId, aperturaCierre, description, createDate) VALUES (?,'Apertura','Registro de apertura del día', ?);`,
                [admDni, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logAperturaManual = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Log manual opening inserted with ID:', logAperturaManual);
            return logAperturaManual;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log manual opening:', error);
            return 0;
        }
    }, [db]);

    return insertAperturaManual;
};

export default useInsertAperturaManual;