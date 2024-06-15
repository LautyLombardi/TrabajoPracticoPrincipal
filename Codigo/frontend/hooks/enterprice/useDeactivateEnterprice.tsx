import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useDeactivateEnterprice = () => {
    const db = useSQLiteContext();

    const deactivateEnterprice = useCallback(async (EnterpriceID: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE enterprice SET isActive = 0 WHERE id = ?;`,
                [EnterpriceID]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Enterprice Deactivated with ID:', EnterpriceID);
                return EnterpriceID;
            } else {
                console.warn('No Enterprice found with ID:', EnterpriceID);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error Deactivating Enterprice:', error);
            return 0;
        }
    }, [db]);

    return deactivateEnterprice;
};

export default useDeactivateEnterprice;