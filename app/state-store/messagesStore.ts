import { create } from 'zustand';

interface State {
    unreadMessages: {[key: string]: Message},

    setMessages: (messages: {[key: string]: Message}) =>  void,
    addMessage: (user: string, newMessage: Message) => void,
    removeMessage: (user: string) => void,
}

const useMessages = create<State>((set) => ({
    unreadMessages: {},

    setMessages: (messages: {[key: string]: Message}) => set((state) => ({
        unreadMessages: messages
    })),
    addMessage: (user: string, newMessage: Message) => set((state) => ({
        unreadMessages: {[user]: newMessage, ...state.unreadMessages}
    })),
    removeMessage: (user: string) => set((state)=>{
        const {[user]: removedMessage, ...rest} = state.unreadMessages;
        const update = {unreadMessages: rest};
        return update
    }),

}))

export default useMessages;