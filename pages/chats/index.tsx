"use client"

import ChatHeader from '@/components/ChatHeader';
import ChatSpace from '@/components/ChatSpace';
import ChatsList from '@/components/ChatsList';
import useGetUserDets from '@/hooks/useGetUserDets';
import useStore from '@/store';
import { ClientToServerEvents, ServerToClientEvents } from '@/utils/types/socket.io-client';
import React, { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client';

let selectedChatCompare: string;
let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const Chats = () => {
  useGetUserDets();
  const url = process.env.NEXT_PUBLIC_API_URL as string;
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setmessagesLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState<Record<string, any>[]>([]);
  const { user, setUser, setChats, fetchAgain, setFetchAgain, selectedChat, chats } = useStore();
  const endpoint: string = url.replace('v1/', '');

  async function chatFetcher() {
    try {
      setLoading(true);
      const res = await fetch(`${url}chats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      // console.log(data);
      setChats(data?.allChats);
      setLoading(false);
    } catch (err) {
      alert('Error fetching data. Please reload');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user.token && !socketConnected) {
      socket = io(endpoint, {
        withCredentials: true,
        extraHeaders: {
          "Authorization": `Bearer ${user.token}`
        }
      });

      socket.emit('setup', user);
      socket.on("connection", () => {
        setSocketConnected(true);
        setUser({...user, isOnline: true});
      })
    }
  }, [user.userId]);

  const messagesFetcher = async () => {
    try {
      setmessagesLoading(true);
      const res = await fetch(`${url}messages?chatId=${selectedChat?._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      const data = await res?.json();
      setMessages(data?.messages);
      socket.emit("joinChat", selectedChat._id);
      setmessagesLoading(false);
    } catch(err) {
      setmessagesLoading(false);
      console.error(err);
    }
  }

  useEffect(() => {
    if(user.token && !chats.length) chatFetcher();
  }, [user.userId]);

  useEffect(() => {
    if (fetchAgain) {
      chatFetcher();
      setFetchAgain(false);
    };
  }, [fetchAgain]);

  useEffect(() => {
    selectedChatCompare = selectedChat._id;
    selectedChat?._id && messagesFetcher();
  }, [selectedChat]);

  return (
    <div className='w-full h-screen bg-img flex flex-col justify-stretch items-stretch overflow-hidden'>
      <ChatHeader />
      <main className='p-3 flex gap-3 h-[91vh]'>
        <ChatsList socketConnected={socketConnected} loading={loading} socket={socket} />
        <ChatSpace socket={socket} messageLoading={messagesLoading} messages={messages} selectedChatCompare={selectedChatCompare} socketConnected={socketConnected} setMessages={setMessages} />
      </main>
    </div>
  )
}

export default Chats