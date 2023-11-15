export type TestCase = {
    input: {
      [key: string]: any;
    };
    output: {
      [key: string]: any;
    };
  };

export type Result = {
      [key: string]: any;
};

export interface Battle {
  battleId: number;
  algoId: number;
  algoPrompt: string;
  funcName: string;
  templateCode: string;
  testCasesObj: { [key: string]: TestCase } | null;
  userRole: string;
  userId: string;
  opponentId: string;
  userCode: string;
  opponentCode: string;
  userResults: Result[] | null;
  opponentResults: Result[] | null;
  userProgress: number;
  opponentProgress: number;
  gameOver: boolean;
}