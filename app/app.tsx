'use client'
import { useEffect, useRef, useState } from "react";
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
import CircularLoader from "./Loader/Loader";
import { Bounce, ToastContainer, toast, useToast } from "react-toastify";
import  'react-toastify/ReactToastify.min.css'



export default function App() {

const { isLoggedIn, setIsLoggedIn } = useAuth();
const [showLoader, setShowLoader] = useState(true);
const [contentPage, setContentPage] = useState('feed');
const interval = useRef(null);


const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}
  

useEffect(()=>{
  
  window.addEventListener('resize', documentHeight)
  documentHeight()    

  const token = localStorage.getItem('token')

  if(token) {
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`
    axios.post(
      address+'/',
    ).then(({data: {success, user, requests, reason}})=>{
      setShowLoader(false)
      if(success) {
        localStorage.setItem('user', user);
        sockInit();
        setIsLoggedIn(true);
      }else {        
        if(reason=='TokenExpiredError') {
          toast('Token Expired',{
            position: "top-right",
            autoClose: 5000, // Duration in milliseconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
        }
      }
    }).catch(({reason})=>{
      console.log(reason);
    })
  }
  else {
    setShowLoader(false);
  }

}, [setIsLoggedIn])

  if(showLoader) return (<CircularLoader />)

  return (
      <main className="flex h-full  flex-col items-center justify-between overflow-hidden">
          { isLoggedIn && <div className='w-full h-full flex flex-col justify-start'>
            <div style={{height: 64}} className='w-full fixed z-20 shadow-sm border-b border-slate-700'>
            <Navbar isLoggedIn={false} router={setContentPage} notifications={[]} page={contentPage} />
            </div>
            <div style={{height: 'calc( 100vh - 64px )' }} className='h-full  mt-16 overflow-hidden'>
              {contentPage==='feed' && <Feed />}
              {contentPage==='profile' && <Profile setPage={(val: string)=>setContentPage(val)} />}
              {contentPage==='search' && <Search />}
              {contentPage==='chat' && <Chat interval={interval}/>}
              {contentPage==='edit' && <Edit  user={localStorage.getItem('user')!} setPage={(val: string)=>setContentPage(val)}/>}
            </div>
          </div>}
          { !isLoggedIn && <Auth /> }
          <ToastContainer />
      </main>
  )
}