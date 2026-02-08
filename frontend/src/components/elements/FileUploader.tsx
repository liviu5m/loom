import React, { useCallback, useEffect, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { uploadFileFunc } from "@/api/storage";

type FileUpload = {
  file: File;
  uploaded: boolean;
};

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
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [
        ...prev,
        ...newFiles.map((file) => ({ file, uploaded: false })),
      ]);
    }
  }, []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        uploaded: false,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { mutate: uploadFile } = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: (file: File) => uploadFileFunc(file),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    console.log(files);
    files.map((file: FileUpload) => {
      uploadFile(file.file);
    });
  }, [files]);

  return (
    <div className="w-full space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={` px-20
          relative w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden
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
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-loom-muted uppercase tracking-wider">
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
                        {file.file.name}
                      </p>
                      <p className="text-xs text-loom-muted">
                        {(file.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:text-red-400 text-loom-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
