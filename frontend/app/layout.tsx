import type { Metadata } from "next";

import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BackendStatusProvider } from "./contexts/BackendStatusContext";
import { Navbar } from "./components/Navbar";

export const metadata: Metadata = {
  title: "QuickPolls",
  description: "app to simulate live updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <AuthProvider>
          <BackendStatusProvider>
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Navbar />
              {children}
            </div>
          </BackendStatusProvider>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                const el = document.getElementById('health-indicator');
                if(!el) return;
                const api = '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}';
                function set(status, text){
                  el.textContent = text;
                  el.setAttribute('data-status', status);
                  el.style.borderColor = status==='up'?'#10b981':'#f59e0b';
                  el.style.color = status==='up'?'#10b981':'#f59e0b';
                }
                // Wait for hydration to complete before updating
                setTimeout(() => {
                  function checkHealth() {
                    fetch(api + '/health', { cache: 'no-store' })
                      .then(r=>r.json())
                      .then(j=> set('up', 'Backend: Up'))
                      .catch(()=> set('down','Backend: Warming up...'));
                  }
                  checkHealth();
                  // Check every 10 seconds
                  setInterval(checkHealth, 10000);
                }, 1000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
