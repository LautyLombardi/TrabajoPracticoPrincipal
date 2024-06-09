import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { parseFecha } from '@/util/parseDate';
import { Visitante } from '@/api/model/interfaces';


const useEditVisitor = () => {
    const db = useSQLiteContext();

    const editVisitor = useCallback(async (visitorOld: Visitante, dniNew: number, nameNew: string, lastnameNew: string, passwordNew: string, dateActive: string,emailNew:String) => {
    /*  const createDate = getCurrentCreateDate();
        const dateActiveN = parseFecha(dateActive);
        console.log('Data a modificar', userOld, dniNew, nameNew, lastnameNew, role_idNew, 'passwordNew', passwordNew, dateActiveN, motive);
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            
            // Insert into user_history
            await db.runAsync(
                `INSERT INTO user_history (dniO, dniN, enterprice_idO, enterprice_idN, nameO, nameN, lastnameO, lastnameN, passwordO, passwordN, emailN,emailO isActiveO, isActiveN,
                                        motiveO, motiveN, activeDateO, activeDateN, createDateO, createDateN ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, 0, 1, '', ?, '', ?, ?, ?);`,
                [userOld.dni, dniNew, userOld.role_id, role_idNew || userOld.role_id, userOld.name, nameNew, userOld.lastname, lastnameNew, passwordNew || '', motive, dateActiveN, userOld.createDate,createDate]
            )

            // Update user table
            const updateParams = [dniNew, role_idNew || userOld.role_id, nameNew, lastnameNew, dateActiveN, createDate, userOld.dni];
            let updateQuery = `UPDATE user SET dni = ?, role_id = ?, name = ?, lastname = ?, isActive = 1, activeDate = ?, createDate = ?`;

            if (passwordNew) {
                updateQuery += `, password = ?`;
                updateParams.splice(4, 0, passwordNew);
            }
            
            updateQuery += ` WHERE dni = ?;`;

            const resultUpdate = await db.runAsync(updateQuery, updateParams);

            console.log('Update result:', resultUpdate);

            await db.execAsync('COMMIT;');

            console.log('User updated successfully');
            return resultUpdate.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error updating user:', error);
            return 0;
        }
*/    }, [db]);
  return editVisitor;

};

export default useEditVisitor;

