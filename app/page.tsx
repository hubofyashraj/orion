"use client"
import Navbar from './navbar/page'
import Login from './login/login';
import { useEffect, useState } from 'react';
import { login } from './api/events/login';
import { signup } from './api/events/signup';
import axios from 'axios';
import { address } from './api/api';
import Feed from './feed/feed';
import Profile from './profile/profile';

// var n = 1;

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [loginState, setLoginState] = useState(false);

  const [contentPage, setContentPage] = useState('feed');

  function toggleLogin() {
    setShowLogin(!showLogin);
    
  }

  function handleLogin(action: string,data: {username:string, password: string, fullname: string}, setWarning: Function, setPage: Function) {
    if(action=='login') {
      login(data).then((result:boolean) =>{
        setWarning('')
        alert('login success')
        setShowLogin(false);
        setLoginState(true);
      }).catch((reason: string)=>{
        setWarning(reason);        
      });
      
    }else if(action=='signup') {
      signup(data).then((result)=>{
        setWarning('');
        setPage(true);
      }).catch((result)=>{
        setWarning(result.data.reason);
        
      })
    } else {
      return;
    }

  }

  function handleLogout() {
    axios.post(address+'/logout', {token: localStorage.getItem('token')}).then((result)=>{
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setLoginState(false);
      setContentPage('home');
      setShowLogin(true);
    }).catch((err)=>{
      console.log(err);
    })
  }

  useEffect(()=>{
      
    const token: string | null = localStorage.getItem('token') ;
    // console.log(n++);

    if(token) {
      axios.post(
        address+'/',
        {token: localStorage.getItem('token')}
      ).then((result)=>{
        console.log(result.data);
        sessionStorage.setItem('user', result.data.authorizedData.username);
        setLoginState(true);
      }).catch((reason)=>{
        console.log(reason);
        setShowLogin(true);
      })

      
    }
    else {

      setShowLogin(true);
      console.log('hekko');
    }
  
  }, [])

  


  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      {showLogin && <Login close={toggleLogin} loginHandler={handleLogin}/>}

      {
        !showLogin && 
        <div className='w-full flex flex-col justify-start'>
          <div style={{height: 64}} className='w-full drop-shadow-sm border-b-2'>
            <Navbar isLoggedIn={false} loginState={loginState} calllogin={toggleLogin} calllogout={handleLogout} router={setContentPage}/>
          </div>
          <div style={{height: 'calc( 100vh - 64px )' }} className='h-full bg-slate-700'>
            {contentPage==='feed' && <Feed />}
            {contentPage==='profile' && <Profile />}
          </div>
        </div>
      }
    </main>
  )
}
