import useGetUserDets from "@/hooks/useGetUserDets";
import useStore, { User } from "@/store";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface errInterface {
    success: false;
    error: string;
}

const SignIn = () => {
    useGetUserDets();
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);
    const url = process.env.NEXT_PUBLIC_API_URL as string;
    const { user, setUser } = useStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return alert("Fill in all the fields");
        if (password.length < 6) return alert("Password should be at least 6 characters");

        try {
            setloading(true);
            const response = await fetch(`${url}users/login`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            // console.log(data);
            if (data.success) {
                const user: User = await jwtDecode(data?.token);
                // localStorage.setItem('talkative-auth', JSON.stringify({...user, token: data?.token}));
                setUser({ ...user, token: data?.token });
                alert('Login successful');
                setloading(false);
                router.push('/chats');
            } else {
                alert(data.error);
                setloading(false);
            }
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <div className=" flex flex-col justify-center items-center h-screen w-full gap-2 overflow-y-clip bg-img">
            <header className="w-5/6 sm:w-4/6 md:w-8/12 lg:w-5/12 bg-white rounded-md z-10">
                <h1 className="text-3xl text-center py-3">Talk-A-Tive</h1>
            </header>
            <main className="bg-white p-4 w-5/6 sm:w-4/6 md:w-8/12 lg:w-5/12 rounded-md z-10">
                <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label htmlFor="" className="font-medium">
                        Username
                        <input type="text" placeholder="Enter your name" id="username" value={username} onChange={(e) => setusername(e.target.value)} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-1" />
                    </label>

                    <label htmlFor="" className="font-medium">
                        Password
                        <input type="password" placeholder="Enter your password" id="password" value={password} onChange={(e) => setpassword(e.target.value)} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-1" />
                    </label>
                    
                    <button onClick={handleSubmit} className="bg-blue-700 py-2 w-full rounded-md font-semibold text-white disabled:bg-blue-500" disabled={loading}>
                        {loading ? "Processing" : "Sign In"}
                    </button>
                </form>
                <h3 className="text-center text-xl mt-4">Don't have an account? <Link href="/signup" className="text-blue-500 underline">Register</Link></h3>
            </main>
        </div>
  )
}

export default SignIn