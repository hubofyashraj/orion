import { useState } from "react";
import FloatingActionButton from "./floatingActionButton";
import ImagePost from "./imagepost";
import SelectImagesComponent from "./selectImageComponent";
import CreatePost from "./createpost";

export default function Feed() {

    const [showSelectComponent, setShowSelectComponent] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    var images: Array<string> = [];

    function setShowCreatePostPage(img: Array<string>) {
        images = img;
        setShowCreatePost(true);
    }

    return (
        <div className=" relative h-full w-full overflow-hidden">
            <div className="max-w-96">
                <ImagePost user={'user'} postid={'123'} />

            </div>

            <FloatingActionButton setShowSelectComponent={()=>setShowSelectComponent(true)} />
            {!showCreatePost && <SelectImagesComponent curState={showSelectComponent} toggleState={()=>setShowSelectComponent(false)} fnCreatePost={setShowCreatePostPage} />}
            {showCreatePost && <CreatePost images={images} cancel={()=>setShowCreatePost(false)} />}
        </div>
    );
}