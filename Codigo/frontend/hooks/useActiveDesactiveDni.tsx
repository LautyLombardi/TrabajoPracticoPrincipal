import { useSQLiteContext } from '@/context/SQLiteContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// Lista blanca de tablas permitidas
const ALLOWED_TABLES = ['user','visitor']; // Añade aquí las tablas que permites modificar

const useActivateDesactiveDNI = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const activateDesactiveDNI = useCallback(async (objectDNI: number, tableName: string, statusObject : number) => {
        if (!ALLOWED_TABLES.includes(tableName)) {
            console.error('Table name not allowed:', tableName);
            return 0;
        }

        const newStatus = statusObject === 1 ? 0 : 1;

        try {
            // Begin the transaction
            await db.execAsync('BEGIN TRANSACTION;');

            // Update the object status
            const query = `UPDATE ${tableName} SET isActive = ? WHERE dni = ?;`;
            const result = await db.runAsync(query, [newStatus, objectDNI]);

            console.log('Update result:', result.changes);

            // Commit the transaction
            await db.execAsync('COMMIT;');

            if (result.changes > 0) {
                console.log(`Object ${newStatus === 1 ? 'activated' : 'deactivated'} with DNI:`, objectDNI);
                queryClient.invalidateQueries({ queryKey: [tableName] });
                return objectDNI;
            } else {
                console.warn('No object found with DNI:', objectDNI);
                return 0;
            }
        } catch (error) {
            // Rollback the transaction in case of an error
            await db.execAsync('ROLLBACK;');
            console.error('Error updating object status:', error);
            return 0;
        }
    }, [db]);

    return activateDesactiveDNI;
};

export default useActivateDesactiveDNI;
