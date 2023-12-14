import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '../_types/userTypes'

const supabase = createClientComponentClient()

export async function checkAuthStatus (user: User, setUser: (user: User) => void): Promise<boolean> {
  const userAuthInfo = await supabase.auth.getUser();
  if (userAuthInfo?.data?.user?.id && userAuthInfo?.data?.user?.email) {
    setUser(({ ...user, UID: userAuthInfo.data.user.id, email: userAuthInfo.data.user.email  }));
    return true
  } else {
    return false
  }
}

export async function retrieveUserInfo(user: User, setUser: (user: User) => void ) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('user_id', user.UID)
  if (data && data.length >= 1) {
    setUser(({ ...user, email: data[0].email, avatar: data[0].avatar, username: data[0].username, preferredLanguage: data[0].preferredLanguage, UID: data[0].user_id }));
  }
  else if (error) {
  console.log(error)
  return false
  }
}

