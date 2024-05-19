import { DeleteOutlineRounded } from "@mui/icons-material";
import Image from "next/image";
import { DragEvent, useEffect, useState } from "react";

export default function SelectImagesComponent(props: {curState: boolean, toggleState: Function, fnCreatePost: Function}) {
    const [images, setImages] = useState([] as Array<string>)
   
    


    const textBtnCls = "hover:text-slate-900 text-slate-700 hover:drop-shadow-lg cursor-pointer ";
    

    function dragOver(e: DragEvent) {
        e.preventDefault();
    }

    function dragEnter(e: DragEvent) {
        e.preventDefault();

    }
    function dragLeave(e: DragEvent) {
        e.preventDefault();

    }
    function fileDrop(e: DragEvent) {
        e.preventDefault();
        const files = e.dataTransfer.files;

        if(files.length) {
            validateFiles(files);
            console.log(' sent for validation');
            
        }
        
    }

    async function validateFiles(files: FileList) {

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        // console.log(files.length);
        
        var imgAr = [...images];
        for (var i=0; i<files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e){
                // setImages(prev=>[...prev, e.target!.result as string])
                imgAr.push(e.target!.result as string)
                if(imgAr.length === files.length) {
                    setImages(imgAr);
                }
            }
                
            if ( validTypes.indexOf(file.type)!==-1) [
                reader.readAsDataURL(file)
            ]
        } 

        // while(true) {


        // }

        
        
    }
    // const inpt: HTMLInputElement  = document.getElementById('filePicker')! as HTMLInputElement

    if((document.getElementById('filePicker')! as HTMLInputElement)) {
        (document.getElementById('filePicker')! as HTMLInputElement).addEventListener('change', ()=>{
            if((document.getElementById('filePicker')! as HTMLInputElement).files!.length) {
                validateFiles((document.getElementById('filePicker')! as HTMLInputElement).files!);
            }     
        })
    }

    function pickFiles() {
        (document.getElementById('filePicker')! as HTMLInputElement).click()
    }




    

    return (
        <div className={(props.curState?"":" -mb-96 ")+(images.length==0?" h-48 ":" h-96 ")+" transition-all rounded-t-lg  select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-96 pt-4 bg-blue-100"}>
            {images.length!==0 && 
                <div className={" h-40 px-4  "}>
                    <div className=" m-3 flex gap-3 border-2 border-blue-200 rounded-md overflow-auto scrollbar-none scrollbar-track-transparent scrollbar-thumb-slate-200 ">
                        {images.map(image=>(
                            <div key={images.indexOf(image)} className="h-36 relative shrink-0">
                                <DeleteOutlineRounded onClick={()=>{setImages(images.filter((img)=>img!=image))}} className="absolute right-2 top-2 bg-white bg-opacity-90 rounded-full h-10" />
                                <Image className="h-full w-auto" alt="" width={200} height={200} src={image}/>
                            </div>
                        ))}
                    </div>
                </div>
            }
            <div onDragEnter={dragEnter} onDragLeave={dragLeave} 
                    onDrop={fileDrop} onDragOver={dragOver} className="bg-blue-100 border-t-2 border-blue-200 w-full h-48 p-5 flex flex-col justify-between items-center ">
                <div onClick={pickFiles}
                    className={ " border-dashed mt-8 border-slate-500 border-2 rounded-lg w-1/2 h-1/2 flex flex-col justify-center items-center"}>
                    <p>Drop Image Here</p>
                    <p>/ Pick Images</p>
                </div>
                <div className="flex gap-5 self-end  ">
                    {images.length!=0 && <p onClick={()=>props.fnCreatePost(images)} className={textBtnCls}>Continue</p>}
                    <p onClick={()=>{setImages([]);  props.toggleState()} } className={textBtnCls}>Cancel</p>
                </div>
            </div>

            <input id="filePicker" type="file" multiple hidden />

        </div>
    )
}