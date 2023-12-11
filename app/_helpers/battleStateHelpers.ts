import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Battle } from '../_types/battleTypes'
import { User } from '../_types/userTypes'

const supabase = createClientComponentClient()

export async function pullBattleStateFromDB(user: User, battle: Battle, setBattle: (battle: Battle) => void, battleId: number) {
    const { data, error } = await supabase
        .from('battle_state')
        .select()
        .eq('id', battleId);

    if (data && data.length >= 1) { 
        const dbResult = data[0]
        if (dbResult.user1_id === user.UID) {
            setBattle(({
                ...battle,
                battleId: dbResult.id,
                algoId: dbResult.algo_id,
                algoPrompt: dbResult.algo_prompt,
                funcName: dbResult.func_name,
                templateCode: dbResult.template_code,
                testCasesObj: dbResult.test_cases_json,
                userRole: 'p1',
                userId: dbResult.user1_id,
                opponentId: dbResult.user2_id,
                userCode: dbResult.user1_code,
                opponentCode: dbResult.user2_code,
                userProgress: dbResult.user1_progress,
                opponentProgress: dbResult.user2_progress,
                userResults: dbResult.user1_results,
                opponentResults: dbResult.user2_results,
                gameOver: dbResult.battle_active ? false : true,
                userWon: dbResult.battle_winner === user.UID ? true : false
              }));
        }
        else if (dbResult.user2_id === user.UID) {
            setBattle(({
                ...battle,
                battleId: dbResult.id,
                algoId: dbResult.algo_id,
                algoPrompt: dbResult.algo_prompt,
                funcName: dbResult.func_name,
                templateCode: dbResult.template_code,
                testCasesObj: dbResult.test_cases_json,
                userRole: 'p2',
                userId: dbResult.user2_id,
                opponentId: dbResult.user1_id,
                userCode: dbResult.user2_code,
                opponentCode: dbResult.user1_code,
                userProgress: dbResult.user2_progress,
                opponentProgress: dbResult.user1_progress,
                userResults: dbResult.user2_results,
                opponentResults: dbResult.user1_results,
                gameOver: dbResult.battle_active ? false : true,
                userWon: dbResult.battle_winner === user.UID ? true : false
              }));
        }
        return true
        }
    else if (error) {
    console.log(error)
    return false
    }
  }
  
export async function pushBattleStateToDB(user, battle) {
    if (battle.userRole === 'p1') {
        const { data, error } = await supabase
            .from('battle_state')
            .update({
                user1_code: battle.userCode,
                user1_progress: battle.userProgress,
                user1_results: battle.userResults,
            })
            .eq('user1_id', user.UID)
            if (data && data.length >= 1) {
                return true
            }
            else {
                return false
            }
    }
    else if (battle.userRole === 'p2') {
        const { data, error } = await supabase
            .from('battle_state')
            .update({
                user2_code: battle.userCode,
                user2_progress: battle.userProgress,
                user2_results: battle.userResults,
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

