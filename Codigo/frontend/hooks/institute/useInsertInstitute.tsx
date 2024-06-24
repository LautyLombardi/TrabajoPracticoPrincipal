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

            const isExist = await db.getFirstAsync(`SELECT * FROM institute WHERE name = ?;`, [name]);

            if (isExist) {
                await db.execAsync('ROLLBACK;');
                console.log('Institute already exist');
                return -1;
            } 

            // Insert query
            const result = await db.runAsync(
                `INSERT INTO institute (name, isActive, createDate) VALUES (?, 1, ?);`,
                [name, createDate]
            );
            const instituteId = result.lastInsertRowId;

            placeIds.forEach(async placeId =>{
                await db.runAsync(
                    `INSERT INTO institute_place (place_id, institute_id)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM institute_place WHERE place_id = ? AND institute_id = ?
                    );`,
                    [placeId, instituteId, placeId, instituteId]
                );
            })
            console.log('Insert result:', instituteId, result.changes);            

            await db.execAsync('COMMIT;');

            console.log('Institute inserted with ID:', instituteId);
            return instituteId
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting institute:', error);
            return 0
        }
    }, [db]);

    return insertInstitute;
};

export default useInsertInstitute;
