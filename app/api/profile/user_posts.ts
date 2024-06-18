import axios from "axios";
import { address } from "../api";
import { getToken } from "../actions/cookie_store";
import { readUserPostFromDb } from "../db_queries/profile";

export async function getPostThumbnails(user: string) {
    const post_ids = await readUserPostFromDb(user);
    return post_ids;
}