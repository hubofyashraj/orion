import { create } from 'zustand';

interface State {
    alerts: NotificationAlert[],
    requests: {[key: string]: string},

    setAlerts: (newAlerts: NotificationAlert[]) => void,
    addAlert: (newAlert: NotificationAlert) => void,
    clearAlerts: () => void,
    setRequests: (allRequests: ConnectRequestAlert[]) => void,
    addRequest: (newRequest: ConnectRequestAlert) => void,
    removeRequest: (from: string) => void,
}

const useAlerts = create<State>((set) => ({
    alerts: [],
    requests: {},

    setAlerts: (newAlerts: NotificationAlert[]) => set((state) => ({
        alerts: newAlerts
    })),
    addAlert: (newAlert: NotificationAlert) => set((state) => ({
        alerts: [newAlert, ...state.alerts]
    })) ,
    clearAlerts: () => set((state) => ({
        alerts: []
    })),
    setRequests: (allRequests: ConnectRequestAlert[]) => set((state) => ({
        requests: allRequests.reduce((acc, obj) => {
            acc[obj.from] = obj.fullname;
            return acc;
        }, {} as {[key: string]: string})
    })),
    addRequest: (newRequest: ConnectRequestAlert) => set((state) => ({
        requests: {[newRequest.from]: newRequest.fullname, ...state.requests}
    })), 
    removeRequest: (from: string) => set((state) => {
        const {[from]: removed, ...rest} = state.requests;
        return ({
            requests: rest
        })
    }),
}))

export default useAlerts;