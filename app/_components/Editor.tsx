'use client'
import React, { useEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar'
import { IconButton, Tooltip } from '@mui/material'
import { Replay, PlayArrow } from '@mui/icons-material'
import { useUser } from '../_contexts/UserContext'
import { useBattle } from '../_contexts/BattleContext'
import type { TestCase } from '../_types/battleTypes'


interface AceEditorProps {
  sendCode: (message: string) => void
};

const AceEditor = ({ sendCode }: AceEditorProps): React.ReactElement => {
  const { user } = useUser()
  const { battle, setBattle } = useBattle()
  const ace = require('ace-builds/src-noconflict/ace');

  const {
    templateCodeJS,
    templateCodePython,
    testCasesObj,
    userCode,
    userProgress
  } = battle

  const editor1Ref = useRef<HTMLDivElement | null>(null);
  const [testCasesArray, setTestCasesArray] = useState<any[][] | null>(null)

  // formats test cases for execution engine compatibility
  const formatTestCases = (data: { [key: string]: TestCase }) => { 
    // console.log('raw test cases are')
    // console.log(data)
    const result = Object.values(data).map(testCase => {
      const inputValues = []
      for (const variable in testCase.input) {
        inputValues.push(testCase.input[variable])
      }
      const expectedOutput = testCase.output.expected;
      return [inputValues, expectedOutput];
    })
    // console.log('formatted cases are')
    // console.log(result)
    return result
  }

  const resetCode = (): void => {
    const editor = ace.edit(editor1Ref.current);
    if (user.preferredLanguage === 'javascript') {
      sendCode(battle.templateCodeJS)
      editor.setValue(battle.templateCodeJS)
    } else {
      sendCode(battle.templateCodePython)
      editor.setValue(battle.templateCodePython)
    }
  }

  const runCode = async (): Promise<void> => {
    const result = await fetch('http://localhost:8081/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: userCode,
        testCases: JSON.stringify(testCasesArray),
        funcName: battle.funcName,
        language: user.preferredLanguage,
        battleId: battle.battleId,
        userNumber: battle.userRole,
        userId: user.UID
      })
    })
    const data = await result.json()
    // if no errors, update test case results in state
    if (data.run.code === 0) {
      // check for game over
      if (data.progress < 100) {
        const output = JSON.parse(data.run.output.replace(/'/g, '"').replace(/undefined/g, 'null'))
        const results = output.map((item: any, index: number) => {
          return item[0]
        })
        setBattle(prevBattle => ({
          ...prevBattle,
          userResults: results,
          userProgress: data.progress,
          testOutput: data.run.stdout
        }))
      } else if (data.progress === 100) {
        const output = JSON.parse(data.run.output.replace(/'/g, '"').replace(/undefined/g, 'null'))
        const results = output.map((item: any, index: number) => {
          return item[0]
        })
        setBattle(prevBattle => ({
          ...prevBattle,
          gameOver: true,
          userWon: true,
          battleuserResults: results,
          userProgress: data.progress,
          testOutput: output[0][0] !== null && output[0][0] !== undefined ? output[0][0].toString() : undefined
        }))
      }
    } else if (data.run.code === 1) {
      // sets error in state to display in console
      const results = null
      setBattle(prevBattle => ({ ...prevBattle, userResults: results, userProgress: 0, testOutput: data.run.stderr }))
    }
  }

  useEffect(() => {
    // configure editor
    require('ace-builds/src-noconflict/theme-chaos');
    require('ace-builds/src-noconflict/mode-javascript');
    require('ace-builds/src-noconflict/mode-python')
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme('ace/theme/chaos');
    if (user.preferredLanguage === 'python') {
      editor1.session.setMode('ace/mode/python');
      userCode === '' || userCode === 'null' || userCode === null
        ? editor1.setValue(`${templateCodePython}`)
        : editor1.setValue(`${userCode}`);
    } else if (user.preferredLanguage === 'javascript') {
      editor1.session.setMode('ace/mode/javascript')
      if (userCode === '' || userCode === null || userCode === 'null') {
        editor1.setValue(`${templateCodeJS}`)
      } else {
        editor1.setValue(`${userCode}`)
      }
      // userCode === '' || userCode === 'null' || userCode === null
      //   ? editor1.setValue(`${templateCodeJS}`)
      //   : editor1.setValue(`${userCode}`)
    }
    editor1.setOptions({
      fontSize: '10pt'
    })
    // event listener for the change event
    editor1.on('change', function (): void {
      const code = editor1.getValue()
      setBattle(prevBattle => ({ ...prevBattle, userCode: `${code}` }))
    })
  }, [templateCodeJS])

  useEffect(() => {
    // formats test cases upon mounting
    if (testCasesArray === null && testCasesObj !== null) {
      setTestCasesArray(formatTestCases(testCasesObj))
    }
  }, [testCasesObj])

  return (
    <div className="w-full h-full flex flex-col border border-blue-700 rounded-[3px]">
      <div className="flex flex-row w-full rounded-[3px] bg-black justify-between">
        <div>
          <Tooltip title="Execute Code" enterDelay={100} leaveDelay={50}>
            <IconButton
              aria-label="execute code"
              className="h-8 w-8 rounded bg-blue-500 hover:bg-blue-700 m-2 text-white"
              onClick={() => { runCode().catch(console.error) }}
            >
              <PlayArrow />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Code" enterDelay={100} leaveDelay={50}>
            <IconButton
              aria-label="reset code"
              className="h-8 w-8 bg-black rounded hover:bg-gray-700 text-white"
              onClick = {() => { resetCode() }}
            >
              <Replay />
            </IconButton>
          </Tooltip>
        </div>
        <ProgressBar percentage={userProgress} />
      </div>
      <div id="editor1" ref={editor1Ref} className="w-full flex-grow rounded-[3px]" />
    </div>
  )
}

export default AceEditor
