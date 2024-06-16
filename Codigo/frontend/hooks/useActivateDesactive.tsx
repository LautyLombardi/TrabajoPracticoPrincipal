import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Lista blanca de tablas permitidas
const ALLOWED_TABLES = ['institute', 'category', 'enterprice', 'place']; // Añade aquí las tablas que permites modificar

const useActivateDesactive = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const getQueryKey = (tableName: string) => {
        switch (tableName) {
            case 'institute':
                return ['institutes'];
            case 'category':
                return ['categories'];
            case 'enterprice':
                return ['enterprices'];
            case 'place':
                return ['places'];
            default:
                return [tableName]; // Por defecto, devolver un array con el nombre de la tabla
        }
    };

    const activateDesactive = useCallback(async (objectId: number, tableName : string, statusObject : number) => {
        if (!ALLOWED_TABLES.includes(tableName)) {
            console.error('Table name not allowed:', tableName);
            return 0;
        }

        const newStatus = statusObject === 1 ? 0 : 1;

        try {
            // Begin the transaction
            await db.execAsync('BEGIN TRANSACTION;');

            // Update the object status
            const query = `UPDATE ${tableName} SET isActive = ? WHERE id = ?;`;
            const result = await db.runAsync(query, [newStatus, objectId]);

            console.log('Update result:', result.changes);

            // Commit the transaction
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log(`Object ${newStatus === 1 ? 'activated' : 'deactivated'} with ID:`, objectId);
                
                // Invalidate the query with the appropriate query key
                queryClient.invalidateQueries({ queryKey: getQueryKey(tableName) });
                return objectId;
            } else {
                console.warn('No object found with ID:', objectId);
                return 0;
            }
        } catch (error) {
            // Rollback the transaction in case of an error
            await db.execAsync('ROLLBACK;');
            console.error('Error updating object status:', error);
            return 0;
        }
    }, [db, queryClient]);

    return activateDesactive;
};

export default useActivateDesactive;
