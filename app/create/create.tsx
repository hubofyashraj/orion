import { useRef, useState } from "react";
import SelectImagesComponent from "./selectImageComponent";
import CreatePost from "./createpost";

export default function Create({cancel} : {cancel: Function}) {
    let fileList = useRef(new Array<File>());
    const [page, setPage ] = useState<'select' | 'process'>('select');
    return (
        <div className="w-full h-full ">
            { page==="select"
            ? <SelectImagesComponent fileList={fileList} setPage={()=>setPage('process')} cancel={()=>cancel()} />
            : <CreatePost fileList={fileList} cancel={()=>{fileList.current=[]; cancel()}} />
        }
        </div>
    )
}