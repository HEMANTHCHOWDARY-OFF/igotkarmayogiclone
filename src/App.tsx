import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { CompetencyProvider } from "./context/CompetencyContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CompetencyProvider>
          <RouterProvider router={router} />
        </CompetencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

