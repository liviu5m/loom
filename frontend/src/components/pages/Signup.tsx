import { ArrowRight, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import type { FastAPIError, SignupData } from "@/lib/Types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { singupFunction } from "@/api/user";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const Signup = () => {
  const [data, setData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const navigate = useNavigate();

  const { mutate: signup } = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => singupFunction(data),
    onSuccess: (response) => {
      console.log("Signup successful:", response);
      toast(response.message || "Signup successful!");
      navigate("/auth/login");
    },
    onError: (error: AxiosError<FastAPIError>) => {
      toast(error.response?.data?.detail || "Signup failed. Please try again.");
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center text-white bg-[#0F1117]">
      <div className="shadow rounded-lg px-20 py-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="z-10 w-full max-w-md px-6"
        >
          <div className="text-center mb-12">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-loom-surface border border-loom-gold/20 flex items-center justify-center shadow-[0_0_30px_rgba(212,168,83,0.1)]"
            >
              <Brain className="w-8 h-8 text-loom-gold" />
            </motion.div>
            <h1 className="text-5xl font-serif text-loom-text mb-3 tracking-tight">
              Loom
            </h1>
            <p className="text-loom-muted text-lg">
              Your Personal External Brain
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              signup();
            }}
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-loom-muted uppercase tracking-wider ml-1"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter User Name"
                className="w-full bg-loom-surface border border-loom-border rounded-xl px-5 py-3 text-loom-text placeholder:text-loom-muted/30 focus:outline-none focus:border-loom-gold/50 focus:ring-1 focus:ring-loom-gold/50 transition-all"
                autoFocus
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-loom-muted uppercase tracking-wider ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter User Email"
                className="w-full bg-loom-surface border border-loom-border rounded-xl px-5 py-3 text-loom-text placeholder:text-loom-muted/30 focus:outline-none focus:border-loom-gold/50 focus:ring-1 focus:ring-loom-gold/50 transition-all"
                autoFocus
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-loom-muted uppercase tracking-wider ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter User Password"
                className="w-full bg-loom-surface border border-loom-border rounded-xl px-5 py-3 text-loom-text placeholder:text-loom-muted/30 focus:outline-none focus:border-loom-gold/50 focus:ring-1 focus:ring-loom-gold/50 transition-all"
                autoFocus
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="passwordConfirmation"
                className="text-sm font-medium text-loom-muted uppercase tracking-wider ml-1"
              >
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                placeholder="Confirm User Password"
                className="w-full bg-loom-surface border border-loom-border rounded-xl px-5 py-3 text-loom-text placeholder:text-loom-muted/30 focus:outline-none focus:border-loom-gold/50 focus:ring-1 focus:ring-loom-gold/50 transition-all"
                autoFocus
                value={data.passwordConfirmation}
                onChange={(e) =>
                  setData({ ...data, passwordConfirmation: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="group w-full bg-loom-gold hover:bg-loom-gold-dim text-loom-dark font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-loom-text">
            Already have an account?{" "}
            <Link to={"/auth/login"} className="font-semibold text-loom-gold">
              Log in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-loom-muted/50">
            Secure • Local-First • Semantic
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
