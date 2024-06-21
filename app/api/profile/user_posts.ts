import { readUserPostFromDb } from "../db_queries/profile";

export async function getPostThumbnails(user: string) {
    const post_ids = await readUserPostFromDb(user);
    return post_ids;
}