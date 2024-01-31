export interface TestCase {
  input: Record<string, any>;
  output: Record<string, any>;
}

export interface Result extends Record<string, any> {}

export interface Battle {
  battleId: number;
  algoId: number;
  algoPrompt: string;
  funcName: string;
  templateCodeJS: string;
  templateCodePython: string;
  testCasesObj: Record<string, TestCase> | null;
  userRole: string;
  userId: string;
  opponentId: string;
  userCode: string;
  opponentCode: string;
  userResults: Result[] | null;
  testOutput: string | null;
  opponentResults: Result[] | null;
  userProgress: number;
  opponentProgress: number;
  gameOver: boolean;
  userWon: boolean | null;
}
