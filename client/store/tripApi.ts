import { supabase } from "@/libs/supabase";
import { emptySplitApi } from "./emptySplitApi";
import { serverApi } from "@/libs/server";

const tripApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        createTrip: builder.mutation<{tripId:string}, any>({
            queryFn: async () => {
                try {
                    const session = await supabase.auth.getSession()
    
                    if (session.error || !session.data.session?.user?.id) {
                        throw new Error('Session expired');
                    }
                    
                    const res = await serverApi.POST("/users/{user_id}/trips",{
                        params:{
                            path:{
                                user_id: session.data.session?.user?.id
                            }
                        }
                    })

                    if (res.error){
                        throw new Error('Failed to create trip');
                    }

                    return {data:{
                        tripId:res.data.tripId
                    }}
                } catch (error){
                    return {error}
                }
            }
        })
    })
})

export const {useCreateTripMutation} = tripApi