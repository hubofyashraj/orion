'use client'
import Feed from "./feed/feed";
import Profile from "./profile/profile";
import Search from "./search/search";
import CircularLoader from "./Loader/Loader";
import Create from "./create/create";
import Chat from "./chat/chat";
import { useEffect, useRef, useState } from "react";
import Navbar from "./navbar/navbar";
import Ping from "./sseProvider/ping";
import { validSession } from "./api/actions/authentication";
import useSSE from "./sseProvider/useSSE";




export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [route, setRoute] = useState('feed');

  const interval = useRef(null);


  const documentHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }
    

  useEffect(()=>{
    
    window.addEventListener('resize', documentHeight)
    documentHeight()    
    
    validSession().then(({status, user})=>{
      if(status==401) {
        window.location.href='/auth';
        return;
      }
      sessionStorage.setItem('user', user!);
      setShowLoader(false);
    })
    

  }, [])
  
  useSSE();

  if(showLoader) return (<CircularLoader />)

  return (
    <div className='w-full h-svh relative top-0 overflow-hidden flex flex-col justify-start'>
        <div className='w-full shrink-0 h-16 z-50 shadow-sm border-b border-slate-700'>
          <Navbar page={route} router={(route: string)=>setRoute(route)} />
        </div>
        <div className='grow-0 w-full h-full bg-slate-700 overflow-hidden'>
          {route==='feed' && (
              <Feed setPage={(val: string)=>setRoute(val)} />
          )}
          {route==='profile' && (
              <Profile  />
          )}
          {route==='search' && (
              <Search />
          )}
          {route==='chat' && (
              <Chat interval={interval}/>
          )}
          {route==='create' && (
              <Create cancel={()=>setRoute('feed')} />
          )}
        </div>
      <Ping />
    </div>
  )
}