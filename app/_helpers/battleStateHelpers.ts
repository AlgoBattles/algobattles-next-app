import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

export async function pullBattleStateFromDB(user, battle, setBattle) {
    console.log('setting battle')
    // console.log('battle', battle)
    const { data, error } = await supabase
        .from('battle_state')
        .select()
        .or(`user1_id.eq.${user.UID},user2_id.eq.${user.UID}`);
    console.log(data)
    if (data && data.length >= 1) {

        console.log('setting battle state', data)
        const dbResult = data[0]
        if (dbResult.user1_id === user.UID) {
            console.log ('user is leader')
            setBattle(({
                ...battle,
                algoId: dbResult.algo_id,
                algoPrompt: dbResult.algo_prompt,
                funcName: dbResult.func_name,
                templateCode: dbResult.template_code,
                testCasesObj: dbResult.test_cases_json,
                userRole: 'leader',
                userId: dbResult.user1_id,
                opponentId: dbResult.user2_id,
                userCode: dbResult.user1_code,
                opponentCode: dbResult.user2_code,
                userProgress: dbResult.user1_progress,
                opponentProgress: dbResult.user2_progress,
                gameStatus: dbResult.game_status,
              }));
        }
        else if (dbResult.user2_id === user.UID) {
            console.log ('user is follower')
            setBattle(({
                ...battle,
                algoId: dbResult.algo_id,
                algoPrompt: dbResult.algo_prompt,
                funcName: dbResult.func_name,
                templateCode: dbResult.template_code,
                testCasesObj: dbResult.test_cases_json,
                userRole: 'follower',
                userId: dbResult.user2_id,
                opponentId: dbResult.user1_id,
                userCode: dbResult.user2_code,
                opponentCode: dbResult.user1_code,
                userProgress: dbResult.user2_progress,
                opponentProgress: dbResult.user1_progress,
                gameStatus: dbResult.game_status,
              }));
        }
        return true
        }
    else if (error) {
    console.log(error)
    return false
    }
  }

  
export async function pushBattleStateToDB(user, battle, setBattle) {
    if (battle.userRole === 'leader') {
        const { data, error } = await supabase
            .from('battle_state')
            .update({
                user1_code: battle.userCode,
                user1_progress: battle.userProgress,
            })
            .eq('user1_id', user.UID)
            if (data && data.length >= 1) {
                return true
            }
            else {
                return false
            }
    }
    else if (battle.userRole === 'follower') {
        const { data, error } = await supabase
            .from('battle_state')
            .update({
                user2_code: battle.userCode,
                user2_progress: battle.userProgress,
            }) 
            .eq('user2_id', user.UID)
        if (data && data.length >= 1) {
            return true
        }
        else {
            return false
        }
    }
}

