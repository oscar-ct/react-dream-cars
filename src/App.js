import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignOut from "./pages/SignOut";


function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route path={"/"} element={<Explore/>}/>
                <Route path={"/offers"} element={<ForgotPassword/>}/>
                <Route path={"/sign-in"} element={<Offers/>}/>
                <Route path={"/profile"} element={<Profile/>}/>
                <Route path={"/sign-in"} element={<SignIn/>}/>
                <Route path={"/sign-out"} element={<SignOut/>}/>

            </Routes>
        </Router>
    </>
  );
}

export default App;
