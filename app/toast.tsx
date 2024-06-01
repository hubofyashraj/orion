

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.min.css'

export function getSimpleToast(msg: string) {
    const notify = ()=>toast(msg);
    return (
        <div></div>
    )
}