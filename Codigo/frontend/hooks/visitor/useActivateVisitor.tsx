import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useActivateVisitor = () => {
    const db = useSQLiteContext();

    const activateVisitor = useCallback(async (visitorId: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE visitor SET isActive = 1, finishDate = ? WHERE dni = ?;`,
                [null, visitorId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Visitor activated with ID:', visitorId);
                return visitorId;
            } else {
                console.warn('No Visitor found with ID:', visitorId);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error activating Visitor:', error);
            return 0;
        }
    }, [db]);

    return activateVisitor;
};

export default useActivateVisitor;