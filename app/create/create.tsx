import { useRef, useState } from "react";
import SelectImagesComponent from "./selectImageComponent";
import CreatePost from "./createpost";
import { useRouter } from "next/navigation";

export default function Create() {
    let fileList = useRef(new Array<File>());
    const [page, setPage ] = useState<'select' | 'process'>('select');

    const router = useRouter()

    return (
        <div className="w-full h-full ">
            { page==="select"
            ? <SelectImagesComponent fileList={fileList} setPage={()=>setPage('process')} />
            : <CreatePost fileList={fileList} cancel={()=>{fileList.current=[]; router.push('/?tab=feed')}} />
        }
        </div>
    )
}