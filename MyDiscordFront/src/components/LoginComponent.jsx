import LoginButton from "./LoginButton";
import ForgotPassword from "./ForgotPassword";
import FormInputComponent from "./input/FormInputComponent";
import RegisterButton from "./RegisterButton";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { NavigateContext } from '../context/NavigateContext';
import './LoginComponent.css';

const LoginComponent = () => {
  const { setRoute } = useContext(NavigateContext);
  const { user, login } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const response = await login(data);

    if (response.status === 200) {
      setRoute('home');
    } else {
      //TODO: show toast
      console.log("error registering: ", response.data);
    }
  };
  
  useEffect(() => {
    if(user)
        setRoute('home');
  }, [user, setRoute])
  
  return (
    <div>
      <div className="logincomponent_container">
        <div className="logincomponent_title_container">
          <h2 className="logincomponent_title">
            Connexion
          </h2>
        </div>
        <div className="logincomponent_form_container">
          <form
            className="logincomponent_form"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <FormInputComponent
                type="text"
                name="identifier"
                placeholder="Identifiant"
              />
              <FormInputComponent
                type="password"
                name="password"
                placeholder="Mot de passe"
              />
            </div>
            <div className="logincomponent_forgot_password_container">
              <ForgotPassword />
            </div>

            <div className="logincomponent_buttons">
              <LoginButton text="Connexion" className="logincomponent_login_button" />
              <RegisterButton
                onClick={() => setRoute('register')}
                text="Inscrivez-vous !"
                className="logincomponent_register_login_button logincomponent_register_button_sub"
              />
              <LoginButton
                onClick={() => setRoute('anonymous')}
                text="Connexion en tant qu'invité"
                className="logincomponent_register_button_sub"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
