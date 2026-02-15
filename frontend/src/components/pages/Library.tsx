import { Calendar, Database, FileCheck, Icon, Search } from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useQuery } from "@tanstack/react-query";
import { searchFiles } from "@/api/file";
import { useState } from "react";
import { motion } from "framer-motion";
import type { File } from "@/lib/Types";
import Loader from "../elements/Loader";

const Library = () => {
  const [search, setSearch] = useState("");

  const { data: files, isPending } = useQuery({
    queryKey: ["files", search],
    queryFn: () => searchFiles(search),
  });

  console.log(files);

  return isPending ? (
    <Loader />
  ) : (
    <BodyLayout>
      <div className="flex items-center justify-center">
        <div className="w-[1000px] py-10">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-sans text-loom-text">Library</h1>
              <p className="mt-2 text-loom-muted">
                Manage your ingested knowledge base.
              </p>
            </div>
            <div>
              <div className="relative">
                <Search className="w-4 h-4 text-loom-text absolute top-1/2 left-4 -translate-1/2" />
                <input
                  type="text"
                  className="px-4 pl-8 py-2 text-sm rounded-lg border border-loom-border bg-loom-surface focus:border focus:border-loom-gold-dim/50 outline-none"
                  placeholder="Search Files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {files.map((file: File, i: number) => {
              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(212, 168, 83, 0.3)",
                  }}
                  className="bg-loom-surface border border-loom-border rounded-xl p-5 cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-loom-gold shadow-[0_0_8px_rgba(212,168,83,0.6)]" />
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-loom-dark border border-loom-border group-hover:border-loom-gold/20 transition-colors">
                      <FileCheck className="w-6 h-6 text-loom-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-medium text-loom-text truncate"
                        title={file.filename}
                      >
                        {file.filename}
                      </h4>
                      <p className="text-xs text-loom-muted uppercase tracking-wider mt-1">
                        {file.filename.split(".").slice(-1)[0]}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-loom-muted border-t border-loom-border pt-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(file.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Database className="w-3.5 h-3.5" />
                      <span>{file.chunks} chunks</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </BodyLayout>
  );
};

export default Library;
