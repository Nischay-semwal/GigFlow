import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import CreateGig from "./pages/CreateGig";
import GigDetails from "./pages/GigDetails";
import GigBids from "./pages/GigBids";
import ProtectedRoute from "./component/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/gigs" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/gigs"
        element={
          <ProtectedRoute>
            <Gigs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-gig"
        element={
          <ProtectedRoute>
            <CreateGig />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gigs/:gigId"
        element={
          <ProtectedRoute>
            <GigDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gigs/:gigId/bids"
        element={
          <ProtectedRoute>
            <GigBids />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
