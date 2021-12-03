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
    getUserCredentials: (usernmae) => sql`SELECT user_id, username, password, type FROM "user" WHERE username=${usernmae}`,

    /**
     * Create new user with the given user info
     * @param {import('../@types/userModel').createUserInfo} user user data object with all user information except id
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/userModel').userReponse>}
     */
    createUser: (user) => sql`INSERT INTO "user" ${sql(user)} RETURNING *`,

    /**
     * Update users info with the new info
     * @param {number} userId id of the user which to modify
     * @param {import('../@types/userModel').modifyUserInfo} user user date object without username, user id and user type
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/userModel').userReponse>}
     */
    modifyUser: (userId, user) => sql`UPDATE "user" SET ${sql(user)} WHERE user_id=${userId} RETURNING *`,

    /**
     * Delete a user from the database
     * @param {number} id user accounts id
     * @returns
     */
    deleteUser: (id) => sql`DELETE FROM "user" WHERE user_id=${id}`,

    /**
     * Create new saved payment information
     * @param {import('../@types/userModel').createPaymentInfo} info payment option information
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/userModel').paymentInfoResponse>}
     */
    createPaymentInfo: (info) => sql`INSERT INTO "payment_information" ${sql(info)} RETURNING *`,

    /**
     * Deletes the users saved payment information from the database
     * @param {number} userId id of the user
     * @param {number} id id of the payment info to delete
     * @returns {Promise<import('../@types/userModel').paymentInfoResponse>}
     */
    deletePaymentInfo: (userId, id) => sql`DELETE FROM "payment_information" WHERE payment_information_id=${id} AND user_id=${userId} RETURNING *`,

    /**
     * Creates new entry for the users addresses
     * @param {import('../@types/userModel').createAddressInfo} info users address information
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/userModel').addressResponse>}
     */
    createAddress: (info) => sql`INSERT INTO "address" ${info} RETURNING *`,

    /**
     * Deletes the users address from the database
     * @param {number} id address information id
     * @returns {Promise<import('../@types/userModel').addressResponse>}
     */
    deleteAddress: (userId, id) => sql`DELETE FROM "address" WHERE address_id=${id} AND user_id=${userId} RETURNING *`,
};
