import React from "react";
import "./App.css";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Tenants from "./pages/Tenants";
import Vendors from "./pages/Vendors";
import AddRequest from "./requests/AddRequest";
import AddVendor from "./vendors/AddVendor";
import AddTenant from "./tenants/AddTenant";
import EditRequest from "./requests/EditRequest";
import EditTenant from "./tenants/EditTenant";
import EditVendor from "./vendors/EditVendor";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AuthService from "./auth/AuthService";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredRoles }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  if (userRole === "ADMIN" || userRole === "PRIVILEGED_USER") {
    return element;
  }

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          
          {/* Routes accessible to ALL Users */}
          <Route path="/" element={<Home />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/EditRequest/:id" element={<EditRequest />} />
          <Route path="/AddRequest" element={<AddRequest />} />

          {/* Routes accessible to only admins and privileged users */}
          <Route path="/Vendors" element={<ProtectedRoute element={<Vendors />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />
          <Route path="/Tenants" element={<ProtectedRoute element={<Tenants />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />
          <Route path="/AddVendor" element={<ProtectedRoute element={<AddVendor />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />}/>
          <Route path="/AddTenant" element={<ProtectedRoute element={<AddTenant />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />
          <Route path="/EditTenant/:id" element={<ProtectedRoute element={<EditTenant />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />
          <Route path="/EditVendor/:id" element={<ProtectedRoute element={<EditVendor />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />
          <Route path="/Register" element={<ProtectedRoute element={<Register />} requiredRoles={["ADMIN", "PRIVILEGED_USER"]} />} />

          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
