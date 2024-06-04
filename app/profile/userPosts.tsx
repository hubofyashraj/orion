import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { address } from "../api/api"
import CircularLoader from "../Loader/Loader"
import Image from "next/image"

export default function UserPosts(props: {}) {

    type PostTileId = {
        post_id: string,
        thumbnail: string
    }


    const posts = useRef<Array<PostTileId>>([]);
    const [fetched, setFetched] = useState(false);

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+'/profile/fetchUserPosts'
        ).then((result)=>{
            if(result.data.success) {
                posts.current=(result.data.posts)
                setFetched(true);
            }
        }).catch((err)=>{
            console.log(err);
            
            setFetched(true)
        })
    }, [])

    // useEffect(()=>{
    //     setFetched(true)
    // }, [posts])



    if(!fetched) return (
        <CircularLoader />
    )

    if(posts.current.length==0) return (
        <div className="h-full w-full flex justify-center items-center ">
            <p className="text-slate-700 text-3xl">No Posts</p>
        </div>
    )

    const numRows = Math.ceil(posts.current.length/3);
    const numRowsSM = Math.ceil(posts.current.length/4);
    const numRowsMD = Math.ceil(posts.current.length/5);
    const numRowsLG = Math.ceil(posts.current.length/6);


    return (
        <div className={` w-full  inline-grid grid-cols-3 grid-rows-${numRows}  sm:grid-cols-4 sm:grid-rows-${numRowsSM} md:grid-cols-5 md:grid-rows-${numRowsMD} lg:grid-cols-6 lg:grid-rows-${numRowsLG} gap-0.5 justify-start overflow-y-auto`}>
            {posts.current.map((post, idx)=>{
                return (
                    <div key={idx} className={`imggriditem h-[calc(33svw-0.33rem)] sm:h-[calc(25svw-0.25rem-1.5px)] md:h-[calc(20svw-5px)] lg:h-[calc(16.4svw)] `}  >
                        <Image alt="" src={'data:image/png;base64,'+post.thumbnail} width={0} height={0} className="h-full w-full"/>
                    </div>
                )
            })}
        </div>
    )
}