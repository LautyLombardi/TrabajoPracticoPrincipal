import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useActivateInstitute = () => {
    const db = useSQLiteContext();

    const activateInstitute = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE institute SET isActive = 1 WHERE id = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Institute activated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No institute found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error activating institute:', error);
            return 0;
        }
    }, [db]);

    return activateInstitute;
};

export default useActivateInstitute;