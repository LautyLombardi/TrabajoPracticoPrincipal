import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Categoria, Empresa, Lugar, Visitante } from '@/api/model/interfaces';
import { useEffect } from 'react';

const useGetVisitors = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const visitorsQuery = useQuery<Visitante[]>({
        queryKey: ['visitors'],
        queryFn: async (): Promise<Visitante[]> =>
            db.getAllAsync('SELECT * FROM visitor ORDER BY createDate'),
    });

    const getCategory = async (visitor : Visitante ,visitorId: number): Promise<Visitante> => {
        const { category_id } = await db.getFirstAsync<{ category_id: number}>(
            `SELECT category_id FROM category_visitor WHERE visitor_id = ?`,
            [visitorId]
        ) as { category_id: number};

        const category = await db.getFirstAsync<Categoria>(
            `SELECT * FROM category WHERE id = ?`,
            [category_id]
        ) as Categoria;

        const visitante: Visitante = {
            ...visitor,
            category: category.name,
        };
        visitante.isExtern = category.isExtern;

        if (category.isExtern === 1) {     
            // Enterprise    
            const empresa = await db.getFirstAsync<Empresa>(
                `SELECT * FROM enterprice WHERE id = ?`,
                [visitante.enterprice_id]
            ) as Empresa;
            visitante.empresa = empresa.name;

            // Places
            const places = await db.getAllAsync<Lugar>(
                `SELECT name FROM place 
                INNER JOIN category_place ON place.id = category_place.place_id
                WHERE category_place.category_id = ?`,
                [category_id]
            ) as Lugar[];

            visitante.places = places.map(place => place.name);
        }else {
            // Institutes
            const categoryInstitutes = await db.getAllAsync<{ institute_id: number }>(
                `SELECT institute_id FROM category_institute WHERE category_id = ?`,
                [category_id]
            ) as { institute_id: number }[];

            const instituteIds = categoryInstitutes.map(institute => institute.institute_id);
            const instituteNames = await db.getAllAsync<{ name: string }>(
                `SELECT name FROM institute WHERE id IN (${instituteIds.join(',')})`
            ) as { name: string }[];

            visitante.institutes = instituteNames.map(institute => institute.name);

            // Places
            const placeInstitute = await db.getAllAsync<{ place_id: number }>(
                `SELECT place_id FROM institute_place WHERE institute_id IN (${instituteIds.join(',')})`
            ) as { place_id: number }[];

            const placeCategory = await db.getAllAsync<{ place_id: number }>(
                `SELECT place_id FROM category_place WHERE category_id = ?`,
                [category_id]
            ) as { place_id: number }[];

            const combinedPlaceIds = [...placeInstitute, ...placeCategory].map(place => place.place_id);
            const uniquePlaceIds = Array.from(new Set(combinedPlaceIds));

            const placeNames = await db.getAllAsync<{ name: string }>(
                `SELECT name FROM place WHERE id IN (${uniquePlaceIds.join(',')})`
            ) as { name: string }[];

            visitante.places = placeNames.map(place => place.name);
        }
        return visitante;
    };

    useEffect(() => {
        if (visitorsQuery.isSuccess && visitorsQuery.data) {
            const fetchVisitors = async () => {
                const updatedVisitors = await Promise.all(visitorsQuery.data.map(async (visitor) => {
                    const updatedVisitor = await getCategory(visitor, visitor.dni);
                    return updatedVisitor;
                }));
                
                queryClient.setQueryData<Visitante[]>(['visitors'], updatedVisitors);
                
                console.log('visitors data: ', updatedVisitors);
            };
            fetchVisitors()
        }
    }, [visitorsQuery.isSuccess, visitorsQuery.data, queryClient]);

    return {
        visitors: visitorsQuery.data,
        isLoading: visitorsQuery.isLoading,
        isError: visitorsQuery.isError,
    };
};

export default useGetVisitors