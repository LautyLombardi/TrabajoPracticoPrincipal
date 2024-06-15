import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivatePlace = () => {
    const db = useSQLiteContext();

    const deactivatePlace = useCallback(async (placeId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE place SET isActive = 0 WHERE id = ?;`,
                [placeId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Place Deactivated with ID:', placeId);
                return placeId;
            } else {
                console.warn('No Place found with ID:', placeId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error deactivating Place:', error);
            return 0;
        }
    }, [db]);

    return deactivatePlace;
};

export default useDeactivatePlace;