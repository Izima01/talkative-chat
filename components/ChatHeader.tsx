import useStore, { emptyUser } from "@/store";
import { SyntheticEvent, useRef, useState } from "react";
import { FaBell, FaAngleDown } from "react-icons/fa";
import UserBox from "./UserBox";
import SearchModal from "./SearchModal";
import ProfileModal from "./ProfileModal";

const ChatHeader = () => {
    const { user, setSelectedChat, chats, setChats } = useStore();
    // const picModalRef = useRef<HTMLDialogElement>(null);
    const [showSearcher, setShowSearcher] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    
    // const [search, setSearch] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const accessChat: (id: string) => void = async(id) => {
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
            <div className='flex gap-3 md:gap-5 items-center relative'>
                <button>
                    <FaBell className="w-4 md:w-6" />
                </button>
                <button
                    className='flex justify-center items-center'
                    onClick={() => {
                        setShowProfile(true);
                    }}
                >
                    <img src={user.picture} className='rounded-full object-fill md:w-8 w-5 md:h-8 h-5' width={22} height={22} alt="My profile" />
                    <FaAngleDown className='ease-in-out transition duration-500 pl-2' />
                </button>
            </div>
            
            <ProfileModal setShowProfile={setShowProfile} showProfile={showProfile} profile={user} />
            <SearchModal showSearcher={showSearcher} setShowSearcher={setShowSearcher} accessChat={accessChat} loadingChat={loadingChat} />
        </header>
    )
}

export default ChatHeader