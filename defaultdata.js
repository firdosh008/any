const Product = require("./models/productSchema");
const productData = require("./data/productsdata");



const defaultData = async () => {
    try {

      await Product.deleteMany({});
      const storeData= await Product.insertMany(productData);
        console.log("Data imported successfully");
    } catch (error) {
        console.log("Error: ", error.message);
    }
}

module.exports = defaultData;
