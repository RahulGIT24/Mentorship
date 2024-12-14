import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyAccount from "./pages/VerifyAccount";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./lib/getUser";
import { setAuth, setUser } from "./redux/reducers/userSlice";
import { useEffect } from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import ForYou from "./pages/ForYou";
import Notifications from "./pages/Notifications";

const App = () => {
  const authenticated = useSelector((state: any) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  async function checkAuth() {
    const res = await getUser();
    dispatch(setUser(res.data))
    dispatch(setAuth(res.status === 200));
  }
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={authenticated ? <Navigate to={"/"} /> : <LoginPage />}
          />
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/register"
            element={
              authenticated ? <Navigate to={"/"} /> : <RegistrationPage />
            }
          />
          <Route
            path="/forgot-password"
            element={authenticated ? <Navigate to={"/"} /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={authenticated ? <Navigate to={"/"} /> : <ResetPassword />}
          />
          <Route
            path="/verify-account"
            element={authenticated ? <Navigate to={"/"} /> : <VerifyAccount />}
          />
          <Route
            path="/discover"
            element={!authenticated ? <Navigate to={"/login"} /> : <Discover />}
          />
          <Route
            path="/foryou"
            element={!authenticated ? <Navigate to={"/login"} /> : <ForYou />}
          />
          <Route
            path="/notifications"
            element={!authenticated ? <Navigate to={"/login"} /> : <Notifications />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="*"
            element={<Navigate to={"/"} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
