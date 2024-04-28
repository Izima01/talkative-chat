import ScrollableFeed from 'react-scrollable-feed';
import { getSenderFull, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../utils/chatLogic'
import useStore from '../store'
import { useState } from 'react';
import ProfileModal from './ProfileModal';

type PropsType = {
  messages: Record<string, any>[],
  selectedUser: Record<string, any>,
  setSelectedUser: (user: Record<string, any>) => void
}

const ScrollableChat = (props: PropsType) => {
  const { user } = useStore();
  const [showProfile, setShowProfile] = useState(false);
  const { messages, setSelectedUser, selectedUser } = props;

  return (
    <>
      {<ProfileModal profile={selectedUser} setShowProfile={setShowProfile} showProfile={showProfile} />}
      <ScrollableFeed>
        {
          messages && messages.map((m, i) => (
            <div className="flex gap-1 items-start"  key={m._id}>
                {
                  (isSameSender(messages, m, i, user.userId) || isLastMessage(messages, i, user.userId)) && (
                    <img src={m.sender?.picture} alt={`${m.sender?.username} picture`} className='w-8 h-8 rounded-full cursor-pointer mt-1.5' onClick={() => {
                      setSelectedUser(m.sender);
                      setShowProfile(true);
                    }} />
                  )
                }
                <div
                  className={`${m.sender?._id === user.userId ? 'bg-[#bee3f8] rounded-xl py-2' : "bg-[#b9fd50] py-2 rounded-xl"} ${m.sender?._id !== user.userId || isLastMessage(messages, i, user.userId) && 'rounded-tl-none rounded-xl pb-2 pt-0'} flex flex-col px-4 leading-none max-w-[75%]`}
                  style={{ marginLeft: isSameSenderMargin(messages, m, i, user.userId), marginTop: isSameUser(messages, m, i) ? '4px' : '10px' }}
                >
                  {
                    isSameSender(messages, m, i, user.userId) || isLastMessage(messages, i, user.userId) ? (
                      <>
                        <p className='text-sm text-blue-500 -ml-2 -mt-2 mb-[2px] cursor-pointer font-semibold capitalize' onClick={() => setShowProfile(true)}>{m.sender?.username}</p>
                        <p>{m.content}</p>
                      </>
                      ) : (
                        <p>{m.content}</p>
                    )
                  }
                </div>
            </div>
          ))
        }
      </ScrollableFeed>
    </>
  )
}

export default ScrollableChat