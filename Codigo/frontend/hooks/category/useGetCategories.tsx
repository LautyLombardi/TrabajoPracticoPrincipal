import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Categoria } from '@/api/model/interfaces';
import { useEffect } from 'react';

const useGetCategories = () => {
    const db = useSQLiteContext();
    const queryClient = useQueryClient();

    const categoriesQuery = useQuery<Categoria[]>({
        queryKey: ['categories'],
        queryFn: async (): Promise<Categoria[]> => {
            return db.getAllAsync('SELECT * FROM category ORDER BY createDate');
        },
    });
    
    const getCategoryData = async (category: Categoria, categoryId: number): Promise<Categoria> => {
        
        const placeCategory = await db.getAllAsync<{ place_id: number }>(
            `SELECT place_id FROM category_place WHERE category_id = ?`,
            [categoryId]
        ) as { place_id: number }[];

        const placeIds = placeCategory.map(place => place.place_id);
        
        const placeNames = await db.getAllAsync<{ name: string }>(
            `SELECT name FROM place WHERE id IN (${placeIds.join(',')})`
        ) as { name: string }[];

        const placesName = placeNames.map(place => place.name);

        if(category.isExtern === 0){
            const categoryInstitute = await db.getAllAsync<{ institute_id: number }>(
                `SELECT institute_id FROM category_institute WHERE category_id = ?`,
                [categoryId]
            ) as { institute_id: number }[];
            
            const instituteIds = categoryInstitute.map(institute => institute.institute_id);

            const instituteNames = await db.getAllAsync<{ name: string }>(
                `SELECT name FROM institute WHERE id IN (${instituteIds.join(',')})`
            ) as { name: string }[];

            const institutesName = instituteNames.map(institute => institute.name);

            const updatedCategory: Categoria = {
                ...category,
                places: placesName,
                institutes: institutesName,
            };

            return updatedCategory;
        } else {
            const updatedCategory: Categoria = {
                ...category,
                places: placesName,
                institutes: [],
            };

            return updatedCategory;
        }
    }

    useEffect(() => {
        if (categoriesQuery.isSuccess && categoriesQuery.data) {
            const fetchData = async () => {
                const updatedCategories = await Promise.all(categoriesQuery.data.map(async (category) => {
                    return await getCategoryData(category, category.id);
                }));
                
                queryClient.setQueryData<Categoria[]>(['categories'], updatedCategories);
                
                console.log('categories data: ', updatedCategories);
            };
            fetchData();
        }
    }, [categoriesQuery.isSuccess, categoriesQuery.data, queryClient]);

    return {
        categories: categoriesQuery.data,
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError,
        refetch: categoriesQuery.refetch,
    };
}

export default useGetCategories;
