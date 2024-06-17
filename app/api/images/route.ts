import { NextRequest, NextResponse } from "next/server";
import { address } from "../api";
import { getToken } from "../actions/cookie_store";
import { fetchPFP } from "../profile/profile";


export async function GET(req: NextRequest) {
    
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
                    'Content-Type': 'image/png'
                }
            });            
        }
    }else if(type=='pfp') {
            
        const user = req.nextUrl.searchParams.get('user');
        const pfp = await fetchPFP(user??undefined);
        
        const buffer = Buffer.from(pfp, 'base64');

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png'
            }
        }); 
    }
    
    return new NextResponse();
    
}