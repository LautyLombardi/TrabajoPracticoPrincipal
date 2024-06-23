import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';

const useGetLogsForReport = () => {
    const db = useSQLiteContext();
    const getLogsForReport = useCallback(async () => {
        try {
            const logsData = await db.getAllAsync<Logs>('SELECT * FROM logs WHERE visitorId AND isEnter = 1 OR isEnter = 0 ORDER BY createDate DESC');
            
            console.log('logs data by visitorDNI: ', logsData);
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
            console.error('Error getting logs by visitorDNI:', error);
            return {
                logs: undefined,
                isLoading: false,
                isError: true,
            };
        }
    }, [db]);

    return getLogsForReport;
}

export default useGetLogsForReport;
