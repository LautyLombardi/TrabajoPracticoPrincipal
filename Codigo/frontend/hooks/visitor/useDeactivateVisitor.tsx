import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivateVisitor = () => {
    const db = useSQLiteContext();

    const deactivateVisitor = useCallback(async (instituteId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE visitor SET isActive = 0 WHERE dni = ?;`,
                [instituteId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Visitor Deactivated with ID:', instituteId);
                return instituteId;
            } else {
                console.warn('No Visitor found with ID:', instituteId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error Deactivating Visitor:', error);
            return 0;
        }
    }, [db]);

    return deactivateVisitor;
};

export default useDeactivateVisitor;