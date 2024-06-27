import { Usuario, Visitante } from '@/api/model/interfaces';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';

const useCheckDNI = () => {
    const db = useSQLiteContext();

    const checkDNI = useCallback(async ( dni: string, abm : string) => {
        try {
            if(abm === 'user'){
                const user = await db.getFirstAsync<Usuario>(
                    'SELECT * FROM user WHERE dni = ?',
                    [dni]
                );
                if (!user) {
                    return 0;
                }
                return 1;
            } else {
                const visitor = await db.getFirstAsync<Visitante>(
                    'SELECT * FROM visitor WHERE dni = ?',
                    [dni]
                );
                if (!visitor) {
                    return 0;
                }
                console.log('user in hook', visitor)
                return 1;
            }
        } catch (error) {
            console.error('Error inserting Logs:', error);
            return 0;
        }
    }, [db]);

    return checkDNI;
};
export default useCheckDNI;
