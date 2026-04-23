import { createClient } from "@supabase/supabase-js"

export default defineNuxtRouteMiddleware(async (to, from) => {
    const runtimeConfig = useRuntimeConfig()
    const supabase = createClient(runtimeConfig.public.SUPABASE_URL, runtimeConfig.public.SUPABASE_KEY)
    const { data } = await supabase.auth.getUser()
    console.log(data, data?.user?.role, data?.user?.role === "authenticated")
    if(data?.user?.role === "authenticated")
        return
    else 
        return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
})