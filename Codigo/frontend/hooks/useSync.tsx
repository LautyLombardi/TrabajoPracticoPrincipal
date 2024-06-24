import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Categoria, Empresa, Instituto, Logs, Lugar, Usuario, Visitante } from '@/api/model/interfaces';
import { syncEnterprice, syncLogs, syncUser, syncPlace,syncInstitute, syncCategories,syncVisitors } from '@/api/services/syncService';

const useSync = () => {
    const db = useSQLiteContext();

    const sync = useCallback(async () => {
        console.log('realizando sincronizacion');
        const logId = await AsyncStorage.getItem('logId');
        const logsDB: Logs[] = await db.getAllAsync(
            'SELECT * FROM logs WHERE id > ?',
            [logId || 0]
        );
        if (logsDB && logsDB.length > 0) {
            const {status,data} =  await syncLogs(logsDB)
            if(status === 201){
                // TODO LOGS
                const lastLog = logsDB[logsDB.length - 1];
                await AsyncStorage.setItem('logId', lastLog.id.toString());
            }else{
                // TODO LOGS
            }  
        }

        const userId = await AsyncStorage.getItem('userSync');
        const userDB: Usuario[] = await db.getAllAsync(
            'SELECT * FROM user WHERE dni > ?',
            [userId || 0]
        );
        if (userDB && userDB.length > 0) {
            const {status,data} =  await syncUser(userDB)
            if(status === 201){
                // TODO LOGS
                const lastUser = userDB[userDB.length - 1];
                await AsyncStorage.setItem('userId', lastUser.dni.toString());
            }else{
                // TODO LOGS   
            }  
        }

        const enterpriceId = await AsyncStorage.getItem('enterpriceSync');
        const entepriceDB: Empresa[] = await db.getAllAsync(
            'SELECT * FROM enterprice WHERE id > ?',
            [enterpriceId || 0]
        );
        if (entepriceDB && entepriceDB.length > 0) {
            const {status,data} =  await syncEnterprice(entepriceDB)
            if(status === 201){
                // TODO LOGS
                const lastEnterprice = entepriceDB[entepriceDB.length - 1];
                await AsyncStorage.setItem('enterpriceId', lastEnterprice.id.toString());
            }else{
                // TODO LOGS
            }  
        }   
        
        
        const placeId = await AsyncStorage.getItem('placeSync');
        const placeDB: Lugar[] = await db.getAllAsync(
            'SELECT * FROM place WHERE id > ?',
            [placeId || 0]
        );
        if (placeDB && placeDB.length > 0) {
            const {status,data} =  await syncPlace(placeDB)
            if(status === 201){
                // TODO LOGS
                const lastPlace = placeDB[placeDB.length - 1];
                await AsyncStorage.setItem('placeId', lastPlace.id.toString());
            }else{
                // TODO LOGS
            }  
        } 

        const instituteId = await AsyncStorage.getItem('instituteSync');
        const instituteDB: Instituto[] = await db.getAllAsync(
            'SELECT * FROM institute WHERE id > ?',
            [instituteId || 0]
        );
        if (instituteDB && instituteDB.length > 0) {
            const {status,data} =  await syncInstitute(instituteDB)
            if(status === 201){
                // TODO LOGS
                const lastInstitute = instituteDB[instituteDB.length - 1];
                await AsyncStorage.setItem('instituteId', lastInstitute.id.toString());
            }else{
                // TODO LOGS
            }  
        }   
        
        await AsyncStorage.removeItem('categorySync')
        const categoryId = await AsyncStorage.getItem('categorySync');
        const categoriesDB: Categoria[] = await db.getAllAsync(
            'SELECT * FROM category WHERE id > ?',
            [categoryId || 0]
        );
        if (categoriesDB && categoriesDB.length > 0) {
            const {status,data} =  await syncCategories(categoriesDB)
            if(status === 201){
                // TODO LOGS
                console.log("entro 201 category")
                const lastCategory = categoriesDB[categoriesDB.length - 1];
                await AsyncStorage.setItem('categoryId', lastCategory.id.toString());
            }else{
                // TODO LOGS
                console.log("data extraida" ,data)
            }  
        }  

        await AsyncStorage.removeItem('visitorSync');
        await AsyncStorage.removeItem('visitorSync');
        const visitorId = await AsyncStorage.getItem('visitorSync');
        const visitorsDB: Visitante[] = await db.getAllAsync(
            'SELECT * FROM visitor WHERE dni > ?',
            [visitorId || 0]
        );

        if (visitorsDB && visitorsDB.length > 0) {
            console.log("Prefetch");
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
            console.log("Posfetch");

            if (status === 201) {
                // Si la sincronización fue exitosa, actualizar el último visitorId sincronizado
                const lastVisitor = visitorsDB[visitorsDB.length - 1];
                await AsyncStorage.setItem('visitorSync', lastVisitor.dni.toString());
            } else {
                // En caso de error, loguear los datos de error
                console.log("Data extraída", data);
            }
        } else {
            console.log("No hay visitantes nuevos para sincronizar.");
        }  

    }, [db]);

    return sync;
};

export default useSync;
