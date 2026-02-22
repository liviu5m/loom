import { ArrowRight, Brain, FileText, Search } from "lucide-react";
import BodyLayout from "../layouts/BodyLayout";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitQuery } from "@/api/document";
import type { QueryResponse, Response } from "@/lib/Types";
import { motion } from "framer-motion";
import { createResponseFunc, getResponses } from "@/api/response";
import SmallLoader from "../elements/SmallLoader";
import TextFormatter from "../elements/TextFormatter";
import { useLocation, useNavigate } from "react-router-dom";

const Query = () => {
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.question || "");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const questions = [
    "What is the reset code for the smart lock ? ",
    "Summarize the Q4 meeting action items ",
    "How do I authenticate with the API ? ",
  ];
  const queryClient = useQueryClient();
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();

  const { data: res, isPending: isPendingResponses } = useQuery({
    queryKey: ["recent-questions"],
    queryFn: () => getResponses(),
  });

  useEffect(() => {
    if (res) {
      setResponses(res);
    }
  }, [res]);

  const passedQuestion = location.state?.question;

  useEffect(() => {
    if (passedQuestion) {
      navigate(location.pathname, { replace: true, state: {} });

      handleSubmit();
    }
  }, [passedQuestion, navigate, location.pathname]);

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
    mutationKey: ["submit-query", query],
    mutationFn: () => submitQuery(query),
    onSuccess: (data) => {
      console.log(data);
      setCurrentQuestion(query);
      setQuery("");
      setResponse(data);
      createResponse({ question: query, response: data.answer });
      queryClient.invalidateQueries({ queryKey: ["recent-questions"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = () => {
    if (!isPending) searchQuery();
  };

  return (
    <BodyLayout>
      {isPendingResponses ? (
        <SmallLoader />
      ) : (
        <div className="flex w-full min-h-[calc(100vh-80px)] gap-10">
          <div className="w-64 shrink-0 pt-10">
            <h1 className="text-xl font-semibold text-loom-gold">
              Recent Questions
            </h1>
            <div className="mt-5">
              <ul className="flex flex-col gap-2">
                {responses.map((res: Response) => (
                  <li
                    key={res.id}
                    className="text-loom-text/80 hover:text-loom-gold cursor-pointer text-sm truncate"
                    onClick={() => {
                      setCurrentQuestion(res.question);
                      setResponse({ answer: res.response, content_list: [] });
                    }}
                  >
                    {res.question}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center pt-20">
            <div className="w-full max-w-[800px]">
              {" "}
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
                  className="pl-14 pr-20 py-7 text-lg rounded-xl text-loom-text bg-loom-surface border border-loom-border outline-none focus:ring-2 focus:ring-loom-gold-dim/50 focus:border-loom-gold-dim transition-all w-full"
                  placeholder="Ask your brain anything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <div className="absolute top-1/2 right-5 -translate-y-1/2">
                  <button
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${query ? "bg-loom-gold" : "bg-loom-dark"}`}
                    onClick={() => handleSubmit()}
                  >
                    {isPending ? (
                      <div className="w-5 h-5 border-2 border-t-transparent border-loom-dark rounded-full animate-spin"></div>
                    ) : (
                      <ArrowRight
                        className={`w-5 h-5 ${query ? "text-loom-dark" : "text-loom-text/70"}`}
                      />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-10">
                {response ? (
                  <div className="p-10 bg-loom-surface border-l-4 border-loom-gold-dim rounded-r-lg">
                    <h1 className="text-2xl font-bold text-loom-text mb-5">
                      {currentQuestion}
                    </h1>
                    <div className="flex items-center gap-3 text-loom-gold mb-3">
                      <Brain />
                      <h3 className="text-xl font-semibold">
                        AI Generated Answer
                      </h3>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-loom-surface p-8 rounded-xl shadow-inner">
                        <TextFormatter rawText={response.answer} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border border-loom-border px-5 py-3 rounded-lg hover:bg-loom-surface cursor-pointer"
                        onClick={() => setQuery(q)}
                      >
                        <span className="text-loom-text">{q}</span>
                        <ArrowRight className="w-4 h-4 text-loom-muted" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
                {response?.content_list.map((content, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-loom-surface/50 border border-loom-border"
                  >
                    <FileText className="w-4 h-4 text-loom-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-loom-text truncate">
                        {content.filename}
                      </p>
                      <p className="text-xs text-loom-muted">
                        Page {content.page} • {content.match_score} Match
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-64 shrink-0 hidden xl:block"></div>
        </div>
      )}
    </BodyLayout>
  );
};

export default Query;
