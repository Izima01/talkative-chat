import useStore from "@/store";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import UserBox from "./UserBox";

type propTypes ={
    setShowGroup: (val: boolean) => void;
    showGroup: boolean;
}

const UpdateGroupChatModal = (props: propTypes) => {
    const groupRef = useRef<HTMLDialogElement>(null);
    const { setShowGroup, showGroup } = props;
    const [groupName, setgroupName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const { user, chats, setChats, fetchAgain, setFetchAgain, selectedChat, setSelectedChat } = useStore();
    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const handleSearch = async (val: string) => {
        setSearch(val);
        if (!val) return setSearchResult([]);

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

    useEffect(() => {
        if (showGroup) return groupRef?.current?.showModal();
        groupRef.current?.close();
    }, [showGroup]);

    const handleAdder = async(userToAdd: Record<string, any>) => {
        try {
            setloading(true);
            const res = await fetch(`${url}chats/add-to-group`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    user: userToAdd._id, chatId: selectedChat._id
                })
            });
            const data = await res?.json();
            if (!data.success) return alert(data.error);
            setSelectedChat(data?.updatedChat);
            alert(`${userToAdd.username} added`);
        } catch(err) {
            console.log(err);
        } finally {
            setloading(false);
            setSearch('');
        }
    }

    const renameGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupName) return alert('Input a group name');

        try {
            setRenameLoading(true);
            const res = await fetch(`${url}chats/rename-group`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    newName: groupName, chatId: selectedChat._id
                })
            });
            const data = await res?.json();
            if (!data.success) return alert(data.error);
            setSelectedChat(data?.updatedChat);
            alert('Renamed successfully');
            setShowGroup(false);
            setFetchAgain(true);
        } catch(err) {
            console.log(err);
            alert(err);
        } finally {
            setRenameLoading(false);
        }
    }
    
    const handleRemove = async(userToRemove: Record<string, any>) => {
        try {
            setloading(true);
            const res = await fetch(`${url}chats/remove-from-group`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    user: userToRemove._id, chatId: selectedChat._id
                })
            });
            const data = await res?.json();
            if (!data.success) return alert(data.error);
            userToRemove._id == user.userId ? setSelectedChat({ _id: '' }) : setSelectedChat(data?.updatedChat);
            alert(`${userToRemove.username} removed`);
        } catch(err) {
            console.log(err);
        } finally {
            setloading(false);
            setSearch('');
        }
    }

    return (
        <dialog id='profile' ref={groupRef}>
            <button className='absolute top-3 right-3' onClick={() => setShowGroup(false)}>
                <IoClose size={24} />
            </button>
            <h3 className='text-xl font-medium capitalize text-center mb-3'>
                {selectedChat.chatName}
            </h3>

            <div className="flex flex-wrap w-full gap-1 m-2">
                {
                    selectedChat?.users?.map((user: Record<string, any>) => (
                        <div key={user._id} className="px-2 rounded-md bg-blue-500 hover:bg-blue-600 capitalize leading-normal cursor-pointer flex items-center text-white">
                            {user.username}
                            <button className='ml-2' onClick={() => handleRemove(user)}>
                                <IoClose />
                            </button>
                        </div>
                    ))
                }
            </div>

            <form>
                <div className="w-full flex items-stretch gap-1">
                    <input type="text" placeholder="Chat name" value={groupName} onChange={(e) => setgroupName(e.target.value)} className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-1 outline-none leading-none" />
                    <button onClick={(e) => renameGroup(e)} className="bg-teal-400 hover:bg-teal-500 rounded-md px-2 text-white">{renameloading ? "Updating" :"Update"}</button>
                </div>
                <input type="text" placeholder="Add users" value={search} onChange={(e) => handleSearch(e.target.value)} className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-1 outline-none leading-none mt-2" />
            </form>

            <div className="flex flex-col w-full gap-2 mt-2">
                {
                    loading ? <p>Loading...</p> : (
                        searchResult?.slice(0,4)?.map((user: Record<string, any>) => (
                            <UserBox name={user.username} id={user._id} key={user._id} handleClick={() => handleAdder(user)} picture={user.picture} isOnline={user.isOnline} />
                        ))
                    )
                }
            </div>

            {/* <button className="bg-blue-600 rounded-md px-4 py-1 mt-2 text-white font-semibold" onClick={handleSubmit}>
                Create
            </button> */}
        </dialog>
    )
}

export default UpdateGroupChatModal