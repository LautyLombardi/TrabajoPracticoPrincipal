import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useActivateCategory = () => {
    const db = useSQLiteContext();

    const activateCategory = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE category SET isActive = 1 WHERE id = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Category activated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No Category found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error activating Category:', error);
            return 0;
        }
    }, [db]);

    return activateCategory;
};

export default useActivateCategory;