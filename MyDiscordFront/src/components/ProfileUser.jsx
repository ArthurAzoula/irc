import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Edit, Trash, LogOut, Save } from "lucide-react";
import "./ProfileUser.css";
import { NavigateContext } from "../context/NavigateContext";
import anonymousService from "../service/anonymous.service";
import accountService from "../service/account.service";

const ProfileUser = ({ isAnonymous }) => {
  const { setRoute } = useContext(NavigateContext);
  const { user, reload, logout } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await reload();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const logoutClick = () => {
    try {
      logout();
      setRoute("login");
    } catch (err) {
      console.error("Error while deconnecting : ", err);
    }
  };

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleDelete = async () => {
    try {
      if (user.isAnonymous) {
        await anonymousService.deleteAnonymous(user.id);
      } else {
        await accountService.deleteAccount(user.id);
      }
      logout();
      setRoute("login");
    } catch (error) {
      console.error("Error while deleting user:", error);
    }
  };

  return (
    <div className="profileuser_container">
      {user ? (
        <div className="profileuser_loaded_container">
          <div className="profileuser_header">
            <button
              data-tooltip-content={"Se déconnecter"}
              data-tooltip-id={"react-tooltip"}
              onClick={logoutClick}
            >
              <LogOut stroke="red" />
            </button>
          </div>
          <img
            className="profileuser_img"
            src={
              isAnonymous
                ? "https://via.placeholder.com/150"
                : user.image || "https://via.placeholder.com/150"
            }
            alt="Profile"
          />
          <div className="profileuser_loaded_container_sub font-regular">
            {isAnonymous ? (
              <p>{user.nickname}</p>
            ) : (
              <>
                <h1>
                  {user.firstName} {user.lastName}
                </h1>
                <p>{user.email}</p>
                <p>{user.nickname}</p>
                <p>
                  Compte créé le :{" "}
                  {new Date(user.createdAt).toLocaleDateString("fr")}
                </p>
              </>
            )}
          </div>
          {!isAnonymous && (
            <div className="profileuser_user_container">
              <button
                className={`profileuser_user_button_edit ${
                  editing
                    ? "profileuser_user_button_edit_editing"
                    : "profileuser_user_button_edit_not_editing"
                }`}
                onClick={handleEdit}
                disabled={editing}
              >
                <Edit size={20} className="profileuser_user_button_icon" />{" "}
                Modifier
              </button>
              <button
                className={`profileuser_user_button_delete ${
                  editing
                    ? "profileuser_user_button_delete_editing"
                    : "profileuser_user_button_delete_not_editing"
                }`}
                onClick={handleDelete}
                disabled={editing}
              >
                <Trash size={20} className="profileuser_user_button_icon" />{" "}
                Supprimer mon compte
              </button>
            </div>
          )}
          {editing && (
            <div className="profileuser_editing_container">
              <input
                type="text"
                defaultValue={user.firstName}
                placeholder="Prénom"
              />
              <input
                type="text"
                defaultValue={user.lastName}
                placeholder="Nom"
              />
              <input
                type="email"
                defaultValue={user.email}
                placeholder="Email"
              />
              <input
                type="text"
                defaultValue={user.nickname}
                placeholder="Pseudo"
              />
              <button onClick={handleEdit}>
                <div>
                  <Save size={20} className="profileuser_user_button_icon" />
                  Enregistrer
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="profileuser_loading">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
