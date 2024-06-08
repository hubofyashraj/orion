import CIcon from "@coreui/icons-react"
import Image from "next/image"
import { getCroppedImage } from "../imageutils/imageUtils"
import { MouseEvent, TouchEvent, useEffect, useState } from "react"
import { cilX } from "@coreui/icons"
import axios from "axios"
import { address } from "../api/api"
import { Bounce, toast } from "react-toastify"
import ReactCrop, { Crop } from "react-image-crop"


export default function CropComponentPost({file, close, onCropped}: {file: string, close: () => void, onCropped: Function}) {
    const [imgSrc, setSrc] = useState(file)

    const [crop, setCrop] = useState<Crop>({x: 0, y: 0, height: 200, width: 200, unit: 'px'});

    function cropimage(event: any): void {
        const img = document.getElementById('img') as HTMLImageElement
        getCroppedImage(img, crop.x, crop.y, crop.width, crop.height).then(async (value)=>{
            const blob: Blob = await (await fetch(value)).blob()
            onCropped(imgSrc, value, blob)
        })
    }


    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex flex-col items-center gap-5 backdrop-blur-lg bg-opacity-80 p-5">
            <CIcon onClick={close} className="w-10 h-10 shrink-0 scale-75 hover:scale-90 self-end" icon={cilX} />
            <div className="  overflow-hidden ">
                {imgSrc!='' 
                &&  <ReactCrop   className="border-8 p-0 m-0 border-slate-800  max-h-full max-w-full" aspect={1} crop={crop} onChange={c=>setCrop(c)}>
                    <div className="relative w-full h-full ">
                        <Image id="img"  className={ " object-contain max-h-[calc(100svh-240px)] max-w-full  h-full w-auto "} alt="" src={imgSrc} width={0} height={0} />
                    </div>
                    </ReactCrop>
                }
            </div>
            <div className=" flex justify-center items-center shrink-0">
                <button onClick={cropimage} className="bg-gray-200 hover:bg-gray-300 text-slate-600 hover:text-black   h-10 w-20  rounded-xl float-end ">
                    Save
                </button>
            </div>
        </div>
    )


    
}
