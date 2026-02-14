import { ArrowRight, Search } from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitQuery } from "@/api/document";

const Query = () => {
  const [query, setQuery] = useState("");
  const questions = [
    "What is the reset code for the smart lock ? ",
    "Summarize the Q4 meeting action items ",
    "How do I authenticate with the API ? ",
  ];

  const { mutate: searchQuery } = useMutation({
    mutationKey: ["search-query", query],
    mutationFn: () => submitQuery(query),
    onSuccess: (data) => {
      console.log(data);
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
              className="px-14 py-7 text-lg rounded-xl text-loom-text bg-loom-surface border border-loom-border outline-none focus:ring-2 focus:ring-loom-gold-dim/50 focus:border-loom-gold-dim transition-all w-full focus:shadow-loom-gold-dim/20 focus:shadow-xl"
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
                <ArrowRight
                  className={`w-5 h-5 ${query ? "text-loom-dark" : "text-loom-text/70"}`}
                />
              </button>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 mt-10 gap-5">
              {questions.map((q, i) => {
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
        </div>
      </div>
    </BodyLayout>
  );
};

export default Query;
