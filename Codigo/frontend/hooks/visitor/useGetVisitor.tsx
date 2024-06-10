import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import {  Visitante } from '@/api/model/interfaces';

function useGetVisitor(dni: number) {
    const db = useSQLiteContext();
    console.log('get visitor by dni', dni)
    const visitorQuery = useQuery({
        queryKey: ['visitor', dni],
        queryFn: async (): Promise<Visitante> => {
            const visitor = await db.getFirstAsync<Visitante>(
                'SELECT * FROM visitor WHERE dni = ?',
                [dni]
            );
            if (!visitor) {
                throw new Error('visitor not found');
            }
            console.log('visitor in hook', visitor)
            return visitor;
        },
    });

    return {
        visitor: visitorQuery.data,
        isLoading: visitorQuery.isLoading,
        isError: visitorQuery.isError,
    };
}

export default useGetVisitor;