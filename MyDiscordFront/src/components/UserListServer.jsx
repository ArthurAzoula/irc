import { useState, useEffect } from 'react';
import userChannelService from '../service/user-channel.service';
import './UserListServer.css';

const UserListServer = ({currentChannel, showSidebar, className}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userChannelService.getUserChannelsByChannelId(currentChannel.id);
      if (response) {
        setUsers(response.data);
      }
    };

    fetchUsers();
  }, [currentChannel]);

  const admins = users.filter(user => user.isAdmin);
  const members = users.filter(user => !user.isAdmin);

  return (
    <div className={`userlistserver_container ${className}`}>
      <div className="userlistserver_container_sub">
        <h2 className="userlistserver_number_users">{users?.length > 1 ? "Utilisateurs" : "Utilisateur"} ({users?.length})</h2>
        <div className='userlistserver_scrollbar'>
          <div className="userlistserver_members">
            <h3>{admins?.length > 1 ? "Admins" : "Admin"} ({admins?.length})</h3>
            <div>
              {admins?.map((user, index) => (
                <div key={index} >
                  <img
                    src={user?.image || "https://via.placeholder.com/150"}
                    alt="user"
                  />
                  <span>{user?.nickname}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='userlistserver_members'>
            <h3>{members?.length > 1 ? "Membres" : "Membre"} ({members?.length})</h3>
            <div>
              {members?.map((user, index) => (
                <div key={index} >
                  <img
                    src={user?.image || "https://via.placeholder.com/150"}
                    alt="user"
                  />
                  <span>{user?.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListServer;
