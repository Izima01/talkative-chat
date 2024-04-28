import useStore, { emptyUser } from '@/store';
import React, { useEffect, useRef, useState } from 'react'
import { FaCamera } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import Spinner from './Spinner';

type propTypes ={
    setShowProfile: (val: boolean) => void;
    showProfile: boolean;
    profile?: Record<string, any>
}

const ProfileModal = (props: propTypes) => {
    const { user, setUser } = useStore();
    const profileRef = useRef<HTMLDialogElement>(null);
    const [picLoading, setpicLoading] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const { setShowProfile, showProfile, profile } = props;

    useEffect(() => {
        if (showProfile) return profileRef?.current?.showModal();
        profileRef.current?.close();
    }, [showProfile]);

    const editProfile = async (pic: string) => {
        try {
            const res = await fetch(`${url}users/edit/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    picture: pic
                })
            });

            const data = await res.json();
            console.log(data.updatedUser);
            setpicLoading(false);
        } catch(err) {
            console.log(err);
            setpicLoading(false);
        }
    }

    const uploadPic: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        setpicLoading(true);
        const pic: FileList | null = e.target.files;

        try {
            if (pic != null) {
                if (pic[0].type === "image/jpeg" || "image/png") {
                    const data = new FormData();
                    data.append("file", pic[0]);
                    data.append("upload_preset", "talkative-app");
                    data.append("cloud_name", "izima-cloudinary");
    
                    fetch("https://api.cloudinary.com/v1_1/izima-cloudinary/image/upload", {
                        method: "POST",
                        body: data
                    })
                    .then(res => res.json())
                    .then(data => {
                        editProfile(data.secure_url);
                        setUser({...user, picture: data.secure_url});
                    });
                }
            }
        } catch(err) {
            console.log(err);
            setpicLoading(false);
        }  
    };

    return (
        <dialog id='profile' ref={profileRef}>
            <button className='absolute top-3 right-3' onClick={() => setShowProfile(false)}>
                <IoClose />
            </button>
            <div className='w-40 h-40 mx-auto relative'>
                <img src={profile?.picture} className='rounded-full w-full h-full' alt="profile" />
                {
                    picLoading && <div className='w-full bg-slate-600 bg-opacity-35 absolute inset-0 rounded-full flex justify-center items-center'>
                        <Spinner />
                    </div>
                }
                {
                    profile?.userId === user.userId && (
                        <div className='absolute bottom-2 right-2'>
                            <input type="file" id="fileInput" className='hidden' onChange={uploadPic} disabled={picLoading} />
                            <label htmlFor="fileInput" className='cursor-pointer bg-green-700 w-9 h-9 rounded-full flex justify-center items-center'>
                                <FaCamera fill='white' size={20} />
                            </label>
                        </div>
                    )
                }

            </div>
            <h3 className='text-lg capitalize text-center my-4'>
                Username: 
                <span className='text-xl font-bold'> {profile?.username}</span>
            </h3>
            {
                profile?.username == user?.username ? (
                    <button
                        className='py-1 px-3 rounded-md hover:bg-gray-300 bg-gray-200 text-left '
                        onClick={() => {
                            localStorage.removeItem('talkative-auth');
                            setUser(emptyUser);
                        }}
                    >
                        Logout
                    </button>
                ) : <></>
            }
        </dialog>
    )
}

export default ProfileModal