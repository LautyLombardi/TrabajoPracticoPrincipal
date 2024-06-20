import { Lugar } from "@/api/model/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useSQLiteContext } from "@/context/SQLiteContext"
import { isLoading } from "expo-font";


const useGetPlace=(id:number)=>{
    const db = useSQLiteContext();
    console.log('get place by id', id)
    const placeQuery = useQuery<Lugar>({
        queryKey:["places"],
        queryFn: async (): Promise<Lugar> =>{
            const place = await db.getFirstAsync<Lugar>(
                'SELECT * FROM place WHERE id = ?',
                [id]
            );
            if (!place){
                throw new Error ("place not found")
            }
            console.log("place in hook:",place)
            return place
        }
    })
    return {
        place:placeQuery.data,
        isLoading:placeQuery.isLoading,
        isError:placeQuery.isError,
    }
}

export default useGetPlace