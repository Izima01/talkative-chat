import useStore from "@/store";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import UserBox from "./UserBox";
import { ClientToServerEvents, ServerToClientEvents } from '@/utils/types/socket.io-client';
import { Socket } from 'socket.io-client';

type propTypes ={
    showGroup: boolean;
    socketConnected: boolean;
    setShowGroup: (val: boolean) => void;
}

const GroupChatModal = (props: propTypes) => {
    const groupRef = useRef<HTMLDialogElement>(null);
    const { setShowGroup, showGroup, socketConnected } = props;
    const [groupName, setgroupName] = useState('');
    const [selectedUsers, setselectedUsers] = useState<Record<string, any>[]>([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const { user, chats, setChats, socket } = useStore();
    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const handleSearch = async (val: string) => {
        setSearch(val);
        if (!val) return;

        try {
            setloading(true);
            const res = await fetch(`${url}users?search=${val}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await res.json();
            setSearchResult(data);
        } catch(err) {
            console.log(err);
            alert(err);
        } finally {
            setloading(false);
        }
    }
    
    const handleSubmit = async () => {
        if (!groupName) return alert('No group name');
        if (selectedUsers.length < 2) return alert('Add more users');

        try {
            setloading(true);
            const res = await fetch(`${url}chats/new-group`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    chatName: groupName,
                    users: JSON.stringify(selectedUsers.map(u => u._id))
                })
            });
            const data = await res?.json();
            setChats([data, ...chats]);
            (socketConnected && socket) && socket.emit("newGroup", data);
            setShowGroup(false);
        } catch(err) {
            console.log(err);
            alert(err);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (showGroup) return groupRef?.current?.showModal();
        groupRef.current?.close();
    }, [showGroup]);

    const handleAdder = (userToAdd: Record<string, any>) => {
        if (selectedUsers.find(user => user._id == userToAdd._id)) return alert('User added already');
        setselectedUsers([...selectedUsers, userToAdd]);
    }
    
    const handleRemove = (userToRemove: Record<string, any>) => {
        setselectedUsers(selectedUsers.filter((user) => user._id !== userToRemove._id));
    }

    return (
        <dialog id='profile' ref={groupRef}>
            <button className='absolute top-3 right-3' onClick={() => setShowGroup(false)}>
                <IoClose size={24} />
            </button>
            <h3 className='text-xl font-medium capitalize text-center mb-3'>
                Create Group Chat
            </h3>
            <form>
                <input type="text" placeholder="Chat name" value={groupName} onChange={(e) => setgroupName(e.target.value)} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none" />
                <input type="text" placeholder="Add users" value={search} onChange={(e) => handleSearch(e.target.value)} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-2" />
            </form>

            <div className="flex flex-wrap w-full gap-1 my-2">
                {
                    selectedUsers?.map((user: Record<string, any>) => (
                        <div key={user._id} className="px-2 rounded-md bg-blue-500 hover:bg-blue-600 capitalize leading-normal cursor-pointer flex items-center text-white">
                            {user.username}
                            <button className='ml-2' onClick={() => handleRemove(user)}>
                                <IoClose />
                            </button>
                        </div>
                    ))
                }
            </div>

            <div className="flex flex-col w-full gap-2 mt-1">
                {
                    loading ? <p>Loading...</p> : (
                        searchResult?.map((user: Record<string, any>) => (
                            <UserBox name={user.username} id={user._id} key={user._id} handleClick={() => handleAdder(user)} picture={user.picture} isOnline={user.isOnline} />
                        ))
                    )
                }
            </div>

            <button className="bg-blue-600 rounded-md px-4 py-1 mt-2 text-white font-semibold" onClick={handleSubmit}>
                Create
            </button>
        </dialog>
    )
}

export default GroupChatModal