import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';
import { Empresa } from '@/api/model/interfaces';


const useGetEnterprice = () => {
    const db = useSQLiteContext();

    const getEnterprice = useCallback(async (id : number) => {
        console.log('enterprice by id', id);
        try {

            const enterpriceDB = await db.getFirstAsync<Empresa>(
                'SELECT * FROM enterprice WHERE id = ?',
                [id]
            );
            console.log('enterpriceDB by id', enterpriceDB);
            if (enterpriceDB && enterpriceDB !== null) {
                return enterpriceDB;
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error updating enterprice:', error);
            return undefined;
        }
    }, [db]);
    return getEnterprice;

};

export default useGetEnterprice;
