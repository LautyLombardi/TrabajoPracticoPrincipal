import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Excepcion, Lugar, Categoria } from '@/api/model/interfaces';
import { useEffect } from 'react';

const useGetExceptions = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const exceptionsQuery = useQuery<Excepcion[]>({
        queryKey: ['exceptions'],
        queryFn: async (): Promise<Excepcion[]> =>
            db.getAllAsync('SELECT * FROM exception ORDER BY createDate'),
    });

    const getExceptionDetails = async (excepcion: Excepcion, exceptionId: number): Promise<Excepcion> => {
        const places = await db.getAllAsync<Lugar>(
            `SELECT name 
            FROM place 
            WHERE id IN (
                SELECT place_id 
                FROM place_exception 
                WHERE exception_id = ?
            )`,
            [exceptionId]
        ) as Lugar[];

        const placeNames = places.map(place => place.name);

        // Fetch associated categories
        const getCategory = await db.getAllAsync<Categoria>(
            `SELECT name 
            FROM Category 
            WHERE id IN (
                SELECT category_id 
                FROM category_exception 
                WHERE exception_id = ?
            )`,
            [exceptionId]
        ) as Categoria[];

    
        const categoryName = getCategory.map(category => category.name);
        return {
            ...excepcion,
            place_names: placeNames,
            category_name: categoryName[0],
        };
    };

    useEffect(() => {
        if (exceptionsQuery.isSuccess && exceptionsQuery.data) {
            const fetchExceptions = async () => {
                const updatedExceptions = await Promise.all(exceptionsQuery.data.map(async (exception) => {
                    const updatedException = await getExceptionDetails(exception, exception.id);
                    return updatedException;
                }));

                queryClient.setQueryData<Excepcion[]>(['exceptions'], updatedExceptions);

            };
            fetchExceptions();
        }
    }, [exceptionsQuery.isSuccess, exceptionsQuery.data, queryClient]);

    return {
        exceptions: exceptionsQuery.data,
        isLoading: exceptionsQuery.isLoading,
        isError: exceptionsQuery.isError,
    };
};

export default useGetExceptions;
