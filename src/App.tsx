import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import Admin from "./pages/Admin";
import AdminProject from "./pages/AdminProject";
import Tarifs from "./pages/Tarifs";
import AdminTarifs from "./pages/AdminTarifs";
import Partenaires from "./pages/Partenaires";
import AdminPartenaires from "./pages/AdminPartenaires";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tarifs" element={<Tarifs />} />
              <Route path="/partenaires" element={<Partenaires />} />
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/project/:id" element={<AdminProject />} />
              <Route path="/admin/tarifs/:id" element={<AdminTarifs />} />
              <Route path="/admin/partenaires/:id" element={<AdminPartenaires />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
