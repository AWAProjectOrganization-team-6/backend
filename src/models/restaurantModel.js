import { sql } from '../datebase';

export const model = {
    /**
     * Gets all restaurants from database
     * @returns {Promise<import('../@types/restaurantModel').restaurantResponse>}
     */
    getRestaurants: () => sql`SELECT * FROM "restaurant"`,

    /**
     * Gets singele restaurant from the databese using the given id
     * @param {number} id id of the wanted restaurant
     * @returns {Promise<import('../@types/restaurantModel').restaurantResponse>}
     */
    getRestaurant: (id) => sql`SELECT * FROM "restaurant" WHERE restaurant_id=${id}`,

    /**
     * Creates a new restaurant in the database
     * @param {import('../@types/restaurantModel').createRestaurantInfo} info restaurants info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/restaurantModel').restaurantResponse>}
     */
    createRestaurant: (info) => sql`INSERT INTO "restaurant" ${sql(info)} RETURNING *`,

    /**
     * Update restaurant info with the new info
     * @param {number} restaurantId id of the restaurant to modify
     * @param {import('../@types/restaurantModel').modifyRetaurantInfo} info restaurant info without restaurant_id, user_id and star_rating
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/restaurantModel').restaurantResponse>}
     */
    modifyRestaurant: (restaurantId, info) => sql`UPDATE "restaurant" SET ${sql(info)} WHERE restaurant_id=${restaurantId} RETURNING *`,

    /**
     * Deletes a restaurant from the database
     * @param {number} id id of the restaurant to delete
     * @returns {Promise<import('../@types/restaurantModel').restaurantResponse>}
     */
    deleteRestaurant: (id) => sql`DELETE FROM "restaurant" WHERE restaurant_id=${id} RETURNING *`,

    /**
     * Get all operating hours of an restaurant
     * @param {number} restaurantId id of the restaurant which operating hour entryes to get
     * @returns {Promise<import('../@types/restaurantModel').operatingHoursResponse>}
     */
    getOpearatingHours: (restaurantId) => sql`SELECT FROM "operating_hours" WHERE restaurant_id=${restaurantId}`,

    /**
     * Creates new entry to operating hours
     * @param {import('../@types/restaurantModel').createOperatingHoursInfo} info operating hours info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/restaurantModel').operatingHoursResponse>}
     */
    createOperatingHours: (info) => sql`INSERT INTO "operating_hours" ${sql(info)} RETURNING *`,

    /**
     * Updates an operating hours entry with the given information
     * @param {number} operatingHoursId id of the entry to modify
     * @param {import('../@types/restaurantModel').modifyOperatingHoursInfo} info opearating hours info without opearating_hours_id and restaraunt_id
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/restaurantModel').operatingHoursResponse>}
     */
    modifyOperatingHours: (operatingHoursId, info) => sql`UPDATE "operating_hours" SET ${sql(info)} WHERE opeatrating_hours_id=${operatingHoursId} RETURNING *`,

    /**
     * Delete an entry from operating houres
     * @param {number} id id of the entry to delete
     * @returns {Promise<import('../@types/restaurantModel').operatingHoursResponse>}
     */
    deleteOperatingHours: (id) => sql`DELETE FROM "operating_hours" WHERE operating_hours_id=${id} RETURNING *`,
};
