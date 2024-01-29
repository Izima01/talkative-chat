import useStore, { emptyUser } from '@/store';
import React, { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5';

type propTypes ={
    setShowProfile: (val: boolean) => void;
    showProfile: boolean;
    profile?: Record<string, any>
}

const ProfileModal = (props: propTypes) => {
    const profileRef = useRef<HTMLDialogElement>(null);
    const { user, setUser } = useStore();

    const { setShowProfile, showProfile, profile } = props;

    useEffect(() => {
        if (showProfile) return profileRef?.current?.showModal();
        profileRef.current?.close();
    }, [showProfile]);

    return (
        <dialog id='profile' ref={profileRef}>
            <button className='absolute top-3 right-3' onClick={() => setShowProfile(false)}>
                <IoClose />
            </button>
            <img src={profile?.picture} className='rounded-full mx-auto object-fill w-36 h-36 mb-4' alt="profile" />
            <h3 className='text-xl font-medium capitalize text-center mb-4'>
                Username:
                <span> {profile?.username}</span>
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