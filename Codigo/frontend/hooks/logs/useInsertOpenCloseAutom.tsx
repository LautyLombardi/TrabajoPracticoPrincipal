import { useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { useCallback } from 'react';

// Utility function to format date as YYYY-MM-DD HH:MM:SS
const formatDateTime = (date: Date) => {
    const pad = (n: number) => n < 10 ? `0${n}` : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const useInsertOpenCloseAutom = () => {
    const db = useSQLiteContext();

    const insertOpenCloseAutom = useCallback(async (openHour: string, closeHour: string, isOpen: boolean) => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        
        // Parse open and close hours
        const [openHourHours, openHourMinutes] = openHour.split(':').map(Number);
        const [closeHourHours, closeHourMinutes] = closeHour.split(':').map(Number);

        let createDate;

        if (isOpen) {
            // Create date for opening (today at openHour)
            const openDate = new Date(now.setHours(openHourHours, openHourMinutes, 0, 0));
            createDate = formatDateTime(openDate);
        } else {
            // Create date for closing (today at closeHour)
            const closeDate = new Date(now.setHours(closeHourHours, closeHourMinutes, 0, 0));
            if (now.getHours() < openHourHours) {
                // If current hour is less than open hour, the close time was yesterday
                closeDate.setDate(closeDate.getDate() - 1);
            }
            createDate = formatDateTime(closeDate);
        }

        try {
            await db.execAsync('BEGIN TRANSACTION;');

            const result = await db.runAsync(
                `INSERT INTO logs (aperturaCierre, description, createDate, isAutomatic) VALUES (?, ?, ?,1);`,
                [
                    isOpen ? 'Apertura' : 'Cierre',
                    isOpen ? 'Registro de apertura del día automatico' : 'Registro del cierre del día automatico',
                    createDate
                ]
            );

            await db.execAsync('COMMIT;');

            console.log('Log automatic opening/closing inserted with ID:', result.lastInsertRowId);
            return result.lastInsertRowId;
        } catch (error) {
            await db.execAsync('ROLLBACK;');
            console.error('Error inserting log automatic opening/closing:', error);
            return 0;
        }
    }, [db]);

    return insertOpenCloseAutom;
};

export default useInsertOpenCloseAutom;
