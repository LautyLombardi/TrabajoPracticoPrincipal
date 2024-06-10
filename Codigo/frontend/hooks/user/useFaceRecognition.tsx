import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Usuario } from '@/api/model/interfaces';
import { getUserDni } from '@/api/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

function useFaceRecognition() {
    const db = useSQLiteContext();
    
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<Usuario> => {
            const userDNI = await getUserDni();
            console.log('get user faceRecognition by DNI', userDNI)
            
            const user = await db.getFirstAsync<Usuario>(
                'SELECT * FROM user WHERE dni = ?',
                [userDNI]
            );
            if (!user) {
                throw new Error('User not found');
            }
            console.log('user faceRecognition in hook', user)
            await AsyncStorage.removeItem('user_data');
            return user;
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
    };
}

export default useFaceRecognition;