import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';

const useProcessEntryLogs = () => {
    const db = useSQLiteContext();

    const processEntryLogs = useCallback(async () => {
        try {
            // Obtener todos los logs de ingreso de usuarios con isEnter = 1 y userId no nulo
            const userEntryLogsQuery = `
                SELECT * FROM logs
                WHERE userId IS NOT NULL
                AND isEnter = 1;
            `;
            const userEntryLogs = await db.getAllAsync<Logs>(userEntryLogsQuery, []);

            // Obtener todos los logs de ingreso de visitantes con isEnter = 1 y visitorId no nulo
            const visitorEntryLogsQuery = `
                SELECT * FROM logs
                WHERE visitorId IS NOT NULL
                AND isEnter = 1;
            `;
            const visitorEntryLogs = await db.getAllAsync<Logs>(visitorEntryLogsQuery, []);

            let processedLogsCount = 0;

            // Función para procesar logs de ingreso y crear logs de salida si es necesario
            const processEntryLogsForType = async (logs: Logs[], entityType: 'user' | 'visitor') => {
                for (const log of logs) {
                    // Verificar si ya existe un log de salida para el mismo usuario/visitante con isEnter = 0
                    const entityId = entityType === 'user' ? log.userId : log.visitorId;
                    const checkExitLogQuery = `
                        SELECT * FROM logs
                        WHERE ${entityType === 'user' ? 'userId' : 'visitorId'} = ?
                        AND isEnter = 0
                        ORDER BY createDate DESC
                        LIMIT 1;
                    `;
                    const existingExitLog = await db.getFirstAsync<Logs>(checkExitLogQuery, [entityId]);

                    if (!existingExitLog || new Date(existingExitLog.createDate) < new Date(log.createDate)) {
                        // No existe un log de salida o el último log de salida es anterior al ingreso actual, crear uno nuevo
                        const createDate = new Date().toISOString();
                        const newExitLogResult = await db.runAsync(
                            `INSERT INTO logs (${entityType === 'user' ? 'userId' : 'visitorId'}, admDni, hasAccess, isFaceRecognition, description, createDate, isEnter) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                            [entityId, log.admDni, log.hasAccess, log.isFaceRecognition, `Nuevo log de salida creado automáticamente para ${entityType}`, createDate, 0]
                        );

                        console.log(`Created new exit log for ${entityType} with ID: ${newExitLogResult.lastInsertRowId}`);
                        processedLogsCount++;
                    } else {
                        console.log(`Existing exit log found for ${entityType}: ${entityId}`);
                    }
                }
            };

            // Procesar logs de ingreso para usuarios
            await processEntryLogsForType(userEntryLogs, 'user');
            
            // Procesar logs de ingreso para visitantes
            await processEntryLogsForType(visitorEntryLogs, 'visitor');

            console.log(`Processed ${processedLogsCount} entry logs.`);
            return processedLogsCount;
        } catch (error) {
            console.error('Error processing entry logs:', error);
            return 0;
        }
    }, [db]);

    return processEntryLogs;
};

export default useProcessEntryLogs;
