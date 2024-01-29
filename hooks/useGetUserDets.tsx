import useStore from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

const useGetUserDets = () => {
    const { setUser, user } = useStore();
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('talkative-auth');
        if (userStr && !user.username) {
            setUser(JSON.parse(userStr));
            router.push('/chats');
        } else if (user.username) {
            localStorage.setItem('talkative-auth', JSON.stringify(user));
        } else {
            router.push('login');
        }
    }, [user]);
}

export default useGetUserDets