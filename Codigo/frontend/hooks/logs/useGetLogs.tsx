import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Logs } from '@/api/model/interfaces';

const useGetLogs = () => {
    const db = useSQLiteContext();

    const logsQuery = useQuery<Logs[]>({
        queryKey: ['logs'],
        queryFn: (): Promise<Logs[]> =>
          db.getAllAsync('SELECT * FROM logs ORDER BY createDate'),
    });
    console.log('logs data: ', logsQuery.data);
    return {
        logs: logsQuery.data,
        isLoading: logsQuery.isLoading,
        isError: logsQuery.isError,
    };
}

export default useGetLogs