import { NextRequest, NextResponse } from "next/server";
import { getToken } from "../auth/cookie_store";
import { fetchPFP } from "../profile/profile";
import { validSession } from "../auth/authentication";

const address = process.env.express_uri as string;

export async function GET(req: NextRequest) {
    const {status} = await validSession();
    if(status==401) return new NextResponse('Unauthorized', {status});

    const token = await getToken();    
    const type = req.nextUrl.searchParams.get('type')!;
    if(type == 'post-asset') {
        const asset_id = req.nextUrl.searchParams.get('asset-id')!;
        const assets = await fetch(address + `/post/fetchPostAssets?asset_id=${asset_id}`, {headers: {
            'Authorization': token!
        }})
        if(assets.ok) {
            const body = await assets.json();
            
            if(body.asset=='') {return new NextResponse('Assset not found', {status: 404})};

            const buffer = Buffer.from(`${body.asset}`, 'base64');
            
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            });            
        }
    }else if(type=='pfp') {
            
        const user = req.nextUrl.searchParams.get('user');
        const pfp = await fetchPFP(user??undefined);
        if(pfp=='') return new NextResponse('PFP not uploaded', {status: 404});
        
        const buffer = Buffer.from(pfp, 'base64');
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg'
            }
        }); 
    }
    
    return new NextResponse('Internal Server Issue', {status: 500});
    
}