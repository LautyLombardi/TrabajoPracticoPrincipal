import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Usuario } from '@/api/model/interfaces';
import { getAdmDni } from '@/api/services/storage';

function useFaceRecognitionUser() {
    const db = useSQLiteContext();
    
    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<Usuario> => {
            const admDNI = await getAdmDni();
            console.log('get user by dni', admDNI)
            
            const user = await db.getFirstAsync<Usuario>(
                'SELECT * FROM user WHERE dni = ?',
                [admDNI]
            );
            if (!user) {
                throw new Error('User not found');
            }
            console.log('user in hook', user)
            return user;
        },
    });

    return {
        user: userQuery.data,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,
    };
}

export default useFaceRecognitionUser;