const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id:String,
    category:String,
    tags:Array,
    mainurl:String,
    otherurl:Array,
    title:String,
    price:Object,
    review:Array,
})

const Product = mongoose.model("Product",productSchema);

module.exports = Product;
