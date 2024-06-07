import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertPlace = () => {
    const db = useSQLiteContext();

    const insertPlace = useCallback(async (name: string, abbreviation: string, 
                                    description: string, openTime: string, closeTime: string,) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', name, abbreviation, description, openTime, closeTime);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO place (name, abbreviation, description, openTime, closeTime, isActive, createDate) VALUES (?, ?, ?, ?, ?, 1, ?);`,
                [name, abbreviation, description, openTime, closeTime, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const placeId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Place inserted with ID:', placeId);
            return placeId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting place:', error);
            return 0;
        }
    }, [db]);

    return insertPlace;
};

export default useInsertPlace;
