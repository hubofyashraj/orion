import { Request } from "express"

export type customRequest = Request & {
    user?: string
} 

