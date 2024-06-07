import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite/next';

interface SQLiteProviderProps {
    children: ReactNode;
    databaseName: string;
}

const SQLiteContext = createContext<SQLiteDatabase | null>(null);

export const SQLiteProvider: React.FC<SQLiteProviderProps> = ({ children, databaseName }) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null);

    useEffect(() => {
        const initDb = async () => {
            const db = await openDatabaseAsync(databaseName);
            setDb(db);
        };

        initDb();
    }, [databaseName]);

    if (!db) {
        return null; // Or a loading indicator
    }

    return (
        <SQLiteContext.Provider value={db}>
            {children}
        </SQLiteContext.Provider>
    );
};

export const useSQLiteContext = () => {
    const context = useContext(SQLiteContext);
    if (!context) {
        throw new Error("useSQLiteContext must be used within a <SQLiteProvider>");
    }
    return context;
};