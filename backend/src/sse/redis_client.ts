import Redis from 'ioredis';

const redis = new Redis({
    host: 'localhost',
    port: 6379
});


export default redis;

setInterval(async ()=>{
    const clients = await redis.hgetall('clients');
    console.log('clients', clients);
    
}, 5000)