export default function CreatePost(props: {images: Array<string>, cancel: Function}) {
    return (
        <div className=" w-full absolute h-svh top-0 bg-red-100">
            <p onClick={()=>props.cancel()}>close</p>
        </div>
    )
}