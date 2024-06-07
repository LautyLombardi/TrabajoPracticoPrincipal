import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertInstitute = () => {
    const db = useSQLiteContext();

    const insertInstitute = useCallback(async (name: string, placeIds: number[]) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', name, placeIds);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO institute (name, isActive, createDate) VALUES (?, 1, ?);`,
                [name, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const instituteId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Institute inserted with ID:', instituteId);
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting institute:', error);
        }
    }, [db]);

    return insertInstitute;
};

export default useInsertInstitute;
