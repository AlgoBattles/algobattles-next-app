"use client";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { IconButton, Tooltip } from "@mui/material";
import { Replay, PlayArrow } from "@mui/icons-material";
import { useUser } from "../_contexts/UserContext";
import { useBattle } from "../_contexts/BattleContext";
import type { TestCase } from "../_types/battleTypes";

interface AceEditorProps {
  sendCode: (message: string) => void;
}

const AceEditor = ({ sendCode }: AceEditorProps): React.ReactElement => {
  const { user } = useUser();
  const { battle, setBattle } = useBattle();
  const ace = require("ace-builds/src-noconflict/ace");
  const serverURL = process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "https://algobattles-socketio.onrender.com";

  // console.log("endpoint set to" + serverURL);
  const {
    templateCodeJS,
    templateCodePython,
    testCasesObj,
    userCode,
    userProgress,
  } = battle;

  const editor1Ref = useRef<HTMLDivElement | null>(null);
  const [testCasesArray, setTestCasesArray] = useState<any[][] | null>(null);

  // formats test cases for execution engine compatibility
  const formatTestCases = (data: Record<string, TestCase>) => {
    // console.log('raw test cases are')
    // console.log(data)
    const result = Object.values(data).map((testCase) => {
      const inputValues = [];
      for (const variable in testCase.input) {
        inputValues.push(testCase.input[variable]);
      }
      const expectedOutput = testCase.output.expected;
      return [inputValues, expectedOutput];
    });
    // console.log('formatted cases are')
    // console.log(result)
    return result;
  };

  const resetCode = (): void => {
    const editor = ace.edit(editor1Ref.current);
    if (user.preferredLanguage === "javascript") {
      sendCode(battle.templateCodeJS);
      editor.setValue(battle.templateCodeJS);
    } else {
      sendCode(battle.templateCodePython);
      editor.setValue(battle.templateCodePython);
    }
  };

  const runCode = async (): Promise<void> => {
    const authKey = process.env.NEXT_PUBLIC_ENGINE_AUTH_KEY;
    console.log(authKey);
    if (authKey === "" || authKey === undefined) {
      throw new Error("ENGINE_AUTH_KEY is not defined");
    }
    const result = await fetch(`${serverURL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authKey,
      },
      body: JSON.stringify({
        code: userCode,
        testCases: JSON.stringify(testCasesArray),
        funcName: battle.funcName,
        language: user.preferredLanguage,
        battleId: battle.battleId,
        userNumber: battle.userRole,
        userId: user.UID,
      }),
    });
    const data = await result.json();
    // console.log(data);
    // if no errors, update test case results in state
    if (data.run.code === 0) {
      // check for game over
      if (data.progress < 100) {
        const results = data.run.output.map((item: any, index: number) => {
          return item[0];
        });
        console.log(data);
        setBattle((prevBattle) => ({
          ...prevBattle,
          userResults: results,
          userProgress: data.progress,
          testOutput: data.run.stderr,
        }));
      } else if (data.progress === 100) {
        const results = data.run.output.map((item: any, index: number) => {
          return item[0];
        });
        setBattle((prevBattle) => ({
          ...prevBattle,
          gameOver: true,
          userWon: true,
          battleuserResults: results,
          userProgress: data.progress,
          testOutput: data.run.stderr,
        }));
      }
    } else if (data.run.code === 1) {
      // sets error in state to display in console
      const results = null;
      // console.log(data);
      setBattle((prevBattle) => ({
        ...prevBattle,
        userResults: results,
        userProgress: 0,
        testOutput: data.run.stderr,
      }));
    }
  };

  useEffect(() => {
    // configure editor
    require("ace-builds/src-noconflict/theme-chaos");
    require("ace-builds/src-noconflict/mode-javascript");
    require("ace-builds/src-noconflict/mode-python");
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme("ace/theme/chaos");
    if (user.preferredLanguage === "python") {
      editor1.session.setMode("ace/mode/python");
      userCode === "" || userCode === "null" || userCode === null
        ? editor1.setValue(`${templateCodePython}`)
        : editor1.setValue(`${userCode}`);
    } else if (user.preferredLanguage === "javascript") {
      editor1.session.setMode("ace/mode/javascript");
      if (userCode === "" || userCode === null || userCode === "null") {
        editor1.setValue(`${templateCodeJS}`);
      } else {
        editor1.setValue(`${userCode}`);
      }
      // userCode === '' || userCode === 'null' || userCode === null
      //   ? editor1.setValue(`${templateCodeJS}`)
      //   : editor1.setValue(`${userCode}`)
    }
    editor1.setOptions({
      fontSize: "10pt",
    });
    // event listener for the change event
    editor1.on("change", function (): void {
      const code = editor1.getValue();
      setBattle((prevBattle) => ({ ...prevBattle, userCode: `${code}` }));
    });
  }, [templateCodeJS]);

  useEffect(() => {
    // formats test cases upon mounting
    if (testCasesArray === null && testCasesObj !== null) {
      setTestCasesArray(formatTestCases(testCasesObj));
    }
  }, [testCasesObj]);

  return (
    <div className="w-full h-full flex flex-col border border-blue-700 rounded-[3px]">
      <div className="flex flex-row w-full rounded-[3px] bg-black justify-between">
        <div>
          <Tooltip title="Execute Code" enterDelay={100} leaveDelay={50}>
            <IconButton
              aria-label="execute code"
              sx={{
                height: 32, // equivalent to h-8 in Tailwind CSS
                width: 32, // equivalent to w-8 in Tailwind CSS
                borderRadius: 1, // This applies a moderate border-radius. Adjust as needed.
                backgroundColor: "#1976d2 !important", // Directly using a hex color for background
                color: "#ffffff", // Setting the text color using hex
                "&:hover": {
                  backgroundColor: "#1565c0 !important", // Darken the background color on hover using a hex color
                },
                margin: 1, // equivalent to m-2 in Tailwind CSS (MUI theme spacing may vary)
              }}
              onClick={() => {
                runCode().catch(console.error);
              }}
            >
              <PlayArrow style={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Code" enterDelay={100} leaveDelay={50}>
            <IconButton
              aria-label="reset code"
              sx={{
                height: 32, // equivalent to h-8 in Tailwind CSS
                width: 32, // equivalent to w-8 in Tailwind CSS
                backgroundColor: "#000000", // black background
                borderRadius: "10%", // fully rounded
                "&:hover": {
                  backgroundColor: "#424242", // gray-700 on hover
                },
                color: "#ffffff", // text (icon) color white
              }}
              onClick={() => {
                resetCode();
              }}
            >
              <Replay />
            </IconButton>
          </Tooltip>
        </div>
        <ProgressBar percentage={userProgress} />
      </div>
      <div
        id="editor1"
        ref={editor1Ref}
        className="w-full flex-grow rounded-[3px]"
      />
    </div>
  );
};

export default AceEditor;
