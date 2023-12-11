import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export async function getUserInfo(userId: string) {
    
    const { data: userData, error: userError } = await supabase
            .from('users')
            .select()
            .eq('user_id', userId)
        if (userData && userData.length >= 1) {
            console .log('user data is: ' + userData[0])
            return userData[0]
        }
        else if (userError) {
            console.log('error retrieving user data')
            console.log(userError)
            return
        }
}