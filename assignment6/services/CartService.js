const Cart = require("../models/Cart");
var ObjectId = require('mongodb').ObjectId;

module.exports = class CartService {
    static async getCartItems(id) {
        let data = {
            user_id: id
        }
        let items = await Cart.findOne(data).lean();
        if (items == null) {
            items = await this.createCart({ user_id: id, items: [], status: false })
        }
        return items
    }

    static async deleteCart(id) {
        let cart = await Cart.deleteOne({ user_id: id })
        return cart
    }

    static async getCartItemsWithDetails(id) {
        let data = {
            user_id: id
        }
        let items = await Cart.aggregate([{ $match: data },
        {
            $unwind: {
                path: '$items'
            }
        },
        {
            $lookup:
            {
                from: "mealkits",
                localField: "items.item_id",
                foreignField: "_id",
                as: "details"
            }
        },
        {
            $unwind: {
                path: '$details'
            }
        },
        ])
        return items
    }

    static async isCartExists(id) {
        let result = await Cart.findOne({ user_id: id }).lean();
        return result
    }

    static async isItemExistInCart(cartId, itemId) {
        let data = {
            _id: cartId,
            items: { $elemMatch: { item_id: itemId } }
        }
        let result = await Cart.findOne(data).lean();
        return result
    }

    static async createCart(data) {
        let result = await Cart.create(data);
        return result
    }

    static async addToCartItems(cartId, data) {
        let result = await Cart.updateOne({ "_id": cartId }, { $push: { "items": data } });
        return result
    }

    static async deleteItemById(cartId, id) {
        let result = await Cart.updateOne({ "_id": ObjectId(cartId) }, { '$pull': { "items": { "item_id": ObjectId(id) } } }, { upsert: true })
        return result
    }

    static async updateCartItem({ cartId, itemId, quantity }) {

        try {
            let result = await Cart.findOneAndUpdate(
                { "_id": ObjectId(cartId) },
                { $set: { "items.$[m].quantity": parseInt(quantity) } },
                { arrayFilters: [{ "m.item_id": ObjectId(itemId) }] }
            )
            return result
        } catch (err) {
            console.log('err', err)
        }

    }

}