import { useSQLiteContext } from '@/context/SQLiteContext';
import { Lugar, Visitante } from '@/api/model/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

function useFaceRecognition() {
    const db = useSQLiteContext();
    
    const getFaceRecognitionVisitor = useCallback(async (visitorDni: number) => {
        try {
            const visitor = await db.getFirstAsync<Visitante>(
                'SELECT * FROM visitor WHERE dni = ?',
                [visitorDni]
            );
            if (!visitor) {
                throw new Error('Visitor not found');
            }

            const { category_id } = await db.getFirstAsync<{ category_id: number}>(
                `SELECT category_id FROM category_visitor WHERE visitor_id = ?`,
                [visitorDni]
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
        } catch (error) {
            console.error('Error getting user data by admiDni:', error);
            return;
        }
    }, [db]);

    return getFaceRecognitionVisitor;
}

export default useFaceRecognition;