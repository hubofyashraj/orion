import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { address } from "../api/api";
import CropComponentPost from "./CropComponent";

export default function CreatePost(props: {fileList: Array<File>, cancel: Function}) {

    var caption: string='';

    function setCaption(str: string): void {
        caption=str;
    }

    const images = useRef(new Array<string>());
    const files = useRef([...props.fileList])
    const [refresh, setRefresh] = useState(false);
    const [croppedImages, setCroppedImages] = useState(new Array<string>());
    const croppedImageFiles = useRef(new Array<Blob>())


    useEffect(()=>{
        // const files = props.fileList;
        let imgAr = new Array<string>();
        for (var i=0; i<files.current.length; i++) {
            const file = files.current[i];
            const reader = new FileReader();

            reader.onload = function(e){
                imgAr.push(e.target!.result as string)
                if(imgAr.length === files.current.length+images.current.length) {
                    images.current=imgAr;
                    setRefresh(!refresh)
                }
            }

            reader.readAsDataURL(file);
        }
    }, [refresh])
    

    function post(caption: string) {
        if(localStorage.getItem('token')) {

            const formData = new FormData();
            for(const file of croppedImageFiles.current) formData.append('files', file);
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

    const [croppingImg, setCroppingImg] = useState<null | string>(null)

    function crop(img: string) {
        setCroppingImg(img)
    }

    function onCropped(old: string, value: string, blob: Blob) {
        setCroppingImg(null)
        images.current = images.current.filter(image=>image!=old);
        setCroppedImages([...croppedImages, value])
        croppedImageFiles.current = [...croppedImageFiles.current, blob]
    }

    return (
        <div className=" w-full absolute h-full top-0 bg-slate-200 flex flex-col overflow-hidden scrollbar-thin">

            <div className="p-1 shrink-0 border-b-2 border-blue-200">
                <ArrowBack onClick={()=>props.cancel()} fontSize="small"  />
            </div>

            <div className="grow w-full h-full  overflow-hidden flex flex-col relative p-3 gap-2">

                <div className="shrink-0 flex flex-col gap-2 ">
                    <p className="text-lg ">Caption</p>
                    <div className="w-full max-w-96 px-2 h-10 select-none  border-2 border-blue-200 bg-white rounded-md ">
                        <input onChange={(e)=>{setCaption(e.target.value)}} type="text" placeholder="Give it a good caption" className="outline-none w-full h-full border-none " />
                    </div>
                </div>

                {images.current.length!=0 && <div className="flex flex-col gap-2 overflow-hidden">
                    <p>Crop these images. {images.current.length}/{croppedImages.length + images.current.length} remaining</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto grow">    
                        {images.current.map((img, idx)=> <Image onClick={()=>crop(img)} className="w-auto " key={idx} alt="" width={200} height={200} src={img} />
                        )}
                    </div>    
                </div>}

                {images.current.length==0 &&  <div className="flex flex-col gap-2 grow  overflow-hidden">
                    <p className="text-lg ">Your Images</p>
                    <div className="  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4  overflow-y-auto grow">
                        {croppedImages.map((img, idx)=> <Image className="w-auto " key={idx} alt="" width={200} height={200} src={img} />
                        )}
                    </div> 
                    <button onClick={()=>post(caption)} className="bg-blue-200 hover:bg-blue-300 text-slate-600 hover:text-black  shrink-0 h-10 w-20  rounded-lg mt-2 self-end">
                        Post
                    </button>
                </div>}

            </div>

            {croppingImg && <CropComponentPost file={croppingImg} close={()=>setCroppingImg(null)} onCropped={onCropped}/>}

        </div>
    )
}