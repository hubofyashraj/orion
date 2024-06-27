import { ChangeEvent, useEffect, useRef, useState } from "react";
import UserProfile from "./userProfile";
import { searchUsers } from "../api/search/search";
import ProfilePictureComponent from "../components/pfp";
import { getSuggestions } from "../api/search/suggestions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export interface Match { 
    username: string; 
    fullname: string;
    status: string,
    hasPFP?: boolean,
    _id? : string
};

export default function Search() {

    const [matches, setMatches] = useState<Match[]>([]);
    const user = useRef<Match | null>(null);
    const [suggestions, setSuggestions] = useState<Match[]>([]);

    const searchParams = useSearchParams();
    const router  = useRouter();
    const pathname = usePathname();

    let timer: ReturnType<typeof setTimeout>;

    useEffect(()=>{
        document.title = 'Search | YASMC'
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
        let update = user.current!;
        if(action=='send') {
            update ={
                ...user.current!,
                status: 'outgoing',
                _id: _id
            }
        } 
        else if(action=='cancel' || action=='decline') {
            update ={
                username: user.current!.username,
                fullname: user.current!.fullname,
                status: 'none',
            }
        }
        else if(action=='accept') {
            update ={
                username: user.current!.username,
                fullname: user.current!.fullname,
                status: 'connected',
            }
        }

        const updatedMatches = matches.map((match)=>match.username===update?.username? update: match)
        
        matches.filter(match=>{
            if(match.username==update!.username) return update;
            else return match
        })

        setMatches(updatedMatches);
        user.current = (update)
    }


    return (
        searchParams.get('user')
        ? <div className="text-slate-200 flex overflow-hidden flex-col w-full h-full gap-10 justify-start items-center bg-slate-700">
            <UserProfile user={user.current!} close={() => router.back()} action={action}/>
          </div> 
        : <div className="text-slate-200 flex overflow-y-auto flex-col w-full h-full justify-start  bg-slate-900">
            <div className=" h-16 shrink-0 w-full px-5 flex items-center justify-center">
                <input 
                 className="bg-inherit h-8  bg-slate-800 w-72 max-w-full focus:w-96 focus:py-5 transition-all   rounded-lg outline-none text-center focus:bg-slate0700" 
                 onChange={changeHandler}  
                 placeholder="Search"
                />
            </div>
            {matches.length>0 && <div className=" relative w-full h-72 shrink-0 p-5 sm:p-10">
                <div className="overflow-x-auto h-full scrollbar-none flex  justify-start items-center  gap-2">
                    {<p className="absolute top-2 text-2xl self-start font-semibold">Users Found</p>}
                    {matches.map((match, idx)=><UserTile key={match.username} user={match} onClick={()=>{user.current=(match); router.push(pathname+'?'+searchParams.toString()+'&user='+match.username)}}/>)}
                </div>  
            </div>}
            <div className=" w-full h-72 shrink-0 relative p-5 sm:p-10">
                <div className="overflow-x-auto h-full  scrollbar-none flex  justify-start items-center  gap-2">
                    {suggestions.length>0 && <p className="absolute top-2  self-start font-semibold text-2xl">Suggestions</p>}
                    {suggestions.map((suggestion, idx) => {
                        return <UserTile onClick={()=>{user.current = (suggestion); router.push(pathname+'?'+searchParams.toString()+'&user='+suggestion.username)} } user={suggestion} key={suggestion.username} />
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
        <div onClick={onClick} className="w-48 h-48 flex-col shrink-0  flex gap-2 transition-all items-center  bg-slate-800 hover:bg-slate-700  sm:hover:h-52 sm:hover:w-52 hover:shadow-lg py-2 px-4  rounded-md">
            <div className="rounded-full h-16 w-16 overflow-hidden shrink-0 border-2 border-slate-800 bg-slate-800 ">
                <ProfilePictureComponent size={64} user={user.username} hasPFP={user.hasPFP} />
            </div>
            <div className="grow text-center">
                <p className="text-lg">{user.fullname}</p>
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