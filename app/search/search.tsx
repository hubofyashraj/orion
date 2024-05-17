import { cilSearch, cilUser, cilUserPlus, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { address } from "../api/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Schema } from "inspector";
import UserProfile from "./userProfile";
import { pullbackReq, sendConnectionRequest } from "./events";
import { handleRequest } from "../navbar/data";

export default function Search() {

    const [foundUsers, setFoundUsersList] = useState([]);
    const [user, setUser] = useState('');
    // const [photos, setPhotos] = useState(new Map<string, string>());
    // const [imagesFetched, setImagesFetched] = useState(false);

    interface userSkel  {username: string; fullname: string;};

    let timer: ReturnType<typeof setTimeout>;

    function keyPressed(e: any) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            axios.post(
                address+'/search',
                {searchTxt: e.target.value, user: sessionStorage.getItem('user')}
            ).then(async (result)=>{  
                // console.log(result);
                var found: Array<userSkel> = result.data.results;
                var tiles : any= [];
                found.forEach((user: userSkel)=>{
                    tiles.push(<UserTile key={user.username} user={user} onClick={()=>setUser(user.username)}/>)
                })

                setFoundUsersList(tiles);
                // var img = new Map<string, string>();
                // var promises: Array<Promise<string | void>> = [];
                // for (let i = 0; i < found.length; i++) {
                //     const user = found[i];
                //     promises.push(fetchProfileImage(user.username).then((image)=>{
                //         img.set(user.username, image);
                //     }))
                // }

                // Promise.all(promises).then(()=>{
                //     setPhotos(img);
                //     setImagesFetched(true);
                // })

            })
        }, 1000)
        
    }

 

    const demo = {
        username: 'johndoe',
        fullname: 'John Doe'
    }
    
    return (
        <div className="flex overflow-hidden flex-col w-full h-full gap-10 justify-start items-center">
            <div className="w-full h-16 flex justify-center items-center gap-2">
                <input className="bg-inherit h-3/5 w-96  border-2 border-solid border-slate-200 rounded-lg outline-none shadow-lg text-center" onKeyDown={keyPressed}  placeholder="Search"/>
                {/* <button><CIcon className="h-5 " icon={cilSearch }/></button> */}
            </div>
            <div className="w-full h-full  py-5 flex flex-col justify-start items-center gap-2 px-5">
                {/* {foundUsers.length==0 && <UserTile info={demo} />} */}
                {foundUsers.length>0 && <p>Users Found</p>}
                {foundUsers}
            </div>  
            {user!='' && <div className={(user==''?"mt-[calc(100vh)] ":"mt-0 ")+"h-[calc(100vh-64px)] w-full absolute bg-white transition-all duration-1000"}>
                <UserProfile user={user}/>
                <div className="absolute right-0 top-0 hover:drop-shadow-lg">
                    <CIcon onClick={()=>setUser('')} className="w-6 h-6 float-right m-6 hover:drop-shadow-lg" icon={cilX}/>
                </div>
            </div>}
        </div>
    );
}


function UserTile(props:any) {
    
    // function sendConnectionRequest() {
    //     axios.post(
    //         address+'/connectionRequest',
    //         {token: localStorage.getItem('token'), user: props.user.username}
    //     ).then((result)=>{
            
    //     }).catch((reason)=>{

    //     })
        
        
    // }

    // function pullbackReq() {
    //     axios.post(
    //         address+'/pullbackReq',
    //         {token: localStorage.getItem('token'), id: props.user.id},

    //     ).then((result)=>{

    //     }).catch((reason)=>{

    //     })
    // }

    const [photo, setPhoto] = useState<string>('');



    useEffect(()=>{

        function fetchProfileImage(username: string) : Promise<string> {
            return new Promise((resolve, reject)=>{
                axios.post(
                    address+'/profile/fetchProfileImage',
                    {token: localStorage.getItem('token'), user: username}
                ).then((result)=>{
                    // console.log(result);
                    
                    if(result.data.success) {
                        resolve(result.data.image);
                    }
                }).catch((reason)=>{
                    console.log('cluldn\'t fetch image', reason);
    
                    reject('');
                })
            })
        }

        fetchProfileImage(props.user.username).then((image)=>{
            setPhoto(image);
            // console.log(photo);
            
        }).catch((reason)=>{
            console.log('couldn\'t fetch', reason);
            
            setPhoto('');
        })
    }, [props.user.username]);


    return (
        <div onClick={props.onClick} className="w-full max-w-96 flex gap-2 justify-between items-center mx-2 bg-slate-200 hover:bg-slate-300 hover:shadow-lg py-2 px-4 rounded-md">
            <div className="rounded-full shrink-0 border-2 bg-slate-400 p-1">
                {(photo==null || photo=='' || photo==undefined) ?  
                <CIcon className="h-12 p-1" icon={cilUser}/> :
                <Image className="rounded-full h-12 w-12" width={50} height={50} src={photo} alt="img" />
                }
            </div>
            <div className="grow">
                <p className="text-lg ">{props.user.fullname}</p>
                <p className="text-sm font-extralight">{props.user.username}</p>
            </div>

            <div className="shrink-0   hover:bg-opacity-30">
                {
                    props.user.status=='none' 
                    &&
                    <a onClick={()=>sendConnectionRequest(props.user.username)} className='hover:text-violet-500 cursor-pointer'>Connect</a>

                    // <button onClick={sendConnectionRequest} 
                    //     className="w-full h-full  flex justify-center items-center  rounded-full">
                            
                    // </button>
                }
                {
                    props.user.status=='connected' && <p>Connected</p>
                }
                {
                    props.user.status=='incoming' 
                    && 
                    <div className="flex gap-5">
                        <a onClick={()=>{handleRequest(props.user.id, true)}} className='hover:text-violet-500 cursor-pointer'>Accept</a>
                        <a onClick={()=>{handleRequest(props.user.id, false)}} className='hover:text-violet-500 cursor-pointer'>Decline</a>
                    </div>

                }
                {
                    props.user.status=='outgoing'
                    &&
                    <div>
                        <a onClick={()=>pullbackReq(props.user.id)} className='hover:text-violet-500 cursor-pointer'>Cancel</a>
                    </div>
                }
            </div>
            
        </div>
    );
}