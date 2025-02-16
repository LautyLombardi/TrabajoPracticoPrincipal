import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertImageVisitorFail = () => {
    const db = useSQLiteContext();

    const insertImageVisitorFail = useCallback(async (visitorId: number, admDni: number) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ', visitorId, admDni);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (visitorId, admDni, abm, abmType, description, createDate) VALUES (?, ?, 'ABM Imagen', 'ALTA', 'se fallo en asociar una imagen a un visitante', ?);`,
                [visitorId, admDni, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logImageId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('log image fail inserted with ID:', logImageId);
            return logImageId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log image:', error);
            return 0;
        }
    }, [db]);

    return insertImageVisitorFail;
};

export default useInsertImageVisitorFail;