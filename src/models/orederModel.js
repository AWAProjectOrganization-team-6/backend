import { sql } from '../datebase';

export const model = {
    /**
     * Gets all orders from database
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    getOrders: () => sql`SELECT * FROM "order"`,

    /**
     * Get one order from the database
     * @param {number} id id of the order which to get
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    getOrder: (id) => sql`SELECT * FROM "order" WHERE order_id=${id}`,

    /**
     * Get all orders of a user using the users id
     * @param {number} userId id of the user for which to get the orders
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    getUserOrders: (userId) => sql`SELECT * FROM "order" WHERE user_id=${userId}`,

    /**
     * Get all orders of a restaurant using the restaurant id
     * @param {number} restaurantId id of the restaurant for which to get the orders
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    getRestaurantOrders: (restaurantId) => sql`SELECT * FROM "order" WHERE restaurant_id=${restaurantId}`,

    /**
     * Get all products of a order
     * @param {number} orderId order id for which to get product list
     * @returns {Promise<import('../@types/orderModel').orderProductResponse>}
     */
    getOrderProducts: (orderId) => sql`SELECT p.* FROM "product" p JOIN "order_product" o ON (p.product_id = o.product_id) WHERE order_id=${orderId}`,

    /**
     * Create a new order whith the given information
     * @param {import('../@types/orderModel').createOrder} info order info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    createOrder: (info) => sql`INSERT INTO "order" ${sql(info)} RETURNING *`,

    /**
     * Modify order information with the new information
     * @param {number} orderId id of the order which to modify
     * @param {import('../@types/orderModel').modifyOrder} info order info struct without ids
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    modifyOrder: (orderId, info) => sql`UPDATE "order" SET ${sql(info)} WHERE order_id=${orderId} RETURNING *`,

    /**
     * Delete a order from database
     * @param {number} id id of the order which to delete
     * @returns {Promise<import('../@types/orderModel').orderResponse>}
     */
    deleteOrder: (id) => sql`DELETE FROM "order" WHERE order_id=${id} RETURNING *`,

    /**
     * Create new order product entry to database
     * @param {import('../@types/orderModel').orderProduct} info order_product table entry info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/orderModel').orderProductResponse>}
     */
    createOrderProduct: (info) => sql`INSERT INTO "order_product" ${sql(info)} RETURNING *`,

    /**
     * Delete product list of a given order
     * @param {number} orderId orders id for which to delete product list
     * @returns {Promise<import('../@types/orderModel').orderProductResponse>}
     */
    deleteOrderProduct: (orderId) => sql`DELETE FROM "order_product" WHERE order_id=${orderId} RETURNING *`,
};
