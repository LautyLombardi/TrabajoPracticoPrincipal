
import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from '@/context/SQLiteContext';
import { getAdmDni } from '@/api/services/storage';
import { Rol } from '@/api/model/interfaces';

function useGetRolByDni() {
    const db = useSQLiteContext();

    const roleIQuery = useQuery({
        queryKey: ['role_by_dni'],
        queryFn: async (): Promise<Rol> => {
            const admDNI = await getAdmDni();

            const result = await db.getFirstAsync<{
                role_id: number,
                role_name: string,
                role_description: string,
                roleCreateDate: string,
                routingConnection: number,
                onlineLogin: number,
                offlineLogin: number,
                dayStartEnd: number,
                visitorAuthentication: number,
                visitorAuthorization: number,
                instituteConfiguration: number,
                entityABMs: number,
                systemReports: number,
                systemLog: number,
                exceptionLoading: number
            }>(
                `SELECT 
                    r.id AS role_id,
                    r.name AS role_name,
                    r.description AS role_description,
                    r.createDate AS roleCreateDate,
                    r.routingConnection,
                    r.onlineLogin,
                    r.offlineLogin,
                    r.dayStartEnd,
                    r.visitorAuthentication,
                    r.visitorAuthorization,
                    r.instituteConfiguration,
                    r.entityABMs,
                    r.systemReports,
                    r.systemLog,
                    r.exceptionLoading
                FROM 
                    user u
                JOIN 
                    role r ON u.role_id = r.id
                WHERE 
                    u.dni = ?`,
                [admDNI]
            );

            if (!result) {
                throw new Error('No role found for the provided DNI');
            }

            const role: Rol = {
                id: result.role_id,
                name: result.role_name,
                description: result.role_description,
                createDate: result.roleCreateDate,
                routingConnection: result.routingConnection,
                onlineLogin: result.onlineLogin,
                offlineLogin: result.offlineLogin,
                dayStartEnd: result.dayStartEnd,
                visitorAuthentication: result.visitorAuthentication,
                visitorAuthorization: result.visitorAuthorization,
                instituteConfiguration: result.instituteConfiguration,
                entityABMs: result.entityABMs,
                systemReports: result.systemReports,
                systemLog: result.systemLog,
                exceptionLoading: result.exceptionLoading
            };

            console.log('role by dni', role);
            return role;
        },
    });

    console.log('roleIQuery.data', roleIQuery.data);
    
    return {
        role: roleIQuery.data,
        isLoading: roleIQuery.isLoading,
        isError: roleIQuery.isError,
        error: roleIQuery.error,  // Para acceder al error si ocurre
    };
}

export default useGetRolByDni;