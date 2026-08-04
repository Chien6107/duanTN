import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChatWidget } from "../components/ChatWidget";
import { ScrollButtons } from "../components/ScrollButtons";
import { Toaster } from "sonner";

export function RootLayout() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip flex flex-col">
      <Header />
      <main className="min-w-0 max-w-full flex-1">
        <Outlet />
      </main>
      <ChatWidget />
      <ScrollButtons />
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
