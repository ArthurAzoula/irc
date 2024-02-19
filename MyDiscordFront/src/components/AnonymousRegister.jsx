import LoginButton from "./LoginButton";
import FormInputComponent from "./input/FormInputComponent";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { NavigateContext } from '../context/NavigateContext';
import './AnonymousRegister.css';

const AnonymousRegister = () => {
    const { setRoute } = useContext(NavigateContext);
    const { loginAsAnonymous } = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        const response = await loginAsAnonymous(data);

        if (response.status === 201) {
            setRoute('home');
        } else {
            //TODO: show toast
            console.log("error registering: ", response.data);
        }
    };

    return (
        <div className="anonymous_container">
            <div className="anonymous_subcontainer">
                <h2 className="anonymous_title">
                    Connexion en tant qu'invité
                </h2>
            </div>
            <div className="anonymous_subcontainer_second">
                <form
                    className="anonymous_form"
                    action="#"
                    method="POST"
                    onSubmit={handleSubmit}
                >
                    <p>En tant qu'invité, votre compte ne sera pas sauvegardé.</p>
                    <div>
                        <FormInputComponent
                            className="anonymous_input"
                            type="text"
                            name="nickname"
                            placeholder="Pseudonyme"
                        />
                    </div>
                    <div className="logincomponent_buttons">
                        <LoginButton text="Connexion" className="anonymous_login" />
                    </div>
                    <div className="registercomponent_btn">
                        <p>Vous pouvez vous inscrire pour sauvegarder votre compte.</p>
                        <LoginButton text="Inscrivez-vous !" className="back_to_register" onClick={() => setRoute('register')} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnonymousRegister;