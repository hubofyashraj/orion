import { NextRequest, NextResponse } from "next/server";
import { validSession } from "../auth/authentication";
import { readImage } from "@/app/utils/imageUploads";

export async function GET(req: NextRequest) {
    const {status, user} = await validSession();
    if(status==401) return new NextResponse('Unauthorized', {status});

    const type = req.nextUrl.searchParams.get('type')!;
    if(type == 'post-asset') {
        const asset_id = req.nextUrl.searchParams.get('asset-id')!;
        const asset = readImage(asset_id);
        if(asset) {
            if(asset=='') {return new NextResponse('Assset not found', {status: 404})};

            const buffer = Buffer.from(`${asset}`, 'base64');
            
            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            });
        }
        
    }else if(type=='pfp') {
            
        const user1 = req.nextUrl.searchParams.get('user');
        
        

        const pfp = readImage(user1??user!, 'pfp');
        if(pfp=='' || !pfp) return new NextResponse('PFP not uploaded', {status: 404});
        
        const buffer = Buffer.from(pfp, 'base64');
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-cache'
            }
        }); 
    }
    
    return new NextResponse('Internal Server Issue', {status: 500});
    
}