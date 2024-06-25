import { ChangeEvent, useEffect, useRef, useState } from "react";
import UserProfile from "./userProfile";
import { searchUsers } from "../api/search/search";
import ProfilePictureComponent from "../components/pfp";
import { getSuggestions } from "../api/search/suggestions";


export interface Match { 
    username: string; 
    fullname: string;
    status: string,
    hasPFP?: boolean,
    _id? : string
};

export default function Search() {

    const [matches, setMatches] = useState<Match[]>([]);
    const [user, setUser] = useState<Match | undefined>();
    const [suggestions, setSuggestions] = useState<Match[]>([]);

    let timer: ReturnType<typeof setTimeout>;

    useEffect(()=>{
        getSuggestions().then((values) => {
            if(values) {
                const { matches } = JSON.parse(values);
                setSuggestions(matches);
            }
        
        })

        
    }, [])


    function changeHandler(e: ChangeEvent<HTMLInputElement>) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            const keyword = e.target.value;
            if(keyword.length) {
                searchUsers(keyword).then((list) => {
                    if(list) setMatches(list as any)
                })
            }else  {
                setMatches([])
            }
        }, 1000)
        
    }

    function action(action: string, _id?: string) {
        let update = user;
        if(action=='send') {
            update ={
                ...user!,
                status: 'outgoing',
                _id: _id
            }
        } 
        else if(action=='cancel' || action=='decline') {
            update ={
                username: user!.username,
                fullname: user!.fullname,
                status: 'none',
            }
        }
        else if(action=='accept') {
            update ={
                username: user!.username,
                fullname: user!.fullname,
                status: 'connected',
            }
        }

        
        const updatedMatches = matches.map((match)=>match.username===update?.username? update: match)
        
        matches.filter(match=>{
            if(match.username==update!.username) return update;
            else return match
        })

        console.log(matches, updatedMatches);
        

        console.log(user, update );
        

        setMatches(updatedMatches);
        setUser(update)
    }


    return (
        user
        ? <div className="text-slate-200 flex overflow-hidden flex-col w-full h-full gap-10 justify-start items-center bg-slate-700">
            <UserProfile user={user} close={() => setUser(undefined)} action={action}/>
          </div> 
        : <div className="text-slate-200 flex overflow-hidden flex-col w-full h-full gap-10 justify-start items-center bg-slate-700">
            <div className=" max-w-96 mt-2 bg-slate-600  rounded-xl">
                <input className="bg-inherit h-8   rounded-lg outline-none text-center" onChange={changeHandler}  placeholder="Search"/>
            </div>
            <div className="w-full overflow-y-auto scrollbar-none grow py-5 flex flex-col justify-start items-center gap-2 px-5">
                {matches.length>0 && <p className="fixed -mt-12 text-2xl font-semibold">Users Found</p>}
                {matches.map((user, idx)=><UserTile key={idx} user={user} onClick={()=>{setUser(user)}}/>)}
            </div>  
            <div className=" w-full shrink-0  flex justify-center items-center  p-5">
                <div className="overflow-x-auto scrollbar-none flex justify-evenly  gap-2">
                    <p className="fixed -mt-10  font-semibold text-2xl">Suggestions</p>
                    {suggestions.map((suggestion, idx) => {
                        return <UserTile onClick={()=>setUser(suggestion)} user={suggestion} key={idx} />
                    })}
                </div>
            </div>
          </div>
    );
}


function UserTile({
    user, onClick
}: {
    user: Match, onClick: () => void
}) {

    return (
        <div onClick={onClick} className="w-full slide-item shrink-0 max-w-96 flex gap-2 justify-between items-center  bg-slate-600 hover:bg-slate-500 hover:shadow-lg py-2 px-4  rounded-md">
            <div className="rounded-full overflow-hidden shrink-0 border-2 border-slate-800 bg-slate-800 ">
                <ProfilePictureComponent size={40} user={user.username} hasPFP={user.hasPFP} />
            </div>
            <div className="grow">
                <p className="text-lg ">{user.fullname}</p>
                <p className="text-sm font-extralight">{user.username}</p>
            </div>
            <div className="shrink-0 text-sm  hover:bg-opacity-30">
                { user.status=='connected' && <p>Connected</p> }
                { user.status=='incoming' && <p>Wants to connect</p> }
                { user.status=='outgoing' && <p>Requested</p> }
            </div>
        </div>
    );
}