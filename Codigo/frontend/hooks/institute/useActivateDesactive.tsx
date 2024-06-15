import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Instituto } from '@/api/model/interfaces';

const useActivateDesactive = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const activateDesactive = useCallback(async (institute: Instituto) => {
        const newStatus = institute.isActive === 1 ? 0 : 1;

        try {
            // Begin the transaction
            await db.execAsync('BEGIN TRANSACTION;');

            // Update the institute status
            const result = await db.runAsync(
                `UPDATE institute SET isActive = ? WHERE id = ?;`,
                [newStatus, institute.id]
            );

            console.log('Update result:', result.changes);

            // Commit the transaction
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log(`Institute ${newStatus === 1 ? 'activated' : 'deactivated'} with ID:`, institute.id);
                queryClient.invalidateQueries({ queryKey: ['institutes']});
                return institute.id;
            } else {
                console.warn('No institute found with ID:', institute.id);
                return 0;
            }
        } catch (error) {
            // Rollback the transaction in case of an error
            await db.execAsync('ROLLBACK;');
            console.error('Error updating institute status:', error);
            return 0;
        }
    }, [db]);

    return activateDesactive;
};

export default useActivateDesactive;