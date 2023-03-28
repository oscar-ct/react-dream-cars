import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";


function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route path={"/"} element={<Explore/>}/>
                <Route path={"/offers"} element={<Offers/>}/>
                <Route path={"/forgot-password"} element={<ForgotPassword/>}/>
                <Route path={"/profile"} element={<PrivateRoute/>}>
                    <Route path={"/profile"} element={<Profile/>}/>
                </Route>
                <Route path={"/sign-in"} element={<SignIn/>}/>
                <Route path={"/sign-up"} element={<SignUp/>}/>
            </Routes>
                <Navbar/>
        </Router>
        <ToastContainer/>
    </>
  );
}

export default App;
