import useStore from '@/store';
import React, { useState } from 'react'
import UserBox from './UserBox';
import { IoClose } from 'react-icons/io5';
import Spinner from './Spinner';

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

    const handleSearch = async (val: string) => {
        setSearch(val);
        // if (!val) return;

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

    return (
        <section id="searcher" className={`w-full h-screen left-0 top-0 bottom-0 fixed z-10 transition duration-300 ease-in ${showSearcher ? 'translate-y-0' : '-translate-y-full'}`}>
            <div id="box" className="bg-white backdrop:bg-[rgba(0,0,0,0.1)] w-72 p-4 h-screen flex flex-col justify-normal">
                <div className='w-full flex justify-between items-center mb-3'>
                    <h3 className="text-2xl font-semibold">Search Users</h3>
                    <button onClick={() => setShowSearcher(false)}>
                        <IoClose />
                    </button>
                </div>
                <input
                    type="search"
                    className="w-full my-2 py-2 rounded-md border border-slate-200 outline-none bg-slate-50 placeholder:text-slate-600 text-slate-600 pl-2"
                    placeholder="Search User"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <section className="w-full flex flex-col gap-2 overflow-y-scroll scroll">
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
                        loadingChat ? <Spinner /> : ''
                    }
                </section>
            </div>
        </section>
    )
}

export default SearchModal