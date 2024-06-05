import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Instituto } from '@/api/model/interfaces';

const useGetInstitutes = () => {
    const db = useSQLiteContext();

    const query = useQuery<Instituto[]>({
        queryKey: ['institutes'],
        queryFn: (): Promise<Instituto[]> =>
          db.getAllAsync('SELECT * FROM institute ORDER BY createDate'),
    });

    return query;
}

export default useGetInstitutes
