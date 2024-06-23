import Redis from 'ioredis';

const redis_host = process.env.redis_host as string

const redis = new Redis({
    host: redis_host,
    port: 6379,
});


export default redis;
