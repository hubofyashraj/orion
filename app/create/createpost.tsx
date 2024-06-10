import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { address } from "../api/api";
import CropComponentPost from "./CropComponent";

export default function CreatePost(props: {fileList: MutableRefObject<Array<File>>, cancel: Function}) {

    var caption: string='';

    function setCaption(str: string): void {
        caption=str;
    }

    const images = useRef(new Array<string>());
    const files = props.fileList
    const [refresh, setRefresh] = useState(false);
    const [croppedImages, setCroppedImages] = useState(new Array<string>());
    const croppedImageFiles = useRef(new Array<Blob>())


    useEffect(()=>{
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
    }, [files, refresh])
    

    function post(caption: string) {
        if(localStorage.getItem('token')) {

            const formData = new FormData();
            for(const file of croppedImageFiles.current) formData.append('files', file);
            formData.append('caption', caption)
            formData.append('type', 'image')
            formData.append('length', files.current.length + '')
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
        <div className=" w-full  h-full top-0 bg-slate-700 text-slate-200 flex flex-col overflow-hidden scrollbar-thin">
            <div className="px-5 pt-3 shrink-0 flex justify-start items-center gap-5 ">
                <ArrowBack className="hover:scale-110" onClick={()=>props.cancel()}  />
                { images.current.length==0
                    ? <p className="text-lg ">Your Images</p>
                    : <p className="text-lg ">Crop these images. {images.current.length}/{croppedImages.length + images.current.length} remaining</p>}
            </div>
            <div className="grow w-full h-full  overflow-hidden flex flex-col relative p-5 gap-2">
                
                {images.current.length!=0 
                    ?   <div className=" rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto grow">    
                            {images.current.map((img, idx)=> <Image onClick={()=>crop(img)} className="w-auto rounded-lg" key={idx} alt="" width={200} height={200} src={img} />
                            )}
                        </div>    
                    :   <div className="flex flex-col gap-2 grow  overflow-hidden">
                            <div className=" rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4  overflow-y-auto scrollbar-none grow">
                                {croppedImages.map((img, idx)=> <Image className="w-auto rounded-lg " key={idx} alt="" width={200} height={200} src={img} />
                                )}
                            </div> 
                            <div className="shrink-0 flex flex-col sm:flex-row justify-center items-center gap-2 ">
                                {/* <p className="text-lg ">Caption</p> */}
                                <div className="w-full max-w-96  h-10 select-none  border border-slate-900 bg-slate-800 rounded-lg ">
                                    <input onChange={(e)=>{setCaption(e.target.value)}} type="text" placeholder="Caption" className="px-3 outline-none bg-transparent w-full h-full border-none " />
                                </div>
                                <button onClick={()=>post(caption)} className="bg-blue-200 hover:bg-blue-300 text-slate-600 hover:text-black  shrink-0 h-10 w-full sm:w-20 max-w-96  rounded-lg ">
                                Post
                                </button>
                            </div>
                        </div>
                }

            </div>

            {croppingImg && <CropComponentPost file={croppingImg} close={()=>setCroppingImg(null)} onCropped={onCropped}/>}

        </div>
    )
}