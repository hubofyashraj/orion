import CIcon from "@coreui/icons-react"
import Image from "next/image"
import { getCroppedImage } from "../imageutils/imageUtils"
import { MouseEvent, TouchEvent, useEffect, useState } from "react"
import { cilX } from "@coreui/icons"
import axios from "axios"
import { address } from "../api/api"
import { Bounce, toast } from "react-toastify"


export default function CropComponent({file, close, setFetch}: {file: File, close: () => void, setFetch: Function}) {
    const { type } = file
    const [imgSrc, setSrc] = useState('')
    const [ direction, setDirection ] = useState<'portrait' | 'landscape'>('portrait')
    const [imgres, setres] = useState({height: 0, width: 0})
    const [croppedimg, setCroppedImg] = useState('')

    let isDragging = false

    useEffect(()=>{
        // console.log(file);
        const fileReader = new FileReader();
        fileReader.onload = (file)=>{
            setSrc(file.target?.result as string)
        }
        fileReader.readAsDataURL(file)
    }, [file]) 

    useEffect(()=>{
        const img = document.createElement('img')
        img.src=imgSrc
        setres({height: img.height, width: img.width})
        setDirection(img.width>img.height?'landscape':'portrait')

    }, [imgSrc])



    
    

    let startX: number, startY: number, offsetX: number, offsetY: number
    function onmousedownHandler(event: MouseEvent<HTMLDivElement>): void {
        
            const div = document.getElementById('cropper') as HTMLDivElement;
        
            isDragging=true;
            startX = event.clientX;
            startY = event.clientY;
            offsetX = div.offsetLeft;
            offsetY = div.offsetTop;
            (event.target as HTMLDivElement).style.cursor='grabbing'
    

    }

    function ontouchdownHandler(event: TouchEvent<HTMLDivElement>): void {
        
        const div = document.getElementById('cropper') as HTMLDivElement;
    
        isDragging=true;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        offsetX = div.offsetLeft;
        offsetY = div.offsetTop;
        (event.target as HTMLDivElement).style.cursor='grabbing'


    }

    function onmousemoveHandler(event: MouseEvent<HTMLDivElement> ): void {
        if(isDragging) {
            // const div = document.getElementById('cropper') as HTMLDivElement;
            const parent = document.getElementById('parent') as HTMLDivElement;
            const dx = event.clientX -startX;
            const dy = event.clientY -startY
            const self = event.target as HTMLDivElement
            const left = Math.min(Math.max(offsetX+dx, 0), parent.offsetWidth-self.offsetWidth)
            const top = Math.min(Math.max(offsetY+dy, 0), parent.offsetHeight-self.offsetHeight)
            console.log(offsetX+dx, self.offsetWidth);
            
            self.style.left=`${left}px`
            self.style.top=`${top}px`
            // event.clientX=left
            // event.clientY=top
        }

    }

    function ontouchmoveHandler(event:  TouchEvent<HTMLDivElement>): void {
        if(isDragging) {
            // const div = document.getElementById('cropper') as HTMLDivElement;
            const parent = document.getElementById('parent') as HTMLDivElement;
            const dx = event.touches[0].clientX -startX;
            const dy = event.touches[0].clientY -startY
            const self = event.target as HTMLDivElement
            const left = Math.min(Math.max(offsetX+dx, 0), parent.offsetWidth-self.offsetWidth)
            const top = Math.min(Math.max(offsetY+dy, 0), parent.offsetHeight-self.offsetHeight)
            console.log(offsetX+dx, self.offsetWidth);
            
            self.style.left=`${left}px`
            self.style.top=`${top}px`
            // event.clientX=left
            // event.clientY=top
        }

    }

    function onmouseupHandler(event: MouseEvent<HTMLDivElement> & TouchEvent<HTMLDivElement>) {
        isDragging=false;
        (event.target as HTMLDivElement).style.cursor='grab'
    }


    
    
    // // let startX: number, startY: number, offsetX: number, offsetY: number
    // function onmousedownResizeHandler(event: MouseEvent<HTMLDivElement>): void {
        
    //         const div = document.getElementById('cropper') as HTMLDivElement;
        
    //         isDragging=true;
    //         startX = event.clientX;
    //         startY = event.clientY;
    //         offsetX = div.offsetLeft;
    //         offsetY = div.offsetTop;
    //         (event.target as HTMLDivElement).style.cursor='grabbing'
    

    // }
    // function onmousemoveResizeHandler(event: MouseEvent<HTMLDivElement>): void {
    //     if(isDragging) {
    //         const div = document.getElementById('cropper') as HTMLDivElement;
    //         const parent = document.getElementById('parent') as HTMLDivElement;
    //         const dx = event.clientX-startX;
    //         const dy = event.clientY-startY
    //         const left = Math.min(offsetX+dx, parent.offsetLeft)
    //         const top = Math.min(offsetY+dy, parent.offsetTop)
    //         console.log(offsetX+dx, parent.offsetLeft);
            
    //         div.style.left=`${left}px`
    //         div.style.top=`${top}px`
    //     }

    // }

    // function onmouseupResizeHandler(event: MouseEvent<HTMLDivElement>) {
    //     isDragging=false;
    //     (event.target as HTMLDivElement).style.cursor='grab'
    // }

    function cropimage(event: any): void {
        const div = document.getElementById('cropper') as HTMLDivElement
        const img = document.getElementById('img') as HTMLImageElement
        const startX = div.offsetLeft, startY = div.offsetTop, endX = startX+div.offsetWidth, endY = startY+div.offsetHeight
        console.log(startX, startY, endX, endY)
        getCroppedImage(img, startX, startY, endX, endY).then(async (value)=>{
            const blob: Blob = await (await fetch(value)).blob()
            const formData = new FormData();
            formData.append('file', blob);
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            axios.post(
                address + '/profile/saveimage',
                formData
            ).then((result) => {
                setFetch()
                close()    
                
            })
            
        })
    }


    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex flex-col gap-5 backdrop-blur-lg bg-opacity-80 p-5">
            <CIcon onClick={close} className="w-10 h-10 self-end" icon={cilX} />
            <div className="w-full h-full flex flex-col  overflow-hidden ">
                <div className="h-[calc(100%-3rem)] w-full flex justify-center items-center ">
                    <div className={
                        (
                        direction=='portrait'
                                        ?`h-[calc(30rem)] max-w-full max-h-full w-max  w-[calc(${30*imgres.width/imgres.height}rem)] `
                                        :`w-[calc(30rem)] max-w-full max-h-full h-max h-[calc(${30*imgres.width/imgres.height}rem)] `
                                    ) + 
                                    " bg-gray-300 grow-0 p-3 "}>
                        <div className="h-full w-full relative" id="parent">
                            {imgSrc && <Image id="img" className={(direction=='portrait'?'h-full w-auto ':'w-full h-auto ')+ " select-none  "} alt="" src={imgSrc} width={2} height={2} />
                            }
                            <div id="cropper" onMouseDown={onmousedownHandler} onMouseMove={onmousemoveHandler} onMouseUp={onmouseupHandler} onMouseLeave={onmouseupHandler}
                                onTouchStart={ontouchdownHandler} onTouchMove={ontouchmoveHandler} onTouchEnd={onmouseupHandler}
                                className={(direction=='landscape'?`h-full `:`w-full  `)
                                +" aspect-square absolute top-0 left-0  flex justify-end bg-white bg-opacity-10 border-2 border-dashed"}>
                            </div>
                        </div>
                        

                    </div>
                </div>
                <div className="w-full  flex justify-center items-center shrink-0">
                    <button onClick={cropimage} className="bg-gray-200 hover:bg-gray-300 text-slate-600 hover:text-black   h-10 w-20  rounded-xl mt-2 float-end ">
                        Save
                    </button>
                    {/* {croppedimg!='' && <Image alt="" className="h-60 w-60" src={croppedimg} width={0} height={0} />} */}
                </div>
            </div>
        </div>
    )


    
}
