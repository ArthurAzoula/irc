import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import SideBarMenu from '../components/SideBarMenu';
import ProfileUser from '../components/ProfileUser';
import './ProfileScreen.css';
import { NavigateContext } from '../context/NavigateContext';
import { ChannelContext } from '../context/ChannelContext';

const ProfileScreen = () => {
    const { user } = useContext(UserContext);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const {setRoute} = useContext(NavigateContext);
    const {currentChannel, setCurrentChannel} = useContext(ChannelContext);

    useEffect(() => {
        if (!user) {
            setRoute('login');
        } else {
            if (user.isAnonymous) {
                setIsAnonymous(true);
            }        
        }
    }, [user, setRoute]);

    return (
        <div className='profilescreen'>
            <SideBarMenu currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />
            <ProfileUser isAnonymous={isAnonymous} />
        </div>
    );
};

export default ProfileScreen;