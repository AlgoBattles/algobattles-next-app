"use client"
import React, { useEffect, useRef } from 'react';
import ProgressBar from './OpponentProgress';
import { useBattle } from '../_contexts/BattleContext';
import { Editor } from 'ace-builds';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const AceEditor = () => {
  const editor1Ref = useRef<HTMLDivElement | null>(null);
  const { battle, setBattle } = useBattle();
  const { templateCode, opponentCode, opponentProgress }: { templateCode: string, opponentCode: string, opponentProgress: number } = battle;


  useEffect(() => {
    const ace = require('ace-builds/src-noconflict/ace');
    require('ace-builds/src-noconflict/theme-chaos');
    require('ace-builds/src-noconflict/mode-javascript');
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme("ace/theme/chaos");
    editor1.session.setMode("ace/mode/javascript");
    battle.opponentCode ? editor1.setValue(`${battle.opponentCode}`) : editor1.setValue(`${templateCode}`);
    editor1.setOptions({
        fontSize: "10pt" 
      });
  }, [templateCode, battle]);

  // useEffect(() => {
  //   if (editor1Ref.current) {
  //     editor1Ref.current.setValue(opponentCode);
  //   }
  // }, [opponentCode]);

  return (
    <div className="w-full h-[50vh] border border-red-700 rounded-[3px]">
    <div className="flex flex-row w-full h-[13%] rounded-[3px] bg-black justify-between">
    <ProgressBar percentage={opponentProgress} />
    </div>
    <div id="editor1" ref={editor1Ref} className="w-full h-[87%] rounded-[3px]" />
    {/* <div className="w-full h-[87%] rounded-[3px]">
    <Skeleton count={5} />
    </div> */}
    </div>
    );
};

export default AceEditor;