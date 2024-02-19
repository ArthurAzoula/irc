// Import pages
import Home from "../screen/HomeScreen";
import RegisterComponent from "../components/RegisterComponent";
import LoginComponent from "../components/LoginComponent";
import ProfileScreen from "../screen/ProfileScreen";
import AnonymousRegister from "../components/AnonymousRegister";

const routes = {
    "home": <Home />,
    "login": <LoginComponent />,
    "register": <RegisterComponent />,
    "profile": <ProfileScreen />,
    "anonymous": <AnonymousRegister />
};

export default routes;