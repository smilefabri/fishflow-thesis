import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import LoadingPage from "../utils/loadingPage";

function ProtectedRoutes() {


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funzione per verificare la sessione dell'utente
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Utente loggato:", user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Nessun utente loggato o sessione scaduta.", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }

    };
    checkUser();
  }, []);


  // Finché il controllo è in corso, mostriamo un loader o un placeholder
  if (loading) {
    return <LoadingPage/>;
  }

  // Se l'utente è autenticato, rendiamo le rotte protette (Outlet)
  // Altrimenti, reindirizziamo alla pagina di login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;