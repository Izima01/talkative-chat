const uploadPic: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    // setpicLoading(true);
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
                return data.secure_url
                // setUserData(user => ({ ...user, picture: data.secure_url }));
                // setpicLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
    
};