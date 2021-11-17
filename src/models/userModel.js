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
    getUserAddresses: (userId) => sql`SELECT * FROM "address" WHERE user_id=${userId}`,

    /**
     * Get users saved payment information from the database
     * @param {number} userId id of the user who owns the paymet information
     * @returns {Promise<import('../@types/userModel').paymentInfoResponse}
     */
    getUserPaymentInfo: (userId) => sql`SELECT * FROM "payment_information" WHERE user_id=${userId}`,

    /**
     * Get users username and password from database
     * @param {string} usernmae users login username
     * @returns {Promise<import('../@types/userModel').userCredentialsResponse>}
     */
    getUserCredentials: (usernmae) => sql`SELECT username, password FROM "user" WHERE username=${usernmae}`,

    /**
     * Create new user with the given user info
     * @param {import('../@types/userModel').createUserInfo} user user data object with all user information except id
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/userModel').userReponse>}
     */
    createUser: (user) => sql`INSERT INTO "user" ${sql(user)} RETURNING *`,

    /**
     * Update users info with the new info
     * @param {number} userId users id in the database
     * @param {import('../@types/userModel').modifyUserInfo} user user date object without username, user id and user type
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/userModel').userReponse>}
     */
    modifyUser: (userId, user) => sql`UPDATE "user" SET ${sql(user)} WHERE user_id=${userId} RETURNING *`

};