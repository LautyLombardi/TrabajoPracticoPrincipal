import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useActivateUser = () => {
    const db = useSQLiteContext();

    const activateUser = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE user SET isActive = 1 WHERE id = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('User activated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No User found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error activating User:', error);
            return 0;
        }
    }, [db]);

    return activateUser;
};

export default useActivateUser;