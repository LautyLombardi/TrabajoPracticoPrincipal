import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useInsertFaceRecognitionLogsFail = () => {
    const db = useSQLiteContext();

    const insertFaceRecognitionLogFail = useCallback(async ( admDni: number | null , type_adm: string) => {
        const createDate = getCurrentCreateDate();
        console.log('data a cargar: ',  admDni);
        var number
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            if(type_adm=== 'usuario'){
                const result = await db.runAsync(
                    `INSERT INTO logs ( admDni, hasAccess, isFaceRecognition,description, createDate, isAutomatic) VALUES ( ?, 0, 1, 'Error al realizar un reconocimento facial a un usuario ', ?, 0);`,
                    [ admDni, createDate]
                );

                number = result.lastInsertRowId


            }else{
                const result = await db.runAsync(
                    `INSERT INTO logs ( admDni, hasAccess, isFaceRecognition,description, createDate, isAutomatic) VALUES ( ?, 0, 1, 'Error al realizar un reconocimento facial a un visitante ', ?, 0);`,
                    [ admDni, createDate]
                );
                number = result.lastInsertRowId

            }
            
            await db.execAsync('COMMIT;');

            console.log('Logs inserted with ID:', number);
            return number;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log image:', error);
            return 0;
        }
    }, [db]);

    return insertFaceRecognitionLogFail;
};

export default useInsertFaceRecognitionLogsFail;