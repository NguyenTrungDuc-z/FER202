// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}
