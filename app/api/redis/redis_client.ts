import Redis from 'ioredis';

const redis_host = process.env.redis_uri as string




let redis: Redis | undefined

export async function redisInit() {
    redis = new Redis({
        host: redis_host,
        port: 6379,
        
    });
}


export default redis;
