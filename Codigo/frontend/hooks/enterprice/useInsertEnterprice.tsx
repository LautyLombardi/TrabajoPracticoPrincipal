import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertEnterprice = () => {
    const db = useSQLiteContext();

    const insertEnterprice = useCallback(async (name: string, cuit: number) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar', name, cuit);

        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO enterprice (name, cuit,isActive, createDate) VALUES (?, ?, 1, ?);`,
                [name, cuit, createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const enterpriceId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('Enterprice inserted with ID:', enterpriceId);
            return enterpriceId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting Enterprice:', error);
            return 0;
        }
    }, [db]);

    return insertEnterprice;
};

export default useInsertEnterprice; 