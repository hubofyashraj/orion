import { useState } from "react";
import FloatingActionButton from "./floatingActionButton";
import ImagePost from "./imagepost";
import SelectImagesComponent from "./selectImageComponent";

export default function Feed() {

    const [showSelectComponent, setShowSelectComponent] = useState(false);


    return (
        <div className=" relative h-full w-full overflow-hidden">
            <ImagePost user={'user'} postid={'123'} />


            <FloatingActionButton setShowSelectComponent={()=>setShowSelectComponent(true)} />
            <SelectImagesComponent curState={showSelectComponent} toggleState={()=>setShowSelectComponent(false)} />
        </div>
    );
}