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
import { validSession } from "./api/auth/authentication";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useRouter, usePathname, useSearchParams } from "next/navigation";




export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [route, setRoute] = useState('feed');

  const interval = useRef(null);


  const router = useRouter();
  
  const pathname = usePathname();
  // if(pathname=='/') 
    // router.push('/feed')
  const searchParams  =useSearchParams();

  const documentHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }
  
  

  useEffect(()=>{

    document.title = 'Home | YASMC'

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

  const renderTab = () => {
    switch (searchParams.get('tab')) {
      case null:
        return <Feed  />;
      case 'feed':
        return <Feed  />;
      case 'profile':
        return <Profile  />;
      case 'search':
        return <Search />
      case 'chat':
        return <Chat />
      case 'create':
        return <Create />
        default:
          return <></>
    }
  }
  
  // useSSE();

  if(showLoader) return (<CircularLoader />)

  return (
    <div className='w-full h-svh relative top-0 overflow-hidden flex flex-col justify-start'>
        <SpeedInsights />
        <div className='w-full shrink-0 h-16 z-50 shadow-sm border-b border-slate-700'>
          <Navbar page={pathname} router={(route: string)=>router.push('/?tab='+route)} />
        </div>
        <div className='grow-0 w-full h-full bg-slate-700 overflow-hidden'>
          { renderTab() }
        </div>
      <Ping />
    </div>
  )
}