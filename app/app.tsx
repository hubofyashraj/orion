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
import { AnimatePresence } from "framer-motion";
import PageTrasition from "./animation/PageTransition";
import Create from "./create/create";
import { getToken } from "./api/events/login";
import { error } from "console";



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

  // const token = localStorage.getItem('token')
  getToken().then((token)=>{
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
      setShowLoader(false)
      console.log(reason);
    })
  }).catch((error: Error)=>{
    console.log(error.name, error.message);
    setShowLoader(false);
    
  })

  // if(token) {
    
  // }
  // else {
  // }

}, [setIsLoggedIn])

  if(showLoader) return (<CircularLoader />)

  return (
      <main className="flex h-full  flex-col items-center justify-between overflow-hidden">
          { isLoggedIn && <div className='w-full h-full flex flex-col justify-start'>
            <div style={{height: 64}} className='w-full fixed z-20 shadow-sm border-b border-slate-700'>
            <Navbar isLoggedIn={false} router={setContentPage} notifications={[]} page={contentPage} />
            </div>
            <div style={{height: 'calc( 100vh - 64px )' }} className='h-full bg-slate-700 mt-16 overflow-hidden'>
              <AnimatePresence mode="wait">
              {contentPage==='feed' && (
                <PageTrasition aniProps={{initial: {x: '100sw'}, animate: {x: 0}, exit: {x: '100vw'}, transition: {duration: 0.2}}}>
                  <Feed setPage={(val: string)=>setContentPage(val)} />
                </PageTrasition>
              )}
              {contentPage==='profile' && (
                <PageTrasition>
                  <Profile setPage={(val: string)=>setContentPage(val)} />
                </PageTrasition>
              )}
              {contentPage==='search' && (
                <PageTrasition>
                  <Search />
                </PageTrasition>
              )}
              {contentPage==='chat' && (
                <PageTrasition>
                  <Chat interval={interval}/>
                </PageTrasition>
              )}
              {contentPage==='edit' && (
                <PageTrasition>
                  <Edit  user={localStorage.getItem('user')!} setPage={(val: string)=>setContentPage(val)}/>
                </PageTrasition>
              )}
              {contentPage==='create' && (
                <PageTrasition aniProps={{initial: {x: '100sw'}, animate: {x: 0}, exit: {x: '100vw'}, transition: {duration: 0.2}}} >
                  <Create cancel={()=>setContentPage('feed')} />
                </PageTrasition>
              )}
              </AnimatePresence>
            </div>
          </div>}
          { !isLoggedIn && <Auth /> }
          <ToastContainer />
      </main>
  )
}

