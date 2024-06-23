'use client';
import { Provider } from "react-redux";
import App from "./app";
import useSSE from "./sseProvider/useSSE";
// import store from "./sseProvider/store";

export default function SSE() {
    useSSE();
    return (
        // <Provider store={store}>
            <App/>
        // </Provider>
    )
}