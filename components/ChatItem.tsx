import useStore from "@/store"
import { getSender } from "@/utils/chatLogic";

type chatProps = {
    chat: Record<string, any>,
    loading: boolean
}

const ChatItem = (props: chatProps) => {
    const { setSelectedChat, user, selectedChat } = useStore();
    const { chatName, latestMessage, isGroupChat, users, _id } = props.chat;

  return (
    <button
        className={`${selectedChat._id == _id ? 'bg-blue-500 text-white' : 'bg-gray-300'} w-full p-2 rounded-md text-left`}
        onClick={() => {
            setSelectedChat(props.chat);
        }}
    >
        <p className="font-medium capitalize text-lg leading-none">{isGroupChat ? chatName : getSender(user, users)}</p>
            {
                latestMessage ? (
                    <p>
                        <span className="font-bold capitalize leading-none">{latestMessage.sender.username}: </span>
                        {latestMessage.content}
                    </p>
                ) : (
                    <p>No messages yet</p>
                )
            }
    </button>
  )
}

export default ChatItem