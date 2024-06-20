import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';

const useGetLogSyncError = () => {
    const db = useSQLiteContext();
    const getLogSyncError = useCallback(async () => {
        try {
            const logsData = await db.getAllAsync<Logs>('SELECT * FROM logs WHERE abm = "sync" AND isError = 1');
            
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

    return getLogSyncError;
}

export default useGetLogSyncError;
