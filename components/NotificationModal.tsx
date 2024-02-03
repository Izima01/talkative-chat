import useStore from "@/store";

type propTypes ={
    setShowNotif: (val: boolean) => void;
    showNotif: boolean;
}

const NotificationModal = (props: propTypes) => {
    const { setShowNotif, showNotif } = props;
    const { notifications, setNotifications, setSelectedChat, user } = useStore();

    return (
        <div id='profile' className={`${showNotif ? 'block' : 'hidden'} absolute top-11 right-8 bg-white shadow-md rounded-md p-2 z-10`}>
            <div className="flex flex-col gap-2">
                {
                    !notifications.length ? 'No notifications now'
                    : notifications.map(notif => (
                        <button
                            key={notif.reason + notif._id+notif.chat._id}
                            className="bg-slate-100 hover:bg-slate-200 rounded-sm px-2 py-1 text-left"
                            onClick={() => {
                                setSelectedChat(notif.chat);
                                setNotifications(notifications.filter((n: Record<string, any>) => n !== notif));
                                setShowNotif(false);
                            }}
                        >
                            {
                                notif.reason === "new message"
                                ? `New message from ${notif.chat.isGroupChat ? notif.chat.chatName : notif.sender.username}`
                                : `You just got added to ${notif.chat.chatName}`
                            }
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default NotificationModal