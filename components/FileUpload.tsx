
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-sky-500 hover:bg-slate-800/50 transition-colors duration-300"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <div className="flex flex-col items-center">
        <UploadIcon className="w-10 h-10 text-slate-500 mb-3" />
        {fileName ? (
          <>
            <p className="text-slate-300">File loaded:</p>
            <p className="font-semibold text-sky-400">{fileName}</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-slate-300">
              Click to upload Translation Memory
            </p>
            <p className="text-sm text-slate-500">JSON file only</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
