import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { getCurrentCreateDate } from '@/util/getCreateDate';

const useDeactivateVisitor = () => {
    const db = useSQLiteContext();

    const deactivateVisitor = useCallback(async (visitorId: number) => {
        const finishDate=getCurrentCreateDate();
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE visitor SET isActive = 0, finishDate = ? WHERE dni = ?;`,
                [finishDate, visitorId]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Visitor Deactivated with ID:', visitorId);
                return visitorId;
            } else {
                console.warn('No Visitor found with ID:', visitorId);
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