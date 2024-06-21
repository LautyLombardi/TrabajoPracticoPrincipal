import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { parseFecha } from '@/util/parseDate';

const useInsertUser = () => {
    const db = useSQLiteContext();

    const insertUser = useCallback(async (dni: number,  role_id: number, name: string,lastname: string, 
                 password: string,  activeDate: string ) => {
        const createDate = getCurrentCreateDate();
        const activeDatee = parseFecha(activeDate);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            const result = await db.runAsync(
                `INSERT INTO user (dni, role_id, name, lastname, password, isActive , activeDate,createDate) VALUES (?, ?, ?, ?, ?, 1,?, ?);`,
                [dni, role_id, name, lastname, password, activeDatee,createDate]
            );

            console.log('Insert result:', result.lastInsertRowId, result.changes);
            const userId = result.lastInsertRowId;

            await db.execAsync('COMMIT;');

            console.log('User inserted with ID:', userId);
            return userId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting user:', error);
            return 0;
        }
    }, [db]);

    return insertUser;
};

export default useInsertUser;
