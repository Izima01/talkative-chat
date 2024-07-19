import useStore from "@/store";
import { useState } from "react";
import { FaBell, FaAngleDown } from "react-icons/fa";
import SearchModal from "./SearchModal";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";

const ChatHeader = () => {
    const { user, setSelectedChat, chats, setChats, notifications } = useStore();
    const [showSearcher, setShowSearcher] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const accessChat: (id: string) => Promise<void> = async(id) => {
        try {
            setLoadingChat(true);
            const res = await fetch(`${url}chats?receiver=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await res.json();

            if (!chats?.find((c) => c._id === data.chat._id)) setChats([data.chat, ...chats]);
            setSelectedChat(data.chat);
        } catch(err) {
            console.log(err);
        } finally {
            setLoadingChat(false);
            setShowSearcher(false);
        }
    }

    return (
        <header className='w-full bg-white border-2 md:border-4 border-gray-400 py-1.5 px-3 md:px-6 flex justify-between items-center relative'>
            <button className='bg-slate-100 text-slate-700 font-medium px-2.5 md:px-5 md:py-1 rounded-md text-left w-32 md:w-72 outline-none' onClick={() => setShowSearcher(true)}>Search user</button>
            <h1 className="md:text-3xl text-xl text-center">Talk-A-Tive</h1>
            <div className='flex gap-3 md:gap-5 items-center'>
                <button onClick={() => setShowNotif((prev) => !prev)} className="relative">
                    <FaBell size={24} />
                    {
                        notifications.length ?
                        <p className="bg-red-500 px-1 absolute -top-1.5 -right-1.5 rounded-xl text-xs text-white">
                            {notifications.length}
                        </p> : ""
                    }
                </button>
                <button
                    className='flex justify-center items-center'
                    onClick={() => {
                        setShowProfile(true);
                    }}
                >
                    <img src={user.picture} className='rounded-full object-fill w-7 h-7' width={22} height={22} alt="My profile" />
                    <FaAngleDown className='ease-in-out transition duration-500 pl-2' />
                </button>
            </div>
            
            <NotificationModal showNotif={showNotif} setShowNotif={setShowNotif} />
            <ProfileModal setShowProfile={setShowProfile} showProfile={showProfile} profile={user} />
            <SearchModal showSearcher={showSearcher} setShowSearcher={setShowSearcher} accessChat={accessChat} loadingChat={loadingChat} />
        </header>
    )
}

export default ChatHeader
