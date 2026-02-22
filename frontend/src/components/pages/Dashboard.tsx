import { useAppContext } from "@/lib/AppProvider";
import BodyLayout from "../layouts/BodyLayout";
import { ArrowRight, Database, FileText, Search } from "lucide-react";
import { useState } from "react";
import { searchFiles } from "@/api/file";
import { getResponses } from "@/api/response";
import SmallLoader from "../elements/SmallLoader";
import { useQuery } from "@tanstack/react-query";
import type { File, Response } from "@/lib/Types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAppContext();
  const [queryHover, setQueryHover] = useState(false);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const { data: files, isPending } = useQuery({
    queryKey: ["files"],
    queryFn: () => searchFiles(""),
  });

  const { data: res, isPending: isPendingResponses } = useQuery({
    queryKey: ["recent-questions"],
    queryFn: () => getResponses(),
  });

  const handleQuestion = () => {
    navigate("/query", { state: { question } });
  };

  return (
    <BodyLayout>
      {isPending || isPendingResponses ? (
        <SmallLoader />
      ) : (
        <div className="px-10 pr-20">
          <h1 className="text-2xl font-semibold text-loom-text mt-10">
            Welcome back, {user?.name}
          </h1>
          <p className="text-loom-muted mt-3">
            Your external brain is active and indexing.
          </p>
          <div className="grid grid-cols-3 gap-10 mt-10">
            <div className="rounded-xl border border-loom-border hover:border hover:border-loom-gold-dim p-8 bg-loom-surface">
              <div className="rounded-lg w-10 h-10 bg-loom-dark flex items-center justify-center">
                <FileText className="text-loom-gold w-5 h-5" />
              </div>
              <h1 className="text-2xl text-white mt-5 font-bold">
                {files.length}
              </h1>
              <h4 className="text-loom-muted text-sm mt-2">
                Documents Uploaded
              </h4>
            </div>
            <div className="rounded-xl border border-loom-border hover:border hover:border-loom-gold-dim p-8 bg-loom-surface">
              <div className="rounded-lg w-10 h-10 bg-loom-dark flex items-center justify-center">
                <Database className="text-loom-gold w-5 h-5" />
              </div>
              <h1 className="text-2xl text-white mt-5 font-bold">
                {files.reduce(
                  (acc: number, file: File) => acc + file.chunks,
                  0,
                )}
              </h1>
              <h4 className="text-loom-muted text-sm mt-2">Chunks Indexed</h4>
            </div>
            <div className="rounded-xl border border-loom-border hover:border hover:border-loom-gold-dim p-8 bg-loom-surface">
              <div className="rounded-lg w-10 h-10 bg-loom-dark flex items-center justify-center">
                <Search className="text-loom-gold w-5 h-5" />
              </div>
              <h1 className="text-2xl text-white mt-5 font-bold">
                {res.length}
              </h1>
              <h4 className="text-loom-muted text-sm mt-2">Queries Made</h4>
            </div>
          </div>
          <div className="flex justify-between gap-10 mt-10">
            <div className="border border-loom-border rounded-xl bg-loom-surface p-7 w-3/5">
              <h1 className="text-lg text-loom-text font-semibold">
                Recent Activity
              </h1>
              <ul className="mt-5 space-y-4">
                {res.slice(-3).map((r: Response, i: number) => {
                  return (
                    <li
                      className="flex items-center justify-between p-4 rounded-lg bg-loom-dark/50 border border-loom-border hover:border-loom-gold/20 transition-colors group"
                      key={i}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-purple-500/10 text-purple-400`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-loom-text font-medium">
                            {r.question}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-loom-muted font-mono">
                        {formatDistanceToNow(parseISO(r.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="w-2/5 p-7 border border-loom-border rounded-xl bg-loom-surface flex flex-col justify-between relative"
              onMouseEnter={() => setQueryHover(true)}
              onMouseLeave={() => setQueryHover(false)}
            >
              <div
                className={`absolute top-5 right-5  ${queryHover ? "text-loom-gold/50" : "text-loom-gold/30"}`}
              >
                <Search className="w-40 h-40" />
              </div>
              <div>
                <h1 className="text-lg text-loom-text font-semibold">
                  Quick Query
                </h1>
                <p className="text-loom-muted mt-2">
                  Ask a question across all your documents instantly.
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-loom-dark border border-loom-border text-white placeholder:text-loom-muted focus:outline-none focus:ring-1 focus:ring-loom-gold"
                  placeholder="Ask a question about your documents..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleQuestion();
                  }}
                />
                <button
                  className="w-8 h-8 bg-loom-gold flex items-center justify-center rounded-lg absolute top-1/2 right-2 -translate-y-1/2 hover:bg-loom-gold-dim cursor-pointer"
                  onClick={(e) => handleQuestion()}
                >
                  <ArrowRight className="w-5 h-5 text-loom-dark" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BodyLayout>
  );
};

export default Dashboard;
