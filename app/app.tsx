'use client'
import { useEffect, useState } from "react";
import { useAuth } from "./auth/ds";
import axios from "axios";
import { address } from "./api/api";
import Auth from "./auth/auth";
import Chat from "./chat/page";
import Feed from "./feed/feed";
import { sockInit } from "./handleSocket";
import Navbar from "./navbar/page";
import Edit from "./profile/edit";
import Profile from "./profile/profile";
import Search from "./search/search";
import { CircularProgress } from "@mui/material";




export default function App() {
const { isLoggedIn, setIsLoggedIn } = useAuth();

const [showProgress, setSHowProgress] = useState(true);

const [contentPage, setContentPage] = useState('feed');






const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}


useEffect(()=>{
  function initializer(token: string) : Promise<void> {
    return new Promise((resolve, reject)=>{
      axios.post(
        address+'/',
        {token: token}
      ).then((result)=>{
        // console.log(result.data);
        sessionStorage.setItem('user', result.data.userdata.username);
        sockInit();
        setIsLoggedIn(true);
        resolve()
        // setLoggedIn(true)
        // setLoginState(true);
      }).catch((reason)=>{
        console.log(reason, 'FF');
        setIsLoggedIn(false);
        reject()
        // setShowLogin(true);
      })
    })

  }
  
  window.addEventListener('resize', documentHeight)
  documentHeight()

    
  const token: string | null = localStorage.getItem('token') ;
  // console.log(n++);

  if(token) {
    // setSHowProgress(true);
    // alert('test1')
    initializer(token).then(()=>{ setTimeout(() => {
      setSHowProgress(false);  console.log('test')
    }, 2000);
    }).catch(()=>setSHowProgress(false))
    
  }
  else {
    setIsLoggedIn(false);
    setSHowProgress(false);
    // setShowLogin(true);
  }

}, [setIsLoggedIn])

  if(showProgress) return (<div className="w-full h-full flex flex-col gap-5 justify-center  items-center"><CircularProgress className=" h-20 w-20 "  /><p className="animate-bounce text-xl text-slate-400">Loading</p></div>)

  if(!isLoggedIn) return (<><Auth  /></>)

    return (
        <main style={{  }} className="flex h-full flex-col items-center justify-between overflow-hidden">
            {/* {showLogin && <Login close={toggleLogin} loginHandler={handleLogin}/>} */}
    
            {
            // !showLogin && 
            <div className='w-full h-full flex flex-col justify-start'>
                <div style={{height: 64}} className='w-full fixed z-20 shadow-sm border-b-2'>
                <Navbar isLoggedIn={false} router={setContentPage} notifications={[]} />
                </div>
                <div style={{height: 'calc( 100% - 64px )' }} className='h-full  mt-16 overflow-hidden'>
                {contentPage==='feed' && <Feed />}
                {contentPage==='profile' && <Profile setPage={(val: string)=>setContentPage(val)} />}
                {contentPage==='search' && <Search />}
                {contentPage==='chat' && <Chat />}
                {contentPage==='edit' && <Edit  user={sessionStorage.getItem('user')!} setPage={(val: string)=>setContentPage(val)}/>}
                </div>
            </div>
            }
        </main>
    )
}