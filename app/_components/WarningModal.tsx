'use client'
import React from 'react';
import Link from 'next/link';
import { useWarning } from '../_contexts/WarningContext';

const WarningModal = (): React.JSX.Element | null => {
  const { info, setInfo } = useWarning()
  if (!info.isOpen) {
    return null;
  }
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${info.isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative h-[300px] w-[500px] bg-gray-700 p-4 rounded-lg text-center z-200 flex flex-col justify-between items-center py-8">
            <p>{info.warningMessage}</p>
            <Link href={`${info.link}`}>
                <button>{info.buttonTitle}</button>
            </Link>
            <button onClick={() => { setInfo({ ...info, isOpen: false }) }}>Return to previous page</button>
        </div>
      </div>
  );
};

export default WarningModal;