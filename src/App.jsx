import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModeProvider, ModeContext } from "./contexts/ModeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AddProfilePage from "./pages/AddProfilePage";
import FetchedProfilePage from "./pages/FetchedProfilePage";
import ProfileDetailPage from "./pages/ProfileDetailPage";
import ProfileLayout from "./components/ProfileLayout";
import NotFoundPage from "./pages/NotFoundPage";
import { mockProfiles } from "./mockData";
import "./App.css";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return res;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        try {
          const res = await fetch(queryKey.join("/"), { credentials: "include" });
          await throwIfResNotOk(res);
          return await res.json();
        } catch (error) {
          // Fallback to mock data if API fails
          if (queryKey[0] === "/api/profiles") {
            return mockProfiles;
          }
          throw error;
        }
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function MainApp() {
  const { theme, toggleTheme } = useContext(ModeContext);

  return (
    <div className="app">
      <Navbar theme={theme} setTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/add" element={<AddProfilePage onSuccess={() => {}} />} />
        <Route path="/other" element={<FetchedProfilePage />} />
        <Route path="/profiles" element={<ProfileLayout />}>
          <Route path=":id" element={<ProfileDetailPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/profile-page.2/">
          <ModeProvider>
            <NotificationProvider>
              <MainApp />
            </NotificationProvider>
          </ModeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
