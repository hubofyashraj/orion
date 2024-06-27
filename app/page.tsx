import { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { validSession } from "./api/auth/authentication";
import App from "./app";

export default async function Home(){
  const {status} = await validSession();

  if(status==401) redirect('/auth');

  const style: CSSProperties = {
    height: '100svh',
  }

  return (
    <main style={style}>
      <App/>
    </main>
  );
}
