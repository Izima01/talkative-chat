import useStore from "@/store";
import { getSender, getSenderFull } from "@/utils/chatLogic";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaEye } from "react-icons/fa6";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Spinner from "./Spinner";
import ScrollableChat from "./ScrollableChat";

type propType = {
    messages: Record<string, any>[];
    messageLoading: boolean;
    setMessages: (msg: Record<string, any>[]) => void;
    selectedChatCompare: string;
    socketConnected: boolean;
}

const ChatSpace = (props: propType) => {
    const { user, selectedChat, setSelectedChat, setFetchAgain, setNotifications, notifications, socket } = useStore();
    const toneRef = useRef<HTMLAudioElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [whoIsTyping, setwhoIsTyping] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const [typing, setTyping] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const { isGroupChat, chatName, users  } = selectedChat;
    const { messageLoading, messages, setMessages, selectedChatCompare, socketConnected } = props;
    const [selectedUser, setSelectedUser] = useState<Record<string, any>>({});

    const sendMessage = async (e: React.KeyboardEvent) => {
        if (e.key == 'Enter' && newMessage) {
            try {
                socket && socket.emit("stopTyping", selectedChat._id);
                const res = await fetch(`${url}messages/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ content: newMessage, chatId: selectedChat._id })
                });
                const data = await res.json();
                if (!data.success) return alert (data.error);
                setNewMessage("");
                socket && socket.emit("newMessage", data?.message);
                setMessages([...messages, data?.message]);
                setFetchAgain(true);
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    useEffect(() => {
        socketConnected && socket && socket.on('typing', (username) => setwhoIsTyping(username));
        socketConnected && socket && socket.on('stopTyping', () => setwhoIsTyping(''));

        socketConnected && socket && socket.on("messageRecieved", (newMessage: Record<string, any>) => {
            if (!selectedChatCompare || selectedChatCompare !== newMessage.chat._id) {
                if (!notifications.find(notif => notif.chat._id == newMessage.chat._id)) {
                    setNotifications([...notifications, {...newMessage, reason: "new message" }]);
                }
            } else {
                setMessages([...messages, newMessage]);
            }
        })
    });

    const handleTyping = (val: string) => {
        setNewMessage(val);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket && socket.emit("typing", selectedChat._id, user.username);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 2400;

        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket && socket.emit("stopTyping", selectedChat._id);
                setTyping(false);
            } 
        }, timerLength);
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
                                messageLoading ? <Spinner />
                                : messages?.length == 0 ? (
                                    <div className="flex flex-col overflow-y-scroll text-2xl justify-center items-center messages mb-10">
                                        No messages yet
                                    </div>
                                ) : (
                                    <div className="flex flex-col overflow-y-scroll scroll">
                                        <ScrollableChat messages={messages} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
                                    </div>
                                )
                            }
                            {whoIsTyping ? <p className="first-letter:capitalize text-gray-700 -mb-2">{`${whoIsTyping} is typing...`}</p> : ''}
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
