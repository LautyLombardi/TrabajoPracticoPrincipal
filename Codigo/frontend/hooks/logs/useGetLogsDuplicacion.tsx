import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';

const useGetLogsDuplicacion = () => {
    const db = useSQLiteContext();
    const getLogsForDuplicacion = useCallback(async () => {
        try {
            const logsData = await db.getAllAsync<Logs>('SELECT * FROM logs WHERE abm = "Modificacion de visitante" OR abm = "Modificacion de usuario"');
            
            console.log('logs data by duplicación: ', logsData);
            if(logsData){
                return {
                    logs: logsData
                };
            } else {
                return {
                    logs: undefined
                };
            }
        } catch (error) {
            console.error('Error getting logs by duplicación:', error);
            return {
                logs: undefined,
                isLoading: false,
                isError: true,
            };
        }
    }, [db]);

    return getLogsForDuplicacion;
}

export default useGetLogsDuplicacion;
