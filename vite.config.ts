import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Este objeto será preenchido apenas em ambiente de build da Vercel.
  const vercelDefine =
    // A Vercel define a variável de ambiente VERCEL como '1' durante o build.
    process.env.VERCEL === "1"
      ? {
          "import.meta.env.VITE_SUPABASE_URL": `"${process.env.VITE_SUPABASE_URL}"`,
          "import.meta.env.VITE_SUPABASE_ANON_KEY": `"${process.env.VITE_SUPABASE_ANON_KEY}"`,
        }
      : {};

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Para o desenvolvimento local, o Vite usará o arquivo .env automaticamente.
    // Para a Vercel, injetamos as variáveis manualmente.
    define: vercelDefine,
  };
});