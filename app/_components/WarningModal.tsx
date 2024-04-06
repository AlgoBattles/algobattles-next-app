"use client";
import React from "react";
import Link from "next/link";
import { useWarning } from "../_contexts/WarningContext";
import { useRouter } from "next/navigation";

const WarningModal = (): React.JSX.Element | null => {
  const { info, setInfo } = useWarning();
  const router = useRouter();
  if (!info.isOpen) {
    return null;
  }
  const navigateAndCloseModal = (linkToNavigate: string) => {
    setInfo({ ...info, isOpen: false });
    router.push(`${linkToNavigate}`);
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${info.isOpen ? "" : "hidden"}`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative h-[300px] w-[500px] bg-gray-900 border-[1px] border-gray-700 p-4 rounded-lg text-center z-200 flex flex-col justify-between items-center py-8">
        <p className="text-2xl font-medium">{info.warningMessage}</p>
        <div className="flex flex-row">
          <button
            className="px-6 py-2 mr-4 font-medium bg-red-600 hover:bg-red-500 rounded-3xl"
            onClick={() => {
              navigateAndCloseModal(info.link);
            }}
          >
            {info.buttonTitle}
          </button>
          <button
            className="px-6 py-2 ml-4 font-medium bg-blue-600 hover:bg-blue-500 rounded-3xl"
            onClick={() => {
              setInfo({ ...info, isOpen: false });
            }}
          >
            Return to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
