import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export async function getUserInfo (userId: string): Promise<any> {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select()
    .eq('user_id', userId)
  if (userData !== null && userData.length >= 1) {
    console.log('user data is: ' + userData[0])
    return userData[0]
  } else if (userError !== null) {
    console.log('error retrieving user data')
    console.log(userError)
  }
}
