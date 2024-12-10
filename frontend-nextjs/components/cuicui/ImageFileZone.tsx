"use client";
import { AnimatePresence, motion } from "framer-motion";
import { File, Trash2, Upload } from "lucide-react";
import type React from "react";
import { type DragEvent, useRef, useState } from "react";
import { RiImageAddLine } from "react-icons/ri";

interface FileWithPreview extends File {
  preview: string;
}

interface ImageFileZoneProps {
  isDisabled?: boolean;
}
export function ImageFileZone({ isDisabled = false }: ImageFileZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles = fileList.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteFile = (fileToDelete: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
    URL.revokeObjectURL(fileToDelete.preview);
  };

  return (
    <div className=" place-items-baseline h-[60px] w-[80px]  flex place-content-baseline   ">
      <motion.div
        className={` size-full flex justify-center items-centercursor-pointer rounded-xl border-2 border-dashed  text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/5"
            : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
        }`}
        onClick={!isDisabled ? handleButtonClick : undefined}
        onDragEnter={!isDisabled ? handleDragEnter : undefined}
        onDragLeave={!isDisabled ? handleDragLeave : undefined}
        onDragOver={!isDisabled ? handleDragOver : undefined}
        onDrop={!isDisabled ? handleDrop : undefined}
        // whileHover={{ scale: 1.01 }}
        // whileTap={{ scale: 0.98 }}
      >
        {!isDisabled && (
          <input
            accept="image/*,application/pdf"
            className="hidden"
            multiple={true}
            onChange={handleFileInputChange}
            ref={fileInputRef}
            type="file"
          />
        )}

        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className=" pointer-events-none select-none w-full flex items-center"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <RiImageAddLine className="  pointer-events-none mx-auto size-8 select-none text-blue-500" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className=" pointer-events-none select-none w-full flex items-center"
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RiImageAddLine className="mx-auto size-8 text-neutral-400 dark:text-neutral-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ImageFileZone;
