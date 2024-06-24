import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Categoria, Empresa, Excepcion, Instituto, Logs, Lugar, Usuario, Visitante } from '@/api/model/interfaces';
import { syncEnterprice, syncLogs, syncUser, syncPlace,syncInstitute, syncCategories,syncVisitors, syncVisitor_history, syncExceptions } from '@/api/services/syncService';
import useSyncLog from './logs/useSyncLog';

const useSync = () => {
    const db = useSQLiteContext();
    const syncLog = useSyncLog()

    const sync = useCallback(async () => {
        console.log('realizando sincronizacion');
        await syncLog(null, '');
        
        // User
        const userDB: Usuario[] = await db.getAllAsync('SELECT * FROM user');
        if (userDB && userDB.length > 0) {
            console.log("User fetch")
            const {status,data} =  await syncUser(userDB)
            if(status !== 201){
                console.log("Usuario data error extraida" ,data)
                await syncLog(1, 'usuarios');
            } 
        }

        // Enterprice
        const entepriceDB: Empresa[] = await db.getAllAsync('SELECT * FROM enterprice');
        if (entepriceDB && entepriceDB.length > 0) {
            console.log("Enterprice fetch")
            const {status,data} =  await syncEnterprice(entepriceDB)
            if(status !== 201){
                console.log("Empresa data error extraida" ,data)
                await syncLog(1, 'empresas');                
            } 
        }   
        
        // Place
        const placeDB: Lugar[] = await db.getAllAsync('SELECT * FROM place');
        if (placeDB && placeDB.length > 0) {
            console.log("Place fetch")
            const {status,data} =  await syncPlace(placeDB)
            if(status !== 201){
                console.log("Lugar data error extraida" ,data)
                await syncLog(1, 'lugares');
            } 
        } 

        // Institute
        const instituteDB: Instituto[] = await db.getAllAsync('SELECT * FROM institute');
        if (instituteDB && instituteDB.length > 0) {
            console.log("Institute fetch")
            const {status,data} =  await syncInstitute(instituteDB)
            if(status !== 201){
                console.log("Instituto data error extraida" ,data)
                await syncLog(1, 'institutos'); 
            }
        }   
        
        // Category
        const categoriesDB: Categoria[] = await db.getAllAsync('SELECT * FROM category');
        if (categoriesDB && categoriesDB.length > 0) {
            console.log("Category fetch")
            for (const category of categoriesDB){
                const placeCategory = await db.getAllAsync<{ place_id: number }>(
                    `SELECT place_id FROM category_place WHERE category_id = ?`,
                    [category.id]
                ) as { place_id: number }[];
        
                const placeIds = placeCategory.map(place => place.place_id);
                
                const placeNames = await db.getAllAsync<{ name: string }>(
                    `SELECT name FROM place WHERE id IN (${placeIds.join(',')})`
                ) as { name: string }[];
        
                const placesName = placeNames.map(place => place.name);
        
                if(category.isExtern === 0){
                    const categoryInstitute = await db.getAllAsync<{ institute_id: number }>(
                        `SELECT institute_id FROM category_institute WHERE category_id = ?`,
                        [category.id]
                    ) as { institute_id: number }[];
                    
                    const instituteIds = categoryInstitute.map(institute => institute.institute_id);
        
                    const instituteNames = await db.getAllAsync<{ name: string }>(
                        `SELECT name FROM institute WHERE id IN (${instituteIds.join(',')})`
                    ) as { name: string }[];
        
                    const institutesName = instituteNames.map(institute => institute.name);
        
                    category.places = placesName
                    category.institutes= institutesName
                }else {
                    category.places=placesName
                    category.institutes=[]
                }    
            }            
            console.log("data extraida de categoria", categoriesDB)
            const {status,data} =  await syncCategories(categoriesDB)
            if(status !== 201){
                console.log("Categoria data error extraida" ,data)
                await syncLog(1, 'categorias');
            }  
        }  

        // Visitor
        const visitorsDB: Visitante[] = await db.getAllAsync('SELECT * FROM visitor');

        if (visitorsDB && visitorsDB.length > 0) {
            console.log("Visitor fetch")
            for (const visitor of visitorsDB) {
                const { category_id } = await db.getFirstAsync<{ category_id: number }>(
                    `SELECT category_id FROM category_visitor WHERE visitor_id = ?`,
                    [visitor.dni]
                ) as { category_id: number };

                const category = await db.getFirstAsync<Categoria>(
                    `SELECT * FROM category WHERE id = ?`,
                    [category_id]
                );

                if (category != null) {
                    visitor.category = category.name;

                    if (category.isExtern === 1) {
                        // Enterprise    
                        const empresa = await db.getFirstAsync<Empresa>(
                            `SELECT * FROM enterprice WHERE id = ?`,
                            [visitor.enterprice_id]
                        ) as Empresa;
                        if (empresa) {
                            visitor.empresa = empresa.name;
                            visitor.enterprice_cuit = empresa.cuit;
                        }

                        // Places
                        const places = await db.getAllAsync<Lugar>(
                            `SELECT name FROM place 
                            INNER JOIN category_place ON place.id = category_place.place_id
                            WHERE category_place.category_id = ?`,
                            [category_id]
                        ) as Lugar[];

                        visitor.places = places.map(place => place.name);
                    } else {
                        // Institutes
                        const categoryInstitutes = await db.getAllAsync<{ institute_id: number }>(
                            `SELECT institute_id FROM category_institute WHERE category_id = ?`,
                            [category_id]
                        ) as { institute_id: number }[];

                        const instituteIds = categoryInstitutes.map(institute => institute.institute_id);
                        if (instituteIds.length > 0) {
                            const instituteNames = await db.getAllAsync<{ name: string }>(
                                `SELECT name FROM institute WHERE id IN (${instituteIds.join(',')})`
                            ) as { name: string }[];

                            visitor.institutes = instituteNames.map(institute => institute.name);

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

                            visitor.places = placeNames.map(place => place.name);
                        }
                    }
                } else {
                    console.error(`Categoría no encontrada para category_id: ${category_id}`);
                }
            }

            console.log("visitor db",visitorsDB);

            const { status, data } = await syncVisitors(visitorsDB);
            if(status !== 201){
                console.log("Visitante data error extraida" ,data)
                await syncLog(1, 'visitantes');
            } 
        }

        const visitor_historyDB = await db.getAllAsync('SELECT * FROM visitor_history');
        if (visitor_historyDB && visitor_historyDB.length > 0) {
            console.log("Visitor_history fetch")
            const {status,data} =  await syncVisitor_history(visitor_historyDB)
            if(status !== 201){
                console.log("Visitor_history fetch 201")
                await syncLog(null, 'visitor_history');
            }else{
                console.log("Visitor history data error extraida" ,data)
                await syncLog(1, 'visitor_history');
            }  
        }   
        
        const user_historyDB = await db.getAllAsync('SELECT * FROM user_history');
        if (user_historyDB && user_historyDB.length > 0) {
            console.log("User_history fetch")
            const {status,data} =  await syncVisitor_history(user_historyDB)
            if(status !== 201){
                console.log("User history data error extraida" ,data)
                await syncLog(1, 'user_history');
            }
        }   

        const exceptionDB: Excepcion[] = await db.getAllAsync('SELECT * FROM exception');
        if (exceptionDB && exceptionDB.length > 0) {
            console.log("Exception fetch")
            for (const exception of exceptionDB) {
                const places = await db.getAllAsync<Lugar>(
                    `SELECT name 
                    FROM place 
                    WHERE id IN (
                        SELECT place_id 
                        FROM place_exception 
                        WHERE exception_id = ?
                    )`,
                    [exception.id]
                ) as Lugar[];
                const placeNames = places.map(place => place.name);
                exception.place_names = placeNames;

                const getCategory = await db.getAllAsync<Categoria>(
                    `SELECT name 
                    FROM Category 
                    WHERE id IN (
                        SELECT category_id 
                        FROM category_exception 
                        WHERE exception_id = ?
                    )`,
                    [exception.id]
                ) as Categoria[];
                
                const categoryName = getCategory.map(category => category.name);
                exception.category_name = categoryName[0];
            }

            console.log("exception db",exceptionDB);

            const {status,data} =  await syncExceptions(exceptionDB)
            if(status !== 201){
                console.log("Exception data error extraida" ,data)
                await syncLog(1, 'exception');
            } 
        }   

        // Logs
        const logsDB: Logs[] = await db.getAllAsync('SELECT * FROM logs')        
        if (logsDB && logsDB.length > 0) {
            console.log("Logs fetch")
            await syncLogs(logsDB)
        }
    }, [db]);

    return sync;
};

export default useSync;
