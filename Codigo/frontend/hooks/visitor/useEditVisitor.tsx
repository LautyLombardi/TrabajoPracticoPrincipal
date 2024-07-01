import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { Visitante } from '@/api/model/interfaces';
import { useQueryClient } from '@tanstack/react-query';


const useEditVisitor = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const editVisitor = useCallback(async (visitorOld: Visitante, dniNew: number, nameNew: string, lastnameNew: string, emailNew:string) => {
        const createDate = getCurrentCreateDate();
        console.log('Data a modificar', visitorOld, dniNew, nameNew, lastnameNew, emailNew);
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            
            // Insert into user_history
            await db.runAsync(
                `INSERT INTO visitor_history (dniO, dniN, nameO, nameN, lastnameO, lastnameN, emailO, emailN, isActiveO, isActiveN, createDateN) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?);`,
                [visitorOld.dni, dniNew, visitorOld.name, nameNew, visitorOld.lastname, lastnameNew, visitorOld.email, emailNew, createDate]
            );

            // Update visitor table
            const updateParams = [nameNew, lastnameNew, emailNew, dniNew, visitorOld.dni];
            let updateQuery = `UPDATE visitor SET name = ?, lastname = ?, email = ?, dni = ? WHERE dni = ?;`;

            const resultUpdate = await db.runAsync(updateQuery, updateParams);
            console.log('Update result:', resultUpdate);

            // Update category_visitor table
            await db.runAsync(`UPDATE category_visitor SET visitor_id = ? WHERE visitor_id = ?;`,
                [dniNew, visitorOld.dni]
            );

            await db.execAsync('COMMIT;');

            queryClient.invalidateQueries({ queryKey: ['visitors']});

            console.log('visitor updated successfully');
            return resultUpdate.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error updating visitor:', error);
            return 0;
        }
    }, [db]);
    return editVisitor;

};

export default useEditVisitor;

