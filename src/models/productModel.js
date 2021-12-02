import { sql } from '../datebase';

export const model = {
    /**
     * Gets all products in the database
     * @returns {Promise<import('../@types/productModel').productReponse>}
     */
    getProducts: () => sql`SELECT * FROM "product"`,

    /**
     * Get all product of a given restaurant
     * @param {number} restarauntId id of the restaurant which products to get
     * @returns {Promise<import('../@types/productModel').productReponse>}
     */
    getProductsOfRestaurant: (restarauntId) => sql`SELECT * FROM "product" WHERE restaurant_id=${restarauntId}`,

    /**
     * Get all special offers in the database
     * @returns {Promise<import('../@types/productModel').specialOfferResponse>}
     */
    getSpecialOffers: () => sql`SELECT * FROM "special_offer"`,

    /**
     * Get products special offer if it has one
     * @param {number} productId id of the product for which to get the special offer
     * @returns {Promise<import('../@types/productModel').specialOfferResponse>}
     */
    getSepcialOfferOfProduct: (productId) => sql`SELECT * FROM "special_offer" WHERE product_id=${productId}`,

    /**
     * Creates new product in the database
     * @param {import('../@types/productModel').createProduct[]} info product info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/productModel').productReponse>}
     */
    createProduct: (info) => sql`INSERT INTO "product" ${sql(info)} RETURNING *`,

    /**
     * Modify products information with the new info
     * @param {number} restaurantId id of the restaurant of the product
     * @param {number} productId id of the product to modify
     * @param {import('../@types/productModel').modifyProduct} info product info struct without ids
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/productModel').productReponse>}
     */
    modifyProduct: (restaurantId, productId, info) =>
        sql`UPDATE "product" SET ${sql(info)} WHERE product_id=${productId} and restaurant_id=${restaurantId} RETURNING *`,

    /**
     * Deletes a product from the database
     * @param {number} restaurantId id of the restaurant of the product
     * @param {number[]} id id of the product to delete
     * @returns {Promise<import('../@types/productModel').productReponse}
     */
    deleteProduct: (restaurantId, id) => sql`DELETE FROM "product" WHERE product_id IN (${id}) AND restaurant_id=${restaurantId} RETURNING *`,

    /**
     * Create new special offer for a product
     * @param {import('../@types/productModel').createSpecialOffer} info special offer info struct
     * @throws Error if the sql insert fails
     * @returns {Promise<import('../@types/productModel').specialOffer>}
     */
    createSpecialOffer: (info) => sql`INSERT INTO "special_offer" ${sql(info)} RETURNING *`,

    /**
     * Modify special offer information with the new info
     * @param {number} specialOfferId id of the special offer to modify
     * @param {import('../@types/productModel').modifySpecialOffer} info special offer info struct without ids
     * @throws Error if the sql update fails
     * @returns {Promise<import('../@types/productModel').specialOfferResponse>}
     */
    modifySpecialOffer: (specialOfferId, info) => sql`UPDATE "special_offer" SET ${sql(info)} WHERE offer_id=${specialOfferId} RETURNING *`,

    /**
     * Delete a special offer from the database
     * @param {number} id id of the special offer to delete
     * @returns {Promise<import('../@types/productModel').specialOfferResponse>}
     */
    deleteSpecialOffer: (id) => sql`DELETE FROM "special_offer" WHERE offer_id=${id} RETURNING *`,
};
