import { ArrowRight, Brain, FileText, Search } from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitQuery } from "@/api/document";
import type { QueryResponse } from "@/lib/Types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { createResponseFunc } from "@/api/response";

const Query = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const questions = [
    "What is the reset code for the smart lock ? ",
    "Summarize the Q4 meeting action items ",
    "How do I authenticate with the API ? ",
  ];

  const { mutate: createResponse } = useMutation({
    mutationKey: ["create-response"],
    mutationFn: ({
      question,
      response,
    }: {
      question: string;
      response: string;
    }) => createResponseFunc(question, response),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: searchQuery, isPending } = useMutation({
    mutationKey: ["search-query", query],
    mutationFn: () => submitQuery(query),
    onSuccess: (data) => {
      console.log(data);
      setResponse(data);
      createResponse({ question: query, response: data.answer });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = () => {
    searchQuery();
  };

  return (
    <BodyLayout>
      <div className="flex items-center justify-center w-full">
        <div className="w-[1000px] py-10">
          <h1 className="text-center text-3xl font-semibold text-loom-text">
            Query Your Brain
          </h1>
          <h4 className="text-center text-loom-muted mt-5">
            Semantic search across all your ingested documents.
          </h4>
          <div className="relative mt-10">
            <div className="absolute top-1/2 left-5 -translate-y-1/2">
              <Search
                className={`w-6 h-6 ${query ? "text-loom-text" : "text-loom-text/70"}`}
              />
            </div>
            <input
              type="text"
              className="pl-14 pr-20 py-7 text-lg rounded-xl text-loom-text bg-loom-surface border border-loom-border outline-none focus:ring-2 focus:ring-loom-gold-dim/50 focus:border-loom-gold-dim transition-all w-full focus:shadow-loom-gold-dim/20 focus:shadow-xl"
              placeholder="Ask your brain anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <div className="absolute top-1/2 right-5 -translate-y-1/2">
              <button
                className={`w-10 h-10 rounded-lg flex items-center justify-center  ${query ? "bg-loom-gold shadow-md shadow-loom-gold-dim" : "bg-loom-dark"} cursor-pointer hover:scale-105`}
                onClick={() => handleSubmit()}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-4 border-t-loom-gold-dim border-gray-300 rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight
                    className={`w-5 h-5 ${query ? "text-loom-dark" : "text-loom-text/70"}`}
                  />
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 mt-10 gap-5">
              {response && (
                <div className="col-span-2 p-10 bg-loom-surface border-l-4 border-loom-gold-dim rounded-r-lg ">
                  <div className="flex items-center gap-3 text-loom-gold mb-3">
                    <div>
                      <Brain />
                    </div>
                    <h3 className="text-xl font-semibold">
                      AI Generated Answer
                    </h3>
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {response.answer}
                  </ReactMarkdown>
                </div>
              )}
              {!response &&
                questions.map((q, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-loom-border px-5 py-3 rounded-lg hover:bg-loom-surface hover:border-loom-gold-dim/50 cursor-pointer"
                      onClick={() => setQuery(q)}
                    >
                      <span>{q}</span>
                      <ArrowRight className="w-4 h-4 text-loom-muted" />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-5 mt-10">
            {response?.content_list.map((content, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: -10,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.2 + index * 0.1,
                }}
                className="group flex items-center gap-3 p-3 rounded-lg bg-loom-surface/50 border border-loom-border hover:border-loom-gold/30 hover:bg-loom-surface transition-all cursor-pointer"
              >
                <div className="p-2 rounded bg-loom-dark border border-loom-border group-hover:border-loom-gold/20">
                  <FileText className="w-4 h-4 text-loom-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-loom-text truncate">
                    {content.filename}
                  </p>
                  <p className="text-xs text-loom-muted">
                    Page {content.page} • {content.match_score} Match
                  </p>
                </div>
                {/* <ExternalLink className="w-4 h-4 text-loom-muted opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BodyLayout>
  );
};

export default Query;
