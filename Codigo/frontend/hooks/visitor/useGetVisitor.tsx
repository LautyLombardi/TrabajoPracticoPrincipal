import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import {  Visitante } from '@/api/model/interfaces';
import { useCallback } from 'react';

const useGetVisitor = () => {
    const db = useSQLiteContext();

    const getVisitor = useCallback(async (dni : number) => {
        console.log('visitant by id', dni);
        try {

            const visitantDB = await db.getFirstAsync<Visitante>(
                'SELECT * FROM visitor WHERE dni = ?',
                [dni]
            );
            console.log('visitantDB by id', visitantDB);
            if (visitantDB && visitantDB !== null) {
                return visitantDB;
            } else {
                return undefined;
            }
        } catch (error) {
            console.error('Error updating visitor:', error);
            return undefined;
        }
    }, [db]);
    return getVisitor;

};

export default useGetVisitor;