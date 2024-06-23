import { create } from 'zustand';

interface State {
    ping: string,

    setPing: (newPing: string) => void,
}

const usePing = create<State>((set) => ({
    ping: 'connecting',

    setPing: (newPing: string) => set((state) => ({
        ping: newPing
    })),

}))

export default usePing;