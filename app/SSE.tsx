'use client';
import { Provider } from "react-redux";
import App from "./app";
import store from "./sseProvider/store";

export default function SSE() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}