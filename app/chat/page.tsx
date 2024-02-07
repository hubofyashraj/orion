'use client'
import axios from "axios";
import { useEffect } from "react";
import { address } from "../api/api";

export default function Chat() {

    useEffect(
        ()=>{
            const token = localStorage.getItem('token');
            if(token) {
                axios.post(
                    address+'/verifyToken',
                    {token: token}
                ).then((result)=>{
                    if(result.data.verified==true) {

                    } else {
                        window.location.href='/login'
                    }
                })
            }
            else {
                window.location.href='/login'
            }
        }
    );

    return (
        <div>

        </div>
    );

}