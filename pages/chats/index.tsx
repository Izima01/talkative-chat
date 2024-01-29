import ChatHeader from '@/components/ChatHeader';
import ChatSpace from '@/components/ChatSpace';
import ChatsList from '@/components/ChatsList';
import useGetUserDets from '@/hooks/useGetUserDets';
import useStore from '@/store';
import React, { useEffect, useState } from 'react'

const Chats = () => {
  useGetUserDets();
  const url = process.env.NEXT_PUBLIC_API_URL as string;
  const [loading, setLoading] = useState(false);
  const { user, setChats, chats, fetchAgain, setFetchAgain } = useStore();

  async function fetcher() {
    try {
      setLoading(true);
      const res = await fetch(`${url}chats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res?.json();
      setChats(data?.allChats);
      setLoading(false);
    } catch (err) {
      alert('Error fetching data. Please reload');
      setLoading(false);
    }
  }

  useEffect(() => {
    if(user?.token && chats?.length == 0) fetcher();
    if (fetchAgain) {
      fetcher()
      setFetchAgain(false);
    };
  }, [user, chats, fetchAgain]);

  return (
    <div className='w-full h-screen bg-img flex flex-col justify-stretch items-stretch overflow-hidden'>
      <ChatHeader />
      <main className='p-3 flex gap-3 h-[91vh]'>
        <ChatsList loading={loading} />
        <ChatSpace />
      </main>
    </div>
  )
}

export default Chats