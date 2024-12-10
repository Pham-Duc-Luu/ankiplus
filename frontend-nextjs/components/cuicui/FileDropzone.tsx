"use client";
import { useToast } from "@/hooks/use-toast";
import { append_card } from "@/store/collectionSlice";
import { useAppDispatch } from "@/store/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { File, Trash2, Upload } from "lucide-react";
import type React from "react";
import { type DragEvent, useRef, useState } from "react";
import { v4 } from "uuid";
import * as XLSX from "xlsx";

interface FileWithPreview extends File {
  preview: string;
}
export interface FileDropzoneProps {
  onModalClose?: () => void;
}

export function FileDropzone({ onModalClose }: FileDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProccessingFile, setIsProccessingFile] = useState(false);

  const { toast } = useToast();
  const dispatch = useAppDispatch();

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

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];

      // IMPORTANT check the file type for xlsx
      if (
        file?.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Returns an array of arrays, each array representing a row
        // Now select the first two columns from each row
        jsonData?.map((row) => {
          dispatch(
            append_card([
              {
                front: row[0] ? row[0] : "",
                back: row[1] ? row[1] : "",
                positionId: v4(),
              },
            ])
          );

          // * close the modal
          onModalClose && onModalClose();
        });

        handleFiles(Array.from([e.target.files[0]]));
      } else {
        toast({ variant: "destructive", title: "Wrong file type" });
      }
    }
  };

  const handleDeleteFile = (fileToDelete: FileWithPreview) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
    URL.revokeObjectURL(fileToDelete.preview);
  };

  return (
    <div className="h-60 w-96 p-8">
      <motion.div
        className={`relative size-full cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/5"
            : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500"
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          accept="image/*,application/pdf"
          className="hidden"
          multiple={true}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className=" pointer-events-none select-none"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="pointer-events-none mx-auto size-8 select-none text-blue-500" />
              <p className="pointer-events-none mt-2 select-none text-blue-500 text-sm">
                Drop files here...
              </p>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto size-8 text-neutral-400 dark:text-neutral-500" />
              <p className="mt-2 text-balance font-medium text-neutral-400 text-sm tracking-tighter dark:text-neutral-500">
                Drag and drop files here, or click to select
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-2"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            {files.map((file) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center rounded-lg bg-neutral-400/10 p-1"
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                key={file.name}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    alt={file.name}
                    className="mr-2 size-10 rounded object-cover"
                    src={file.preview}
                  />
                ) : (
                  <File className="mr-2 size-10 text-neutral-500" />
                )}
                <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400">
                  {file.name}
                </span>
                <Trash2
                  className="mr-2 size-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileDropzone;