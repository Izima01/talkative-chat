import React, { useEffect, useState } from 'react'
import ChatItem from './ChatItem'
import useStore from '@/store';
import GroupChatModal from './GroupChatModal';

type proptype = {
    loading: boolean
}

const ChatsList = (props: proptype) => {
    const { selectedChat, chats } = useStore();
    const [showGroup, setShowGroup] = useState(false);

    return (
        <aside className={`bg-white p-3 w-full md:w-5/12 md:flex gap-3 rounded-lg relative overflow-y-hidden border border-gray-600 flex-col items-center ${selectedChat._id ? 'hidden' : 'flex'}`}>
            <div className='w-full px-3 flex justify-between'>
                <h2 className='text-xl md:text-2xl'>My Chats</h2>
                <button className='py-1 px-3 bg-slate-300 rounded-md' onClick={() => setShowGroup(true)}>
                    New Group Chat +
                </button>
            </div>
            <section className='overflow-y-hidden w-full h-full rounded-lg bg-gray-100 flex flex-col items-stretch gap-2.5 p-2'>
                {
                    props.loading ? (
                        <>
                            <button className='w-full rounded-md loading h-14'></button>
                            <button className='w-full rounded-md loading h-14'></button>
                            <button className='w-full rounded-md loading h-14'></button>
                        </>
                    ) : chats?.map((chat: Record<string, any>) => (
                        <ChatItem key={chat._id} chat={chat} loading={props.loading} />
                    ))
                }
            </section>
            <GroupChatModal setShowGroup={setShowGroup} showGroup={showGroup} />
        </aside>
    )
}

export default ChatsList