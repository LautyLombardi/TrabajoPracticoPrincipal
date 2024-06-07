import { useSQLiteContext } from '@/context/SQLiteContext';
import { getCurrentCreateDate } from '@/util/getCreateDate';
import { useCallback } from 'react';
import { Categoria} from '@/api/model/interfaces';
import { parseFecha } from '@/util/parseDate';

const useInsertVisitor = () => {
    const db = useSQLiteContext();

    const insertVisitor = useCallback(async (name: string, lastname: string, dni: number, 
                            email: string, dateIngreso: string, categoria: Categoria, empresaId: number, institutoId: number ) => {
        const createDate = getCurrentCreateDate();
        const startDate = parseFecha(dateIngreso);
        
        try {
            await db.execAsync('BEGIN TRANSACTION;');
            // Insert query
            if(categoria.isExtern === 1){
                const result = await db.runAsync(
                    `INSERT INTO visitor (dni, enterprice_id, name, lastname, email, startDate, isActive, createDate) VALUES (?, ?, ?, ?, ?, ?, 1, ?);`,
                    [dni, empresaId, name, lastname, email, startDate, createDate]
                );
                const visitorId = result.lastInsertRowId;

                await db.runAsync(
                    `INSERT INTO category_visitor (category_id, visitor_id) VALUES (?, ?);`,
                    [categoria.id, visitorId]
                );

                await db.execAsync('COMMIT;');

                console.log('Visitor inserted with ID:', visitorId);
                return visitorId;

            } else {
                const result = await db.runAsync(
                    `INSERT INTO visitor (dni, name, lastname, email, startDate, isActive, createDate) VALUES (?, ?, ?, ?, ?, 1, ?);`,
                    [dni, name, lastname, email, startDate, createDate]
                );
                const visitorId = result.lastInsertRowId;

                await db.runAsync(
                    `INSERT INTO category_institute (category_id, institute_id)
                        SELECT ?, ?
                        WHERE NOT EXISTS (
                            SELECT 1 FROM category_institute WHERE category_id = ? AND institute_id = ?
                    );`,
                    [categoria.id, institutoId, categoria.id, institutoId]
                );

                await db.execAsync('COMMIT;');

                console.log('Visitor inserted with ID:', visitorId);
                return visitorId;
            }           
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting visitor:', error);
            return 0;
        }
    }, [db]);

    return insertVisitor;
};

export default useInsertVisitor;
