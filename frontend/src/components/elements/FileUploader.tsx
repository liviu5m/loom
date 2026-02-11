import React, { useCallback, useId, useState } from "react";
import { Upload, FileText, X, CheckIcon, OctagonX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { removeUploadedFile, uploadMultipleFiles } from "@/api/storage";

type FileUpload = {
  id: string;
  file: File;
  status: string;
  filePath?: string;
};

const allowedExtensions = [
  ".py",
  ".js",
  ".ts",
  ".yaml",
  ".yml",
  ".html",
  ".css",
  ".md",
  ".json",
];
const allowedMimeTypes = [
  "text/plain",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 10 * 1024 * 1024;

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = filterFiles(Array.from(e.dataTransfer.files));
      setFiles((prev) => [...prev, ...newFiles]);
      uploadFiles(newFiles);
    }
  }, []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = filterFiles(Array.from(e.target.files));
      setFiles((prev) => [...prev, ...newFiles]);
      uploadFiles(newFiles);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const filterFiles = (files: File[]) => {
    const filteredFiles = files.map((file) => {
      const fileName = file.name.toLowerCase();

      const isAllowedExtension = allowedExtensions.some((ext) => {
        return fileName.endsWith(ext);
      });
      const isAllowedMime = allowedMimeTypes.includes(file.type);
      const isUnderSizeLimit = file.size <= MAX_SIZE;

      return (isAllowedExtension || isAllowedMime) && isUnderSizeLimit
        ? { file, status: "waiting", id: crypto.randomUUID() }
        : { file, status: "not-allowed", id: crypto.randomUUID() };
    });
    return filteredFiles;
  };

  const { mutate: uploadFiles } = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: (file: FileUpload[]) => uploadMultipleFiles(file),
    onSuccess: (data) => {
      console.log(data);
      setFiles(
        files.map((file) => {
          let dataFound = data.find((d: FileUpload) => d.id === file.id);
          if (dataFound && file.status == "waiting") {
            return { ...dataFound, status: "uploaded" };
          }
          return file;
        }),
      );
    },
    onError: (err) => {
      console.log(err);
    },
  });
  console.log(files);

  const { mutate: deleteFile } = useMutation({
    mutationKey: ["deleteFile"],
    mutationFn: (filePath: string) => removeUploadedFile(filePath),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <div className="w-full space-y-6 flex gap-10">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={` px-20
          relative w-1/2 h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
          ${isDragging ? "border-loom-gold bg-loom-gold/5 shadow-[0_0_30px_rgba(212,168,83,0.1)]" : "border-loom-border bg-loom-surface hover:border-loom-gold/30 hover:bg-loom-surface/80"}
        `}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          accept=".pdf,.txt,.md"
        />

        <div className="flex flex-col items-center space-y-4 text-center pointer-events-none">
          <div
            className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? "bg-loom-gold/20 text-loom-gold" : "bg-loom-dark border border-loom-border text-loom-muted"}
          `}
          >
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-loom-text">
              Drop your documents here
            </p>
            <p className="text-sm text-loom-muted">Support for PDF, TXT, MD</p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="space-y-3 w-[500px]"
          >
            <h3 className="text-sm font-medium text-loom-muted uppercase tracking-wider w-full">
              Upload Queue
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={`${file.file.name}-${index}`}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                  }}
                  className="flex items-center justify-between p-3 bg-loom-surface border border-loom-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-loom-dark rounded border border-loom-border">
                      <FileText className="w-4 h-4 text-loom-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-loom-text">
                        {file.file.name.substring(0, 20) +
                          (file.file.name.length > 20 ? "..." : "")}
                      </p>
                      <p className="text-xs text-loom-muted">
                        {(file.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="p-1 hover:text-red-400 text-loom-muted transition-colors flex items-center justify-center">
                      {file.status == "waiting" ? (
                        <div className="w-5 h-5 border-4 border-t-loom-gold-dim border-gray-300 rounded-full animate-spin"></div>
                      ) : file.status == "not-allowed" ? (
                        <OctagonX className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        deleteFile(file.filePath || "");
                        removeFile(index);
                      }}
                      className="p-1 hover:text-red-400 text-loom-muted transition-colors cursor-pointer hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
