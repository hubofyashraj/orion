import { ArrowBack, DeleteOutlineRounded } from "@mui/icons-material";
import Image from "next/image";
import { ChangeEvent, DragEvent, MouseEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

export default function SelectImagesComponent({ fileList,  setPage, cancel }: {fileList: MutableRefObject<Array<File>>, setPage: Function, cancel: Function }) {
   
    const [images, setImages] = useState(new Array<string>());
    const textBtnCls = "hover:text-slate-300 text-slate-200 hover:drop-shadow-lg cursor-pointer ";

    
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
            for(const file of Array.from(files)) {
                fileList.current.push(file)
            }
            validateFiles(files);
        }
        
    }

    async function validateFiles(files: FileList) {

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        var imgAr = [...images];
        for (var i=0; i<files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e){
                imgAr.push(e.target!.result as string)
                if(imgAr.length === files.length+images.length) {
                    setImages(imgAr);
                }
            }
                
            if ( validTypes.indexOf(file.type)!==-1) {
                reader.readAsDataURL(file)            
            }
        } 
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>){
        const files = e.target.files;
        if(files?.length) {
            for (const file of Array.from(files)) {
                fileList.current.push(file);
            }
            validateFiles(files);
        }   
    }

    function pickFiles() {
        (document.getElementById('filePicker')! as HTMLInputElement).click()
    }


    function onClickHandler(event: MouseEvent<HTMLParagraphElement>): void {
        // props.fnCreatePost(Array.from(fileList.current))
        setPage();
    }

    const deleteFile = (image: string, idx: number)=>{
        setImages(images.filter((img)=>img!=image));
        fileList.current = fileList.current.filter((file)=>file!=Array.from(fileList.current)[idx])
    }

    function clearAll() {
        setImages([]);
        fileList.current=[];
    }

    return (
        <div className={" rounded-lg  select-none  w-full h-full flex flex-col justify-end items-center bg-blue-100"}>
            <div className="px-5 py-2 self-start w-full bg-slate-700 text-slate-200">
                <ArrowBack onClick={()=>cancel()} className="  hover:scale-110" />
            </div>
            { 
                <div className={" h-1/2 w-full grow flex justify-center items-center p-5 bg-slate-700 "}>
                    {images.length!==0 
                        ? <div className=" h-full w-[calc(90svw)] max-w-[calc(50rem)] m-3 flex gap-2 divide-slate-700  rounded-md overflow-auto scrollbar-none scrollbar-track-transparent scrollbar-thumb-slate-200 ">
                            {images.map((image, idx)=>(
                                <div key={idx} className=" h-full relative shrink-0">
                                    <DeleteOutlineRounded onClick={()=>deleteFile(image, idx)} className="absolute right-2 top-2 bg-white bg-opacity-90 rounded-full h-10" />
                                    <Image className="h-full w-auto rounded-lg" alt="" width={200} height={200} src={image}/>
                                </div>
                            ))}
                        </div>
                        : <p className="text-xl text-slate-400">No Image Selected</p>
                    }
                </div>
            }
            <div className="bg-slate-600 text-slate-200   w-full h-1/2 p-5 flex flex-col justify-between items-center ">
                <div onClick={pickFiles} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop} onDragOver={dragOver} 
                    className={ " border-dashed  border-slate-500 border-2 rounded-lg w-[calc(90svw)] max-w-[calc(50rem)] h-3/5 flex flex-col justify-center items-center cursor-pointer"}>
                    <p>Drop Image Here</p>
                    <p>/ Pick Images</p>
                </div>
                <div className="flex gap-5 self-end  ">
                    {images.length!=0 && <p onClick={onClickHandler} className={textBtnCls}>Continue</p>}
                    <p onClick={clearAll} className={textBtnCls}>Cancel</p>
                </div>
            </div>

            <input onChange={onChangeHandler} id="filePicker" type="file"  multiple hidden />

        </div>
    )
}