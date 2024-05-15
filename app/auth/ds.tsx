'use client'
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null as any);



export function AuthProvider({children}: {children: any}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }} >
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = ()=>{
    return useContext(AuthContext);
}