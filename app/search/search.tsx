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

type userSkel = {username: string; fullname: string;};
export default function Search() {

    const [foundUsers, setFoundUsersList] = useState(new Array<userSkel>());
    const [user, setUser] = useState('');
    // const [photos, setPhotos] = useState(new Map<string, string>());
    // const [imagesFetched, setImagesFetched] = useState(false);

    type userSkel = {username: string; fullname: string;};

    let timer: ReturnType<typeof setTimeout>;

    function keyPressed(e: any) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            if(e.target.value.length) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
                axios.post(
                    address+'/search',
                    {searchTxt: e.target.value, user: localStorage.getItem('user')}
                ).then(async (result)=>{  
                    console.log(result);
                    if(result.data.success)    setFoundUsersList(result.data.results);
                })
            }else  {
                setFoundUsersList([])
            }
        }, 1000)
        
    }

 

    const demo = {
        username: 'johndoe',
        fullname: 'John Doe'
    }
    
    return (
        <div className="text-slate-200 ease-in flex overflow-hidden flex-col w-full h-full gap-10 justify-start items-center bg-slate-700">
            <div className=" max-w-96 mt-2 bg-slate-600  rounded-xl">
                <input className="bg-inherit h-8   rounded-lg outline-none text-center" onKeyDown={keyPressed}  placeholder="Search"/>
                {/* <button><CIcon className="h-5 " icon={cilSearch }/></button> */}
            </div>
            <div className="w-full h-full  py-5 flex flex-col justify-start items-center gap-2 px-5">
                {/* {foundUsers.length==0 && <UserTile info={demo} />} */}
                {foundUsers.length>0 && <p>Users Found</p>}
                {foundUsers.map(user=><UserTile key={user.username} user={user} onClick={()=>setUser(user.username)}/>)}
            </div>  
            {user!='' && <div className={(user==''?"mt-[calc(100vh)] ":"mt-0 ")+"h-[calc(100vh-64px)] w-full absolute bg-white "}>
                <UserProfile user={user}/>
                <div className="absolute right-0 top-0 hover:drop-shadow-lg">
                    <CIcon onClick={()=>setUser('')} className="w-6 h-6 float-right m-6 hover:drop-shadow-lg" icon={cilX}/>
                </div>
            </div>}
        </div>
    );
}


function UserTile(props:any) {
    
    
    const [photo, setPhoto] = useState<string>('');
    const [fetched, setFetched] = useState(false);


    useEffect( ()=>{

        function fetchProfileImage(username: string) : Promise<string> {
            return new Promise((resolve, reject)=>{
                axios.get(
                    address+'/profile/fetchPFP?user='+username,
                ).then((result)=>{
                    console.log(result);
                    
                    if(result.data.success) {
                        resolve(result.data.image);
                    }
                    setFetched(true)
                }).catch((reason)=>{
                    reject('');
                })
            })
        }

        fetchProfileImage(props.user.username).then(async (image)=>{
            setPhoto(image);
        }).catch((reason)=>{
            setPhoto('');
        })
    }, [props.user.username]);


    return (
        <div onClick={props.onClick} className="w-full max-w-96 flex gap-2 justify-between items-center mx-2 bg-slate-600 hover:bg-slate-500 hover:shadow-lg py-2 px-4 rounded-md">
            <div className="rounded-full shrink-0 border-2 border-slate-800 bg-slate-800 ">
                {(photo==null || photo=='' || photo==undefined) ?  
                <CIcon className={(!fetched?'animate-pulse':'')+" h-12 p-1"} icon={cilUser}/> :
                <Image className="rounded-full " width={50} height={50} src={`data:image/png;base64,${photo}`} alt="img" />
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