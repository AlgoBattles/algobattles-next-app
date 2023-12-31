'use client'
import React, { useEffect, useRef, useState } from 'react'
import ProgressBar from './ProgressBar'
import Button from '@mui/material/Button'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useUser } from '../_contexts/UserContext'
import { useBattle } from '../_contexts/BattleContext'
import type { TestCase } from '../_types/battleTypes'

const AceEditor = (): React.ReactElement => {
  const { user } = useUser()
  const { battle, setBattle } = useBattle()

  const {
    templateCode,
    testCasesObj,
    userCode,
    userProgress
  } = battle

  const editor1Ref = useRef<HTMLDivElement | null>(null);
  const [testCasesArray, setTestCasesArray] = useState<any[][] | null>(null)

  // formats test cases for execution engine compatibility
  const formatTestCases = (data: { [key: string]: TestCase }) => { 
    const result = Object.values(data).map(key => {
      const inputValues = [key.input.nums, key.input.target];
      const expectedOutput = key.output.expected;
      return [inputValues, expectedOutput];
    })
    return result
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
        setBattle(prevBattle => ({...prevBattle, userResults: results, userProgress: data.progress, testOutput: output[0][0] && output[0][0].toString()}))
      } else if (data.progress === 100) {
        const output = JSON.parse(data.run.output.replace(/'/g, '"').replace(/undefined/g, 'null'))
        const results = output.map((item: any, index: number) => {
          return item[0]
        })
        setBattle(prevBattle => ({ ...prevBattle, gameOver: true, userWon: true, battleuserResults: results, userProgress: data.progress, testOutput: output[0][0] && output[0][0].toString() })) 
      }
    } else if (data.run.code === 1) {
      // sets error in state to display in console
      const results = null
      setBattle(prevBattle => ({ ...prevBattle, userResults: results, userProgress: 0, testOutput: data.run.stderr }))
    }
}

  useEffect(() => {
    // configure editor
    const ace = require('ace-builds/src-noconflict/ace');
    require('ace-builds/src-noconflict/theme-chaos');
    require('ace-builds/src-noconflict/mode-javascript');
    require('ace-builds/src-noconflict/mode-python')
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme('ace/theme/chaos');
    if (user.preferredLanguage === 'python') {
      editor1.session.setMode('ace/mode/python');
    }
    else if (user.preferredLanguage === 'javascript') {
      editor1.session.setMode('ace/mode/javascript')
    }
    userCode.length > 1 ? editor1.setValue(`${userCode}`) : editor1.setValue(`${templateCode}`);
    editor1.setOptions({
      fontSize: '10pt'
    })
    // Add event listener for the change event
    editor1.on('change', function (): void {
      const code = editor1.getValue()
      setBattle(prevBattle => ({ ...prevBattle, userCode: `${code}` }))
    })
  }, [templateCode])

  useEffect(() => {
    // formats test cases upon mounting
    if (testCasesArray === null && testCasesObj !== null) {
      setTestCasesArray(formatTestCases(testCasesObj))
    }
  }, [testCasesObj])

  return (
    <div className="w-full h-[50vh] border border-blue-700 rounded-[3px]">
    <div onClick={() => { runCode().catch(console.error) }} className="flex flex-row w-full h-[13%] rounded-[3px] bg-black justify-between">
        <Button variant="contained" startIcon={<PlayArrowIcon />} className="h-8 w-30 bg-blue-500 hover:bg-blue-700 m-2 text-white" sx={{
          fontSize: '12px',
          fontFamily: 'arial'
        }}>Run code</Button>
        <ProgressBar percentage={userProgress} />
    </div>
    <div id="editor1" ref={editor1Ref} className="w-full h-[87%] rounded-[3px]" />
    </div>
  )
}

export default AceEditor
