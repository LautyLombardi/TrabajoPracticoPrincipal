import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { parseFecha } from '@/util/parseDate';
import { Visitante } from '@/api/model/interfaces';


const useEditVisitor = () => {
    const db = useSQLiteContext();

    const editVisitor = useCallback(async (visitorOld: Visitante, dniNew: number, nameNew: string, lastnameNew: string,emailNew:string) => {
        const createDate = getCurrentCreateDate();
        console.log('Data a modificar', visitorOld, dniNew, nameNew, lastnameNew, emailNew);
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            
            // Insert into user_history
            await db.runAsync(
                `INSERT INTO visitor_history (dniO, dniN, nameO, nameN, lastnameO, lastnameN, emailN,emailO, isActiveO, isActiveN,
                                         createDateO, createDateN ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1, ?, ?);`,
                [visitorOld.dni, dniNew, visitorOld.name, nameNew, visitorOld.lastname, lastnameNew,visitorOld.email, emailNew  , visitorOld.createDate,createDate]
            )

            // Update visitor table
            const updateParams = [dniNew, nameNew, lastnameNew, emailNew, visitorOld.dni];
            let updateQuery = `UPDATE visitor SET dni = ?, name = ?, lastname = ?, email = ?`;

            
            updateQuery += ` WHERE dni = ?;`;

            const resultUpdate = await db.runAsync(updateQuery, updateParams);

            console.log('Update result:', resultUpdate);

            await db.execAsync('COMMIT;');

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

