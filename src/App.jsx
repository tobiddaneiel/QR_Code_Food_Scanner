import {Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/Protected_Routes.jsx";
import Navbar from "./components/NavBar.jsx";
import { useLocation } from "react-router-dom";

import Login from "./pages/Login_page.jsx";
import SignUp from "./pages/SignUp_page.jsx";
import FoodInventory from "./pages/Food_inventory_page.jsx";
import Home from "./pages/Home_page.jsx";
import Profile from "./pages/Profile_page.jsx";
import UserAdminPage from "./pages/User_admin_page.jsx";
import ResetPassword from "./pages/Reset_Password_page.jsx";
import './App.css'



    

function App() {
  const location = useLocation();
  const showNavBar = !["/login", "/signup", "/", "/reset-password"].includes(location.pathname);
  return (
    <>
      {showNavBar && <Navbar />} 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <FoodInventory />
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <UserAdminPage />
            </ProtectedRoute>
          } />
        </Routes>
    </>    
  )
}

export default App;
