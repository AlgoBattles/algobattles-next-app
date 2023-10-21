import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const fetchUserInfo = async () => {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
        .from('users')
        .select()
    return data;
}

export default fetchUserInfo