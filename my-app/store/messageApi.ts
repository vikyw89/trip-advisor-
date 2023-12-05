import { supabase } from "@/libs/supabase";
import { emptySplitApi } from "./emptySplitApi";
import { serverApi } from "@/libs/server";


const messageApi = emptySplitApi.injectEndpoints({
    // @ts-ignore
    overrideExisting: module.hot?.status() === 'apply',
    endpoints: (builder) => ({
        sendMessage: builder.mutation<any, {text: string, file?: File}>({
            queryFn: async ({text, file}) => {
                try {
                    const session = await supabase.auth.getSession();

                    if (!session.data.session?.user?.id) {
                        throw new Error('Session expired');
                    }

                    // if there's a file
                    let fileUrl 
                    if (file){
                        const fileUploadRes = await supabase.storage.from("files").upload(`${session.data.session?.user?.id}/${Date.now().toString()}`, file)
                        fileUrl = supabase.storage.from("files").getPublicUrl(`${session.data.session?.user?.id}/${Date.now().toString()}`).data.publicUrl
                    }

                    const res = await serverApi.POST("/users/{user_id}/messages",{
                        params:{
                          path:{
                            user_id: session.data.session?.user?.id
                          }  
                        },
                        body:{
                            text: text,
                            file_url: fileUrl
                        }
                    })

                    if (res.error) {
                        throw new Error(res.error.detail?.[0].msg || 'Failed to send message');
                    }
                    return { data: res.data };
                } catch (error) {
                    return {
                        error,
                    };
                }
            },
        }),
    }),
})

export const {useSendMessageMutation} = messageApi