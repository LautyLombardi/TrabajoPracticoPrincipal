import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertException = () => {
    const db = useSQLiteContext();

    const insertException = useCallback(async (name: string, descripcion: string, duration: string, placeIds: number[], categoryid: number) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', name, descripcion, duration, placeIds, categoryid);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO exception (name, description, duration, createDate) VALUES (?, ?, ?, ?);`,
                [name, descripcion, duration, createDate]
            );
            const exceptionId = result.lastInsertRowId;
            
            await db.runAsync(
                `INSERT INTO category_exception (category_id, exception_id)
                    SELECT ?, ?
                    WHERE NOT EXISTS (
                        SELECT 1 FROM category_exception WHERE category_id = ? AND exception_id = ?
                );`,
                [categoryid, exceptionId, categoryid, exceptionId]
            );

            placeIds.forEach(async placeId=>{
                await db.runAsync(
                    `INSERT INTO place_exception (exception_id, place_id)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM place_exception WHERE exception_id = ? AND place_id = ?
                    );`,
                    [exceptionId, placeId, exceptionId, placeId]
                );
            })

            await db.execAsync('COMMIT;');

            console.log('Exception inserted with ID:', exceptionId);
            return exceptionId
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting exception:', error);
            return 0
        }
    }, [db]);

    return insertException;
};

export default useInsertException;
