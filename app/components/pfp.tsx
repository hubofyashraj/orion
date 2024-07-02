import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePictureComponent({
    user, size, hasPFP, priority, refetch
}: {
    user: string, size: number, hasPFP?: boolean, priority?: true, refetch?: boolean
}) {
    const defaultPFP = '/default_user_icon.png';
    const [src, setSrc] = useState(defaultPFP);
    
    useEffect(() => {
        const uri = `/api/images?type=pfp&user=${user}&t=${Date.now()}`;
        if (hasPFP) {
            setSrc(uri);
        }
    }, [hasPFP, user]);

    useEffect(() => {
        if (refetch) {
            const uri = `/api/images?type=pfp&user=${user}`;
            const cacheBustedUri = `${uri}&t=${new Date().getTime()}`;
            setSrc(cacheBustedUri);
        }
    }, [refetch, user]);

    return (
        <div style={{ height: size + 'px', width: size + 'px' }}>
            <Image
                loading={priority ? 'eager' : "lazy"}
                alt="Profile Picture"
                width={size}
                height={size}
                src={src}
                onError={() => { setSrc(defaultPFP) }}
            />
        </div>
    );
}
