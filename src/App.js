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
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
import { AuthProvider } from "./context/AuthContext";



function App() {


  return (
    <>
        <AuthProvider>
            <Router>
                <Navbar/>
                <Routes>
                    <Route path={"/"} element={<Explore/>}/>
                    <Route path={"/offers"} element={<Offers/>}/>
                    <Route path={"/category/:categoryName"} element={<Category/>}/>
                    <Route path={"/forgot-password"} element={<ForgotPassword/>}/>
                    <Route path={"/profile"} element={<PrivateRoute/>}>
                        <Route path={"/profile"} element={<Profile/>}/>
                    </Route>
                    <Route path={"/sign-in"} element={<SignIn/>}/>
                    <Route path={"/sign-up"} element={<SignUp/>}/>
                    <Route path={"/create-listing"} element={<CreateListing/>}/>
                    <Route path={"/edit-listing/:listingId"} element={<EditListing/>}/>
                    <Route path={"/category/:categoryName/:listingId"} element={<Listing/>}/>
                    <Route path={"/contact/:ownerId"} element={<Contact/>}/>
                </Routes>

            </Router>
            <ToastContainer/>
        </AuthProvider>
    </>
  );
}

export default App;
