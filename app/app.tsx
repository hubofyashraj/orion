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




export default function App() {
const { isLoggedIn, setIsLoggedIn } = useAuth();


const [contentPage, setContentPage] = useState('feed');






const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}


useEffect(()=>{
  function initializer(token: string) {
    axios.post(
      address+'/',
      {token: token}
    ).then((result)=>{
      // console.log(result.data);
      sessionStorage.setItem('user', result.data.userdata.username);
      sockInit();
      setIsLoggedIn(true);
      // setLoggedIn(true)
      // setLoginState(true);
    }).catch((reason)=>{
      console.log(reason, 'FF');
      setIsLoggedIn(false);

      // setShowLogin(true);
    })

  }
  
  window.addEventListener('resize', documentHeight)
  documentHeight()

    
  const token: string | null = localStorage.getItem('token') ;
  // console.log(n++);

  if(token) {
    initializer(token);
    
  }
  else {
    setIsLoggedIn(false);
    // setShowLogin(true);
  }

}, [setIsLoggedIn])

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