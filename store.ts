"use client"

import { create } from 'zustand';

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
}

const useStore = create<Store>((set) => ({
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
    }
}));

export default useStore;