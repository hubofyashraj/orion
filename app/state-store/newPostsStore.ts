import { create } from 'zustand';

interface State {
    newPosts: boolean,

    setNewPosts: (newState: boolean) => void,
}

const usePostsAlert = create<State>((set) => ({
    newPosts: false,

    setNewPosts: (newState: boolean) => set((state) => ({
        newPosts: newState
    }))
}))

export default usePostsAlert;