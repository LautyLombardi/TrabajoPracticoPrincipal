import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

const useActivateEnterprice = () => {
    const db = useSQLiteContext();

    const activateEnterprice = useCallback(async (EnterpriceID: number) => {
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Update query
            const result = await db.runAsync(
                `UPDATE enterprice SET isActive = 1 WHERE id = ?;`,
                [EnterpriceID]
            );

            console.log('Update result:', result.changes);
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log('Enterprice activated with ID:', EnterpriceID);
                return EnterpriceID;
            } else {
                console.warn('No Enterprice found with ID:', EnterpriceID);
                return 0;
            }
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error activating Enterprice:', error);
            return 0;
        }
    }, [db]);

    return activateEnterprice;
};

export default useActivateEnterprice;