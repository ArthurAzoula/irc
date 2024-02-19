import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import ConversationList from '../components/ConversationList';
import SideBarMenu from '../components/SideBarMenu';
import Message from '../components/Message';
import UserListServer from '../components/UserListServer';
import { NavigateContext } from '../context/NavigateContext';
import './HomeScreen.css';
import { MenuIcon, UndoIcon } from 'lucide-react';
import { ChannelContext } from '../context/ChannelContext';

const HomeScreen = () => {
    const { user } = useContext(UserContext);
    const {setRoute} = useContext(NavigateContext);
    const {currentChannel, setCurrentChannel} = useContext(ChannelContext);
    const [showSidebar, setShowSidebar] = useState(false);
    
    const switchShowSidebar = () => {
        setShowSidebar(prevValue => !prevValue);
    }
    
    useEffect(() => {
        if (!user) {
            setRoute('login');
        }
    }, [user, setRoute]);

    return (
        <div className='homescreen_container'>
            {currentChannel?.category === 'public' ?
            <>
                {showSidebar ?
                <button className='homescreen_menu_close' onClick={switchShowSidebar}>
                    <UndoIcon />
                </button>
                : 
                <button className='homescreen_menu_burger' onClick={switchShowSidebar}>
                    <MenuIcon />
                </button>
                }
                <div className={`homescreen_sidebar_responsive ${showSidebar ? 'homescreen_sidebar_show' : ''}`}>
                    <SideBarMenu currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />
                    <UserListServer currentChannel={currentChannel} showSidebar={showSidebar} className={'homescreen_userlist_show'} />
                </div>
                <Message currentChannel={currentChannel} />
                <UserListServer currentChannel={currentChannel} className={'homescreen_userlist_hide'} />
            </>
            :
            <>
                {showSidebar ?
                <button className='homescreen_menu_close' onClick={switchShowSidebar}>
                    <UndoIcon />
                </button>
                : 
                <button className='homescreen_menu_burger' onClick={switchShowSidebar}>
                    <MenuIcon />
                </button>
                }
                <div className={`homescreen_sidebar_responsive ${showSidebar ? 'homescreen_sidebar_show' : ''}`}>
                    <SideBarMenu currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />
                    <ConversationList setCurrentChannel={setCurrentChannel} currentChannel={currentChannel} />
                </div>
                <Message currentChannel={currentChannel} />
            </> 
            }
        </div>
    );
};

export default HomeScreen;