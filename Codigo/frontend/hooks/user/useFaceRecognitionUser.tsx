import { useSQLiteContext } from '@/context/SQLiteContext';
import { Usuario } from '@/api/model/interfaces';
import { useCallback } from 'react';

function useFaceRecognitionUser() {
    const db = useSQLiteContext();
    const getFaceRecognitionUser = useCallback(async (admDNI: number) => {
        try {
            const user = await db.getFirstAsync<Usuario>(
                'SELECT * FROM user WHERE dni = ?',
                [admDNI]
            );
            console.log('user data by admiDni: ', user);
            if (!user) {
                throw new Error('User not found');
            }
            console.log('user in hook', user)
            return user;
        } catch (error) {
            console.error('Error getting user data by admiDni:', error);
            return;
        }
    }, [db]);

    return getFaceRecognitionUser;
}

export default useFaceRecognitionUser;
