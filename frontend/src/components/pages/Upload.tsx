import BodyLayout from "../layouts/BodyLayout";
import { AnimatePresence, motion } from "framer-motion";
import { FileUploader } from "../elements/FileUploader";

const Upload = () => {

  return (
    <BodyLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-loom-text mb-2">
            Ingest Knowledge
          </h1>
          <p className="text-loom-muted">
            Upload documents to expand your external brain's context.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <FileUploader />

            <div className="mt-8 p-4 rounded-lg bg-loom-surface/50 border border-loom-border text-sm text-loom-muted">
              <h4 className="font-medium text-loom-text mb-2">
                Supported Formats
              </h4>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>PDF Documents (text-selectable)</li>
                <li>Markdown files (.md)</li>
                <li>Plain text (.txt)</li>
              </ul>
            </div>
          </motion.div>

          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {1 ? (
                <motion.div
                  key="processing"
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  className="w-full"
                >
                  {/* <ProcessingStatus
                    fileName={processingFile}
                    onComplete={handleProcessingComplete}
                  /> */}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="text-center text-loom-muted/30"
                >
                  <div className="w-32 h-32 border-2 border-dashed border-loom-muted/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">Waiting</span>
                  </div>
                  <p>Ready to process</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </BodyLayout>
  );
};

export default Upload;
