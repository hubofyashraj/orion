import { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { validSession } from "./api/actions/authentication";
import SSE from "./SSE";

export default async function Home(){
  const {status} = await validSession();

  if(status==401) redirect('/auth');

  const style: CSSProperties = {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    height: '100%',
  }

  return (
    <main style={style}>
      <SSE/>
    </main>
  );
}
