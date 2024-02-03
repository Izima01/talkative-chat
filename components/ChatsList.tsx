import React, { useState } from 'react'
import ChatItem from './ChatItem'
import useStore from '@/store';
import GroupChatModal from './GroupChatModal';
import { FaPlus } from "react-icons/fa6";
import { ClientToServerEvents, ServerToClientEvents } from '@/utils/types/socket.io-client';
import { Socket } from 'socket.io-client';

type proptype = {
    loading: boolean;
    socketConnected: boolean;
    socket: Socket<ServerToClientEvents, ClientToServerEvents>;
}

const ChatsList = (props: proptype) => {
    const { selectedChat, chats } = useStore();
    const [showGroup, setShowGroup] = useState(false);

    return (
        <aside className={`bg-white p-3 w-full md:w-5/12 md:flex gap-3 rounded-lg relative overflow-y-hidden border border-gray-600 flex-col items-center ${selectedChat._id ? 'hidden' : 'flex'}`}>
            <div className='w-full px-3 flex justify-between'>
                <h2 className='text-xl md:text-2xl'>My Chats</h2>
                <button className='py-1 px-3 bg-slate-300 rounded-md flex gap-3 items-center' onClick={() => setShowGroup(true)}>
                    New Group Chat
                    <FaPlus />
                </button>
            </div>
            <div className='w-full h-full rounded-lg bg-gray-100 flex flex-col overflow-y-scroll scroll gap-2.5 p-2'>
                {
                    props.loading ? (
                        <>
                            <button className='w-full rounded-md loading h-14'></button>
                            <button className='w-full rounded-md loading h-14'></button>
                            <button className='w-full rounded-md loading h-14'></button>
                        </>
                    ) : !chats?.length ? 'No chats yet. You can search for a user'
                    : chats?.map((chat: Record<string, any>) => (
                        <ChatItem key={chat._id} chat={chat} loading={props.loading} />
                    ))
                }
            </div>
            <GroupChatModal socket={props.socket} socketConnected={props.socketConnected} setShowGroup={setShowGroup} showGroup={showGroup} />
        </aside>
    )
}

export default ChatsList