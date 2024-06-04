'use client'
import { useEffect, useState } from "react";
import { useAuth } from "./auth/ds";
import axios from "axios";
import { address } from "./api/api";
import Auth from "./auth/auth";
import Chat from "./chat/chat";
import Feed from "./feed/feed";
import { sockInit } from "./handleSocket";
import Navbar from "./navbar/navbar";
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
  
  window.addEventListener('resize', documentHeight)
  documentHeight()    

  const token: string | null = localStorage.getItem('token') ;
  if(token) {
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`
    axios.post(
      address+'/',
    ).then((result)=>{
      if(result.data.success) {
        sessionStorage.setItem('user', result.data.user);
        sockInit();
        setIsLoggedIn(true);
        setSHowProgress(false)
      }else {
        console.log(result.data);
        setIsLoggedIn(false)
        setSHowProgress(false)
      }
    }).catch((reason)=>{
      console.log(reason, 'FF');
      setIsLoggedIn(false);
    })
  }
  else {
    setIsLoggedIn(false);
    setSHowProgress(false);
  }

}, [setIsLoggedIn])

  if(showProgress) return (<div className="w-full h-full flex flex-col gap-5 justify-center  items-center"><CircularProgress className=" h-20 w-20 "  /><p className="animate-bounce text-xl text-slate-400">Loading</p></div>)

  if(!isLoggedIn) return (<><Auth  /></>)

  return (
      <main className="flex h-full flex-col items-center justify-between overflow-hidden">
          <div className='w-full h-full flex flex-col justify-start'>
              <div style={{height: 64}} className='w-full fixed z-20 shadow-sm border-b-2'>
              <Navbar isLoggedIn={false} router={setContentPage} notifications={[]} />
              </div>
              <div style={{height: 'calc( 100vh - 64px )' }} className='h-full  mt-16 overflow-hidden'>
                {contentPage==='feed' && <Feed />}
                {contentPage==='profile' && <Profile setPage={(val: string)=>setContentPage(val)} />}
                {contentPage==='search' && <Search />}
                {contentPage==='chat' && <Chat />}
                {contentPage==='edit' && <Edit  user={sessionStorage.getItem('user')!} setPage={(val: string)=>setContentPage(val)}/>}
              </div>
          </div>
      </main>
  )
}