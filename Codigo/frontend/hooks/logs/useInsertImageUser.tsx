import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertImageUser = () => {
    const db = useSQLiteContext();

    const insertImageUser = useCallback(async (userId: number, admDni: number) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ', userId, admDni);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO logs (userId, admDni, abm, abmType, description, createDate) VALUES (?, ?, 'ABM Imagen', 'ALTA', 'se asocia una imagen a un usuario', ?);`,
                [userId, admDni, createDate]
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

    return insertImageUser;
};

export default useInsertImageUser;