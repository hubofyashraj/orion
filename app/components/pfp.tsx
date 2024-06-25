import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProfilePictureComponent({
    user, size, hasPFP
}: {
    user: string, size: number, hasPFP?: boolean
}) {
    const self = useRef<string| null>(null);
    const [src, setSrc] = useState(`/default_user_icon.png`)

    useEffect(()=>{
        self.current = sessionStorage.getItem('user');
        const uri = `/api/images?type=pfp&user=${user}`
        if(hasPFP){  setSrc(uri) }
    }, [hasPFP, user])

    useEffect(()=>{
        console.log(src);
        
    }, [src])

    return (
        <div style={{height: size+'', width: size+''}} >
            <Image loading="lazy" key={user} alt="Profile Picture" width={size} height={size} src={src} onError={(e)=>{console.log(e);
             setSrc('/default_user_icon.png')}} />
        </div>
    )

}