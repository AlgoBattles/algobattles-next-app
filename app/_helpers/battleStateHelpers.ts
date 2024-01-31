import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import type { Battle } from "../_types/battleTypes";
import type { User } from "../_types/userTypes";

const supabase = createClientComponentClient();

export async function pullBattleStateFromDB(
  user: User,
  battle: Battle,
  setBattle: (battle: Battle) => void,
  battleId: number,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("battle_state")
    .select()
    .eq("id", battleId);
  if (data !== null && data.length >= 1) {
    const dbResult = data[0];
    if (dbResult.user1_id === user.UID) {
      setBattle({
        ...battle,
        battleId: dbResult.id,
        algoId: dbResult.algo_id,
        algoPrompt: dbResult.algo_prompt,
        funcName: dbResult.func_name,
        templateCodeJS: dbResult.template_code_js,
        templateCodePython: dbResult.template_code_python,
        testCasesObj: dbResult.test_cases_json,
        userRole: "p1",
        userId: dbResult.user1_id,
        opponentId: dbResult.user2_id,
        userCode: dbResult.user1_code,
        opponentCode: dbResult.user2_code,
        userProgress: dbResult.user1_progress,
        opponentProgress: dbResult.user2_progress,
        userResults: dbResult.user1_results,
        opponentResults: dbResult.user2_results,
        gameOver: dbResult.battle_active === false,
        userWon: dbResult.battle_winner === user.UID,
      });
    } else if (dbResult.user2_id === user.UID) {
      setBattle({
        ...battle,
        battleId: dbResult.id,
        algoId: dbResult.algo_id,
        algoPrompt: dbResult.algo_prompt,
        funcName: dbResult.func_name,
        templateCodeJS: dbResult.template_code_js,
        templateCodePython: dbResult.template_code_python,
        testCasesObj: dbResult.test_cases_json,
        userRole: "p2",
        userId: dbResult.user2_id,
        opponentId: dbResult.user1_id,
        userCode: dbResult.user2_code,
        opponentCode: dbResult.user1_code,
        userProgress: dbResult.user2_progress,
        opponentProgress: dbResult.user1_progress,
        userResults: dbResult.user2_results,
        opponentResults: dbResult.user1_results,
        gameOver: dbResult.battle_active === false,
        userWon: dbResult.battle_winner === user.UID,
      });
    }
    return true;
  } else if (error !== null) {
    console.log(error);
    return false;
  }
  return false;
}
