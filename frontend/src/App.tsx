import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/pages/Dashboard";
import Upload from "./components/pages/Upload";
import { AppProvider } from "./lib/AppProvider";
import NonAuthRequiredRoute from "./components/middlewares/NonAuthRequiredRoute";
import AuthRequiredRoute from "./components/middlewares/AuthRequiredRoute";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <NonAuthRequiredRoute>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Routes>
                </NonAuthRequiredRoute>
              }
            />
            <Route
              path="/*"
              element={
                <AuthRequiredRoute>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/query" element={<Dashboard />} />
                    <Route path="/library" element={<Dashboard />} />
                  </Routes>
                </AuthRequiredRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
