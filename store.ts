"use client"

import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { ClientToServerEvents, ServerToClientEvents } from './utils/types/socket.io-client';

export const emptyUser = {
    userId: '',
    username: '',
    picture: '',
    iat: '',
    token: '',
    isOnline: false
}

export interface User {
    iat: string;
    username: string;
    userId: string;
    picture: string;
    token: string;
    isOnline: boolean
}

type Store = {
    user: User;
    setUser: (value: User) => void;
    selectedChat: Record<string, any>;
    setSelectedChat: (val: Record<string, any>) => void;
    chats: Array<Record<string, any>>;
    setChats: (vals: Record<string, any>[]) => void;
    fetchAgain: boolean;
    setFetchAgain: (val: boolean) => void;
    notifications: Record<string, any>[];
    setNotifications: (val: Record<string, any>[]) => void;
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    setSocket: (val: Socket<ServerToClientEvents, ClientToServerEvents>) => void;
}

const useStore = create<Store>((set) => ({
    socket: null,
    setSocket(val) {
        set(state => ({
            ...state, socket: val
        }))
    },
    user: emptyUser,
    setUser(val) {
        set(state => ({
            ...state, user: val
        }))
    },
    selectedChat: {},
    setSelectedChat(val) {
        set(state => ({
            ...state, selectedChat: val
        }))
    },
    chats: [],
    setChats(val) {
        set(state => ({
            ...state, chats: val
        }))
    },
    fetchAgain: false,
    setFetchAgain(val) {
        set(state => ({
            ...state, fetchAgain: val
        }))
    },
    notifications: [],
    setNotifications(val) {
        set(state => ({
            ...state, notifications: val
        }))
    }
}));

export default useStore;