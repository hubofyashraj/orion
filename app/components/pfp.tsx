import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { hasPFP } from "../api/db_queries/profile";

export default function ProfilePictureComponent({
    user, size
}: {
    user: string, size: number
}) {
    const self = useRef<string| null>(null);
    const [src, setSrc] = useState(`/default_user_icon.png`)

    useEffect(()=>{
        self.current = sessionStorage.getItem('user');
        const uri = `/api/images?type=pfp&user=${user}`
        hasPFP(user).then(has => { if(has) setSrc(uri) })
    }, [user])

    return (
        <div style={{height: size+'', width: size+''}} >
            <Image loading="lazy" key={user} alt="Profile Picture" width={size} height={size} src={src} onError={()=>setSrc('/default_user_icon.png')} />
        </div>
    )

}