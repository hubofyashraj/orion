import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { address } from "../api/api";

export default function CreatePost(props: {fileList: Array<File>, cancel: Function}) {

    var caption: string='';

    function setCaption(str: string): void {
        caption=str;
    }

    const [images, setImages] = useState(new Array<string>());

    useEffect(()=>{
        console.log(props.fileList);
        
        const files = props.fileList;
        let imgAr = new Array<string>();
        for (var i=0; i<files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e){
                imgAr.push(e.target!.result as string)
                if(imgAr.length === files.length+images.length) {
                    setImages(imgAr);
                }
            }

            reader.readAsDataURL(file);
        }
    }, [images.length, props.fileList])
    

    function post(caption: string) {
        if(localStorage.getItem('token')) {
            const formData = new FormData();
            for(const file of props.fileList) {
                formData.append('files', file);
            }
            formData.append('caption', caption)
            formData.append('type', 'image')
            formData.append('length', props.fileList.length + '')
            formData.append('ts', Date.now()+'')
            axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`
            axios.post(
                address+'/post/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then((result)=>{
                if(result.data.success) {
                    props.cancel();
                }
                else  {
                    console.error('Server Issue', result.data.reason)
                }
            }).catch((reason)=>{
                console.error('Err Couldn\'t Upload',reason)
            })
    
        }
    }

    return (
        <div className=" w-full absolute h-full top-0 bg-slate-200 flex flex-col overflow-y-scroll scrollbar-thin">
            <div className="p-1 shrink-0 border-b-2 border-blue-200">
                <ArrowBack onClick={()=>props.cancel()} fontSize="small"  />
            </div>
            <div className="grow w-full h-full overflow-hidden flex flex-col relative p-5 ">
                <p className="text-lg p-2 ">Caption</p>
                <div className="w-full max-w-96  px-2 py-3   border-2 border-blue-200 bg-white rounded-md ">
                    <input onChange={(e)=>{setCaption(e.target.value)}} type="text" placeholder="Enter Caption ..." className="outline-none border-none bg-transparent" />
                </div>
                <p className="text-lg p-2 ">Your Images</p>
                <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2 overflow-y-auto grow">
                    {images.map((img)=> <Image className="w-auto " key={images.indexOf(img)} alt="" width={200} height={200} src={img} />
                    )}
                </div>
                <p onClick={()=>post(caption)}  className="self-end p-2 hover:text-slate-900 text-slate-700 hover:drop-shadow-lg cursor-pointer ">Continue</p>
            </div>
        </div>
    )
}