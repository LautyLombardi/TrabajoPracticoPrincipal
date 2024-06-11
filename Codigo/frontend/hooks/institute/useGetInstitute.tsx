import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { Instituto } from '@/api/model/interfaces';


const useGetInstitute = () => {
    const db = useSQLiteContext();

    const getInstitute = useCallback(async (id : number) => {
        console.log('instituto by id', id);
        try {

            const instituteDB = await db.getFirstAsync<Instituto>(
                'SELECT * FROM institute WHERE id = ?',
                [id]
            );
            console.log('instituteDB by id', instituteDB);
            if (instituteDB && instituteDB !== null) {
                return instituteDB;
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error updating visitor:', error);
            return undefined;
        }
    }, [db]);
    return getInstitute;

};

export default useGetInstitute;

