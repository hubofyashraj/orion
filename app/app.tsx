'use client'
import Feed from "./feed/feed";
import Profile from "./profile/profile";
import Search from "./search/search";
import CircularLoader from "./Loader/Loader";
import Create from "./create/create";
import Chat from "./chat/chat";
import { useEffect, useRef, useState } from "react";
import { getToken } from "./api/actions/cookie_store";
import Navbar from "./navbar/navbar";
import AlertsProvider from "./navbar/alerts/data";
import { SSEProvider } from "./sseProvider/sse";
import Ping from "./sseProvider/ping";
import { validSession } from "./api/actions/authentication";




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
  
  validSession().then((user)=>{
    sessionStorage.setItem('self', user);
    setShowLoader(false);
  })
  

}, [])

  if(showLoader) return (<CircularLoader />)

  return (
    <div className='w-full h-full flex flex-col justify-start'>
        <div style={{height: 64}} className='w-full fixed z-20 shadow-sm border-b border-slate-700'>
          <Navbar page={route} router={(route: string)=>setRoute(route)}  />
        </div>
        <div style={{height: 'calc( 100vh - 64px )' }} className='h-full bg-slate-700 mt-16 overflow-hidden'>
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