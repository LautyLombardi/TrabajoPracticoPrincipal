import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { parseFecha } from '@/util/parseDate'
import { Lugar } from '@/api/model/interfaces';

const useEditPlace= ()=>{
    const db = useSQLiteContext();

    const editPlace=useCallback(async(id:number,name:string,abbreviation:string,descrption:string,openTime:string,closeTime:string)=>{
        const createDate = getCurrentCreateDate();
        console.log("data a modificar",name,abbreviation,descrption,openTime,closeTime);
        try{
            await db.execAsync("BEGIN TRANSACTION");
            const resultUpdate=await db.runAsync(
                `UPDATE place SET name = ?, abbreviation = ?, description = ?, openTime = ?, closeTime = ?, createDate = ? WHERE id = ?`,
                [name,abbreviation,descrption,openTime,closeTime,createDate,id]
            )
            
            console.log('Update result:', resultUpdate);

            await db.execAsync('COMMIT');

            console.log("place updated successfully");
            return resultUpdate.lastInsertRowId;

        }catch(error){
            await db.execAsync('ROLLBACK;');
            console.error('Error updating place:', error);
            return 0;
        }
    },[db])

    return editPlace
}

export default useEditPlace