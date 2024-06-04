import { DeleteOutlineRounded } from "@mui/icons-material";
import Image from "next/image";
import { ChangeEvent, DragEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";

export default function SelectImagesComponent(props: {curState: boolean, toggleState: Function, fnCreatePost: Function}) {
   
    const [images, setImages] = useState(new Array<string>());


    const textBtnCls = "hover:text-slate-900 text-slate-700 hover:drop-shadow-lg cursor-pointer ";
    
    let fileList = useRef(new Array<File>());

    
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

            // console.log(' sent for validation');
            
        }
        
    }

    async function validateFiles(files: FileList) {

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        // console.log(files.length);
        
        var imgAr = [...images];
        for (var i=0; i<files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e){
                imgAr.push(e.target!.result as string)
                // console.log(imgAr);
                
                if(imgAr.length === files.length+images.length) {
                    // console.log('should rerender now');
                    
                    setImages(imgAr);
                }
            }
                
            if ( validTypes.indexOf(file.type)!==-1) [
                reader.readAsDataURL(file)
            ]
        } 

        
        
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>){
        const files = e.target.files;
        if(files?.length) {
            for (const file of Array.from(files)) {
                fileList.current.push(file);
            }
            // console.log('fileList', fileList);
            
            validateFiles(files);
        }   
    }

    function pickFiles() {
        (document.getElementById('filePicker')! as HTMLInputElement).click()
    }




    

    function onClickHandler(event: MouseEvent<HTMLParagraphElement>): void {
        console.log('fileList on click', fileList);
        
        props.fnCreatePost(Array.from(fileList.current))
    }

    const deleteFile = (image: string, idx: number)=>{
        setImages(images.filter((img)=>img!=image));
        fileList.current = fileList.current.filter((file)=>file!=Array.from(fileList.current)[idx])
    }

    return (
        <div className={(props.curState?"":" -mb-96 ")+(images.length==0?" h-48 ":" h-96 ")+" transition-all rounded-t-lg  select-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-96 pt-4 bg-blue-100"}>
            {images.length!==0 && 
                <div className={" h-40 px-4  "}>
                    <div className=" m-3 flex gap-3 border-2 border-blue-200 rounded-md overflow-auto scrollbar-none scrollbar-track-transparent scrollbar-thumb-slate-200 ">
                        {images.map((image, idx)=>(
                            <div key={idx} className="h-36 relative shrink-0">
                                <DeleteOutlineRounded onClick={()=>deleteFile(image, idx)} className="absolute right-2 top-2 bg-white bg-opacity-90 rounded-full h-10" />
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
                    {images.length!=0 && <p onClick={onClickHandler} className={textBtnCls}>Continue</p>}
                    <p onClick={()=>{setImages([]);  props.toggleState()} } className={textBtnCls}>Cancel</p>
                </div>
            </div>

            <input onChange={onChangeHandler} id="filePicker" type="file"  multiple hidden />

        </div>
    )
}