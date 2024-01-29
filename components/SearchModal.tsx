import useStore from '@/store';
import React, { useState } from 'react'
import UserBox from './UserBox';
import { IoClose } from 'react-icons/io5';

type propsss = {
    showSearcher: boolean;
    setShowSearcher: (val: boolean) => void;
    accessChat: (val: string) => void;
    loadingChat: boolean;
}

const SearchModal = (props: propsss) => {
    const [loading, setloading] = useState(false);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const { user } = useStore();

    const { showSearcher, setShowSearcher, accessChat, loadingChat } = props;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!search) return alert('Enter a search term');

        try {
            setloading(true);
            const res = await fetch(`${url}users?search=${search}`, {
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

    return (
        <section id="searcher" className={`w-full h-screen left-0 top-0 bottom-0 fixed z-10 transition duration-300 ease-in ${showSearcher ? 'translate-y-0' : '-translate-y-full'}`}>
            <div id="box" className="bg-white backdrop:bg-[rgba(0,0,0,0.1)] w-72 p-4 h-full">
                <div className='w-full flex justify-between items-center mb-3'>
                    <h3 className="text-2xl font-semibold">Search Users</h3>
                    <button onClick={() => setShowSearcher(false)}>
                        <IoClose />
                    </button>
                </div>
                <hr />
                <form className="flex gap-2 items-stretch w-full my-2" onSubmit={(e) => handleSearch(e)}>
                    <input type="search" className="w-10/12 rounded-md border border-slate-200 outline-none bg-slate-50 placeholder:text-slate-600 text-slate-600 pl-2" placeholder="Search User" onChange={(e) => setSearch(e.target.value)} />
                    <button
                        className="px-2 py-1.5 bg-slate-200 rounded-md border border-slate-200"
                        onClick={(e) => handleSearch(e)}
                    >Go</button>
                </form>
                <section className="w-full flex flex-col gap-2">
                    {
                        loading ? (
                            <>
                                <button className='w-full rounded-md loading h-14'></button>
                                <button className='w-full rounded-md loading h-14'></button>
                                <button className='w-full rounded-md loading h-14'></button>
                            </>
                        ) : searchResult.length==0 ? 'No Users found' : searchResult.map((res: Record<string, any>) => (
                            <UserBox key={res._id} id={res._id} isOnline={res.isOnline} name={res.username} picture={res.picture} handleClick={() => accessChat(res._id)} />
                        ))
                    }
                    {
                        loadingChat ? 'Chat loading' : ''
                    }
                </section>
            </div>
        </section>
    )
}

export default SearchModal