import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertImageVisitor = () => {
    const db = useSQLiteContext();

    const insertImageVisitor = useCallback(async (visitorId: number, admDni: number) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ', visitorId, admDni);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (visitorId, admDni, abm, abmType, description, createDate, isAutomatic) VALUES (?, ?, 'ABM Imagen', 'ALTA', 'se asocia una imagen a un visitante', ?, 0);`,
                [visitorId, admDni, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const logImageId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('log image inserted with ID:', logImageId);
            return logImageId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log image:', error);
            return 0;
        }
    }, [db]);

    return insertImageVisitor;
};

export default useInsertImageVisitor;