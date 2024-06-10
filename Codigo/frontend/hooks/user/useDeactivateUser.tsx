import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivateUser = () => {
    const db = useSQLiteContext();

    const deactivateUser = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE user SET isActive = 0 WHERE dni = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('User deactivated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No User found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error deactivating User:', error);
            return 0;
        }
    }, [db]);

    return deactivateUser;
};

export default useDeactivateUser;