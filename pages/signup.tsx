import useStore, { User } from "@/store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGetUserDets from "@/hooks/useGetUserDets";

const Signup = () => {
    // useGetUserDets();
    const [userData, setUserData] = useState({ username: '', password: '', picture: '' });
    const [loading, setloading] = useState(false);
    const [picLoading, setpicLoading] = useState(false);
    const { user, setUser } = useStore();
    const router = useRouter();

    const { username, password, picture } = userData;
    const url = process.env.NEXT_PUBLIC_API_URL as string;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { id, value } = e.target;
        setUserData((data) => ({...data, [id]: value.trim().toLowerCase() }));
    }

    const uploadPic: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        setpicLoading(true);
        const pic: FileList | null = e.target.files;
        
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
                    setUserData(user => ({ ...user, picture: data.secure_url }));
                    setpicLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setpicLoading(false);
                });
            }
        }
        
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setloading(true);
        if (!username || !password || !picture) return alert("Fill in all the fields");
        if (password.length < 6) return alert("Password should be at least 6 characters");

        const response = await fetch(`${url}users/register`, {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                'Content-type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            const user: User = await jwtDecode(data?.token);
            // localStorage.setItem('talkative-auth', JSON.stringify({...user, token: data?.token}));
            setUser({ ...user, token: data?.token });
            alert('Sign up successful');
            setloading(false);
            router.push('/chats');
        } else {
            alert(data.error);
            setloading(false);
        }
    };

  return (
    <div className="bg-sky-500 flex flex-col justify-center items-center h-screen w-full gap-2 bg-img">
        <header className="w-5/6 sm:w-4/6 md:w-8/12 lg:w-1/2 bg-white rounded-md">
            <h1 className="text-3xl text-center py-3">Talk-A-Tive</h1>
        </header>
        <main className="bg-white p-4 w-5/6 sm:w-4/6 md:w-8/12 lg:w-1/2 rounded-md">
            <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <label htmlFor="" className="font-medium">
                    Username
                    <input type="text" placeholder="Enter your name" id="username" value={username} onChange={handleChange} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-1" />
                </label>

                <label htmlFor="" className="font-medium">
                    Password
                    <input type="password" placeholder="Enter your password" id="password" value={password} onChange={handleChange} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-1" />
                </label>

                <label htmlFor="" className="font-medium">
                    Profile Picture
                    <input type="file" id="picture" onChange={uploadPic} required className="w-full bg-transparent placeholder:text-slate-300 border-slate-300 border-2 rounded-md px-3 py-2 outline-none leading-none mt-1" />
                </label>
                
                <button type="submit" onClick={handleSubmit} className="bg-blue-700 py-2 w-full rounded-md font-semibold text-white disabled:bg-blue-400" disabled={loading || picLoading}>
                    {loading ? "Loading..." : picLoading ? "Uploading pic" : "Sign Up"}
                </button>
            </form>

            <h3 className="text-center text-xl mt-4">Already have an account? <Link href="/login" className="text-blue-500 underline">Login</Link></h3>
        </main>
    </div>
  )
}

export default Signup