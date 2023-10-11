"use client"
import React, { useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type EditorProps = {
    templateCode: string;
    userCode: string;
    setUserCode: (code: string) => void;
  };

const AceEditor = ({templateCode, userCode, setUserCode}: EditorProps) => {
  const editor1Ref = useRef();

  useEffect(() => {
    const ace = require('ace-builds/src-noconflict/ace');
    require('ace-builds/src-noconflict/theme-chaos');
    require('ace-builds/src-noconflict/mode-javascript');
    const editor1 = ace.edit(editor1Ref.current);
    editor1.setTheme("ace/theme/chaos");
    editor1.session.setMode("ace/mode/javascript");
    console.log('templateCode', templateCode)
    userCode ? editor1.setValue(`${userCode}`) : editor1.setValue(`${templateCode}`);
    editor1.setOptions({
        fontSize: "10pt" // Set the font size (default is 12pt)
      });
    // Add an event listener for the change event
    editor1.on('change', function() {
        const code = editor1.getValue();
        setUserCode(code);
    });
  }, [templateCode]);

  function runCode(code: string) {
    fetch('http://localhost:3001/runCode', {

    })
  }

  return (
    <div className="w-full h-[50vh] border border-blue-700 rounded-[3px]">
    <div className="flex flex-row w-full h-[13%] rounded-[3px] bg-black justify-between">
        <Button variant="contained" startIcon={<PlayArrowIcon />} className="h-8 w-30 bg-blue-500 hover:bg-blue-700 m-2 text-white" sx={{
    fontSize: '12px',
    fontFamily: 'arial',
  }}>Run code</Button>
  <ProgressBar percentage={70} />
    </div>
    <div id="editor1" ref={editor1Ref} className="w-full h-[87%] rounded-[3px]" />
    </div>
    );
};

export default AceEditor;