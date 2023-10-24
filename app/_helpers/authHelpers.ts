import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export async function checkAuthStatus(user, setUser) {
    const userAuthInfo = await supabase.auth.getUser();
    if (userAuthInfo.data.user) {
      // console.log('User is signed in:', userAuthInfo.data.user);
      if (userAuthInfo.data.user.id) {
        setUser(({ ...user, UID: userAuthInfo.data.user.id }));
        return true 
      }
    } else {
      return false
    }
  }

export async function retrieveUserInfo(user, setUser) {
    // console.log('hitting retrieve user info')
    // console.log('user is', user)
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('user_id', user.UID)
    console.log(data)
    if (data && data.length >= 1) {
        // console.log('setting user state')
        setUser(({ ...user, email: data[0].email, avatar: data[0].avatar, username: data[0].username, preferredLanguage: data[0].preferredLanguage, UID: data[0].user_id }));
    }
    else if (error) {
    console.log(error)
    return false
    }
  }

