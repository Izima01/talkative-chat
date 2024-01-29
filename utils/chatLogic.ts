import { User } from "@/store";

export const isSameSenderMargin = (messages: Record<string, any>[], m: Record<string, any>, i: number, userId: string) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 37;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages: Record<string, any>[], m: Record<string, any>, i: number, userId: string) => {
  return (
    i < messages.length - 1 &&
    (messages?.[i + 1]?.sender?._id !== m?.sender?._id ||
      messages?.[i + 1]?.sender?._id === undefined) &&
    messages?.[i]?.sender?._id !== userId
  );
};

export const isLastMessage = (messages: Record<string, any>[], i: number, userId: string) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages: Record<string, any>[], m: Record<string, any>, i: number) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser: User, users: Record<string, any>[]) => {
  return users[0]?._id === loggedUser.userId ? users?.[1].username : users?.[0].username;
};

export const getSenderFull = (loggedUser: User, users: Record<string, any>[]) => {
  return users?.[0]._id === loggedUser.userId ? users?.[1] : users?.[0];
};