import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Empresa, Instituto } from '@/api/model/interfaces';

const useGetEnterprices = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const enterpricesQuery = useQuery<Empresa[]>({
        queryKey: ['enterprices'],
        queryFn: async (): Promise<Empresa[]> => {
            return db.getAllAsync('SELECT * FROM enterprice ORDER BY createDate');
        },
    });

    console.log('enterprices data: ', enterpricesQuery.data);

    return {
        enterprices: enterpricesQuery.data,
        isLoading: enterpricesQuery.isLoading,
        isError: enterpricesQuery.isError,
        refetch: enterpricesQuery.refetch,
    };
}

export default useGetEnterprices;
