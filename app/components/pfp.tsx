import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProfilePictureComponent({
    user, size
}: {
    user: string, size: number
}) {
    const self = useRef<string| null>(null);
    const [src, setSrc] = useState(`/api/images?type=pfp&user=${user}`)

    useEffect(()=>{
        self.current = sessionStorage.getItem('user');
    }, [])

    return (
        <div style={{height: size+'', width: size+''}} >
            <Image loading="lazy" key={user} alt="Profile Picture" width={size} height={size} src={src} onError={()=>setSrc('/default_user_icon.png')} />
        </div>
    )

}