import { useCallback } from 'react';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { Logs } from '@/api/model/interfaces';
import { getCurrentCreateDate } from '@/util/getCreateDate';

const useProcessEntryLogs = () => {
    const db = useSQLiteContext();

    const processEntryLogs = useCallback(async () => {
        try {
            const userEntryLogsQuery = `
                SELECT * FROM logs
                WHERE userId IS NOT NULL
                AND isEnter = 1;
            `;
            const userEntryLogs = await db.getAllAsync<Logs>(userEntryLogsQuery, []);

            const visitorEntryLogsQuery = `
                SELECT * FROM logs
                WHERE visitorId IS NOT NULL
                AND isEnter = 1;
            `;
            const visitorEntryLogs = await db.getAllAsync<Logs>(visitorEntryLogsQuery, []);

            let processedLogsCount = 0;


            const processEntryLogsForType = async (logs: Logs[], entityType: 'user' | 'visitor') => {
                for (const log of logs) {
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
                        const createDate = getCurrentCreateDate();
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

            await processEntryLogsForType(userEntryLogs, 'user');
            
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
