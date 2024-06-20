import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';
import { getAdmDni } from '@/api/services/storage';

const useGetLogsForAdmDni = () => {
    const db = useSQLiteContext();
    const getLogsForAdmDni = useCallback(async () => {
        const admDni = await getAdmDni();
        try {
            const logsData = await db.getAllAsync<Logs>('SELECT * FROM logs WHERE admDni = ? AND visitorId', [admDni]);
            
            console.log('logs data by admiDni: ', logsData);
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
            console.error('Error getting logs:', error);
            return {
                logs: undefined,
                isLoading: false,
                isError: true,
            };
        }
    }, [db]);

    return getLogsForAdmDni;
}

export default useGetLogsForAdmDni;
