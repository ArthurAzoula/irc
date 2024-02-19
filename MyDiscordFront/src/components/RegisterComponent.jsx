import FormInputComponent from "./input/FormInputComponent";
import LoginButton from "./LoginButton";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { NavigateContext } from '../context/NavigateContext';
import './RegisterComponent.css';

const RegisterComponent = () => {
  const { setRoute } = useContext(NavigateContext);
  const { user, register } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await register(data);

    if (response.status === 201) {
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
    <div className="registercomponent_container">
      <div className="registercomponent_container_sub">
        <h2>Créez votre compte !</h2>
        <form onSubmit={handleSubmit}>
          <div className="registercomponent_name_container">
            <FormInputComponent
              type="text"
              name="lastName"
              placeholder="Prénom"
              className="registercomponent_name_input"
            />
            <FormInputComponent
              type="text"
              name="firstName"
              placeholder="Nom"
              className="registercomponent_name_input"
            />
          </div>
          <div className="registercomponent_username_email_password_container">
            <FormInputComponent
              type="text"
              name="nickname"
              placeholder="Nom d'utilisateur"
            />
            <FormInputComponent
              type="email"
              name="email"
              placeholder="Email"
            />
            <FormInputComponent
              type="password"
              name="password"
              placeholder="Créez votre mot de passe"
            />
          </div>

          <div className="registercomponent_checkbox_container">
            <FormInputComponent
              type="checkbox"
              required
              text="J'ai lu et j'accepte les conditions d'utilisation"
            />
          </div>

          <div className="registercomponent_buttons_container">
            <LoginButton text="S'inscrire" />
            <button
              onClick={() => setRoute('login')}
              className="registercomponent_button_login"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
