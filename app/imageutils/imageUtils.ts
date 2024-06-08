export function getCroppedImage(image: HTMLImageElement, startX: number, startY: number, _width: number, _height: number) : Promise<string> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    const scaleX = naturalWidth/image.width;
    const scaleY  = naturalHeight/image.height;

    const width = (_width) * scaleX;
    const height = (_height) * scaleY;

    canvas.width=width;
    canvas.height=height;
    
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