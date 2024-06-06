import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite/next';
import { Excepcion } from '@/api/model/interfaces';

const useGetExceptions = () => {
    const db = useSQLiteContext();

    const query = useQuery<Excepcion[]>({
        queryKey: ['Excepciones'],
        queryFn: async (): Promise<Excepcion[]> => {
            console.log("Fetching exceptions...");
            const results = await db.getAllAsync(`
                    SELECT 
                        Exception.*, 
                        GROUP_CONCAT(DISTINCT Place.name) AS place_names,
                        GROUP_CONCAT(DISTINCT Category.name) AS category_names
                    FROM 
                        Exception
                    LEFT JOIN 
                        place_exception ON Exception.id = place_exception.exception_id
                    LEFT JOIN 
                        Place ON place_exception.place_id = Place.id
                    LEFT JOIN 
                        category_exception ON Exception.id = category_exception.exception_id
                    LEFT JOIN 
                        Category ON category_exception.category_id = Category.id
                    GROUP BY 
                        Exception.id
                    ORDER BY 
                        Exception.createDate

            `);

            console.log("Results:", results);

            const exceptions: Excepcion[] = results.map((row: any) => {
                console.log("Processing row:", row);
                return {
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    duration: row.duration,
                    createDate: row.createDate,
                    place_name: row.place_names ? row.place_names.split(',') : [],
                    category_name: row.category_names ? row.category_names.split(',') : [],
                };
            });

            console.log("Exceptions:", exceptions);

            return exceptions;
        },
    });

    return query;
}

export default useGetExceptions;