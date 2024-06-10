import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Lugar, Visitante } from '@/api/model/interfaces';
import { getVisitorDni } from '@/api/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useFaceRecognition() {
    const db = useSQLiteContext();
    
    const visitorQuery = useQuery({
        queryKey: ['visitor'],
        queryFn: async (): Promise<Visitante> => {
            const visitorDNI = await getVisitorDni();
            console.log('get visitor faceRecognition by DNI', visitorDNI)
            
            const visitor = await db.getFirstAsync<Visitante>(
                'SELECT * FROM visitor WHERE dni = ?',
                [visitorDNI]
            );
            if (!visitor) {
                throw new Error('Visitor not found');
            }
            const { category_id } = await db.getFirstAsync<{ category_id: number}>(
                `SELECT category_id FROM category_visitor WHERE visitor_id = ?`,
                [visitorDNI]
            ) as { category_id: number};
            
            const places = await db.getAllAsync<Lugar>(
                `SELECT name FROM place 
                INNER JOIN category_place ON place.id = category_place.place_id
                WHERE category_place.category_id = ?`,
                [category_id]
            ) as Lugar[];

            visitor.places = places.map(place => place.name);
            
            console.log('visitor faceRecognition in hook', visitor)
            await AsyncStorage.removeItem('visitor_data');
            return visitor;
        },
    });

    return {
        visitor: visitorQuery.data,
        isLoading: visitorQuery.isLoading,
        isError: visitorQuery.isError,
    };
}

export default useFaceRecognition;