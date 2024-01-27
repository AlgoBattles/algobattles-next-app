'use client'
import React from 'react';
import Link from 'next/link';
import { useWarning } from '../_contexts/WarningContext';
import { useRouter } from 'next/navigation'

const WarningModal = (): React.JSX.Element | null => {
  const { info, setInfo } = useWarning()
  const router = useRouter()
  if (!info.isOpen) {
    return null;
  }
  const navigateAndCloseModal = (linkToNavigate: string) => {
    setInfo({ ...info, isOpen: false })
    router.push(`${linkToNavigate}`)
  }
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${info.isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative h-[300px] w-[500px] bg-gray-700 p-4 rounded-lg text-center z-200 flex flex-col justify-between items-center py-8">
            <p>{info.warningMessage}</p>
                <button onClick={() => { navigateAndCloseModal(info.link) }}>{info.buttonTitle}</button>
            <button onClick={() => { setInfo({ ...info, isOpen: false }) }}>Return to previous page</button>
        </div>
      </div>
  );
};

export default WarningModal;