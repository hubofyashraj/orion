export function getCroppedImage(image: HTMLImageElement, startX: number, startY: number, endX: number, endY: number) : Promise<string> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    const scaleX = naturalWidth/image.width;
    const scaleY  = naturalHeight/image.height;

    const width = (endX-startX) * scaleX;
    const height = (endY-startY) * scaleY;

    canvas.width=width;
    canvas.height=height;
    console.log(image.height, image.width);
    console.log('new dimestions', width, height);
    


    ctx.drawImage(
        image,
        scaleX*startX,
        scaleY*startY,
        width,
        height,
        0,
        0,
        width,
        height
    )

    return new Promise((resolve)=>{
        canvas.toBlob((blob)=>{
            const url = URL.createObjectURL(blob!);
            resolve(url)
        }, 'image/jpeg')
    });
}