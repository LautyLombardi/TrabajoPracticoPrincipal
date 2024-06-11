import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivateInstitute = () => {
    const db = useSQLiteContext();

    const deactivateInstitute = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE institute SET isActive = 0 WHERE id = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Institute deactivated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No institute found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error deactivating institute:', error);
            return 0;
        }
    }, [db]);

    return deactivateInstitute;
};

export default useDeactivateInstitute;