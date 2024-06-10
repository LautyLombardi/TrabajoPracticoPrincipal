import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivateCategory = () => {
    const db = useSQLiteContext();

    const deactivateCategory = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE category SET isActive = 0 WHERE id = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Category Deactivated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No Category found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error Deactivating Category:', error);
            return 0;
        }
    }, [db]);

    return deactivateCategory;
};

export default useDeactivateCategory;