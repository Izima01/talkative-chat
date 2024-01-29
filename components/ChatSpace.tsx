import useStore from "@/store";
import { getSender, getSenderFull } from "@/utils/chatLogic";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaEye } from "react-icons/fa6";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Spinner from "./Spinner";
import ScrollableChat from "./ScrollableChat";

const ChatSpace = () => {
    const { user, setUser, setChats, selectedChat, setSelectedChat, setFetchAgain } = useStore();
    const [loading, setloading] = useState(false);
    const [messages, setMessages] = useState<Record<string, any>[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const { isGroupChat, chatName, users,  } = selectedChat;

    const messagesFetcher = async () => {
        try {
            setloading(true);
            const res = await fetch(`${url}messages?chatId=${selectedChat._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            });
            const data = await res?.json();
            // console.log(data);
            setMessages(data?.messages);
            setSelectedChat(data?.chat);
            setloading(false);
        } catch(err) {
            setloading(false);
            console.log(err);
        }
    }

    const sendMessage = async (e: React.KeyboardEvent) => {
        if (e.key == 'Enter' && newMessage) {
            try {
                setNewMessage("");
                const res = await fetch(`${url}messages/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ content: newMessage, chatId: selectedChat._id })
                });
                const data = await res?.json();
                // console.log(data);
                if (!data.success) return alert (data.error);
                setMessages([...messages, data?.message]);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleTyping = (val: string) => {
        setNewMessage(val);
    }

    return (
        <section className={`w-full md:w-7/12 md:flex bg-white p-3 rounded-lg relative border border-gray-600 flex-col gap-3 items-center ${selectedChat._id ? 'flex' : 'hidden'}`}>
            {
                !selectedChat._id ? (
                <div className="h-full w-full flex justify-center items-center">
                    <h3 className="text-2xl">Click on a user to start chatting</h3>
                </div>
                    ) : (
                    <>
                        <div className='w-full px-1.5 flex justify-between items-center'>
                            <button className="bg-slate-200 p-2 rounded-md md:hidden" onClick={() => setSelectedChat({_id: ''})}>
                                <FaArrowLeft />
                            </button>
                            <h2 className='text-xl md:text-2xl font-normal capitalize'>{isGroupChat ? chatName : getSender(user, users)}</h2>
                            <button className="bg-slate-200 p-2 rounded-md" onClick={() => {
                                isGroupChat ? setShowGroup(true) : setShowProfile(true)}}>
                                <FaEye />
                            </button>
                        </div>
                        <section className='h-full w-full rounded-lg bg-gray-100 flex flex-col justify-end gap-2.5 p-3 overflow-y-hidden'>
                            {
                                loading ? <Spinner /> : messages.length == 0 ? (
                                    <div className="flex flex-col overflow-y-scroll text-2xl justify-center items-center messages mb-10">
                                        No messages yet
                                    </div>
                                ) : (<div className="flex flex-col overflow-y-scroll messages">
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }
                            <input type="text" placeholder="Enter a message..." onKeyDown={sendMessage} onChange={(e) => handleTyping(e.target.value)} className=" bg-[#e0e0e0] px-3 py-1 w-full rounded-md" value={newMessage} />
                        </section>
                    </>
                )
            }
            {
                isGroupChat ? <UpdateGroupChatModal setShowGroup={setShowGroup} showGroup={showGroup} /> : <ProfileModal profile={getSenderFull(user, users)} setShowProfile={setShowProfile} showProfile={showProfile} />
            }
        </section>
    )
}

export default ChatSpace
