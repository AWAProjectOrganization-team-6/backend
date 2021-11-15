import { sql } from '../datebase';


export const model = {

    /** 
     * Get all users from database.
     * @return {Promise<import('../@types/userModel').userReponse>}
     */
    getUsers: () => sql`SELECT * FROM "user"`,

    /**
     * Get single user using id.
     * @param {number} id user id
     * @returns {Promise<import('../@types/userModel').userReponse>}
     */
    getUser: (id) => sql`SELECT * FROM "user" WHERE user_id=${id}`,

    /**
     * Get addresses of user based on `userId`.
     * @param {number} userId id of the user who owns the address
     * @returns {Promise<import('../@types/userModel').addressResponse}
     */
    getUserAddresses: (userId) => sql`SELECT * FROM "address" WHERE user_id=${userId}`

};