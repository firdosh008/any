const express = require("express");
const router = new express.Router();
const Products = require("../models/productSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

//api calls ke lie ye route creat kia he

//get product data api
router.get("/getproducts", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(201).json(products);
  } catch (error) {
    console.log(error);
  }
});

//get perticular data of a product

router.get("/getproductone/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    //console.log(_id);

    const individual_data = await Products.findOne({ id: _id });
    //console.log(individual_data);

    res.status(201).json(individual_data);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

//register user data
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, cpassword } = req.body;
  //console.log(req.body);
  if (!name || !email || !mobile || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill the field properly" });
  }

  try {
    const preuser = await User.findOne({ email: email });
    if (preuser) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password not matching" });
    } else {
      const user = new User({ name, email, mobile, password, cpassword });
      const storedata = await user.save();
      res
        .status(201)
        .json({ message: "user registered successfully", data: storedata });
    }
  } catch (error) {
    console.log(error);
  }
});

//login user data
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //console.log(req.body);
  if (!email || !password) {
    return res.status(401).json({ error: "Please fill the field properly" });
  }

  try {
    const userlogin = await User.findOne({ email: email });
    //console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);

      if (isMatch) {
        //token generate

        const token = await userlogin.generateAuthToken();
        console.log(token);

        //cookie generate
          res.cookie("Anycartweb", token, {
          expires: new Date(Date.now() + 90000000000),
          httpOnly: true,
        });
        res
          .status(201)
          .json({ message: "user login successfully", data: userlogin });
      } else {
        res.status(402).json({ error: "Wrong Password" });
      }
    } else {
      res.status(403).json({ error: "No User found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Invalid details" });
  }
});

//adding data to cart

router.post("/addtocart/:id", authenticate, async (req, res) => {
  try {
    const _id = req.params.id;
    //console.log(_id);
    const cart = await Products.findOne({ id: _id });

    const user = await User.findOne({ _id: req.userID });
    //console.log(user);
    if (user) {
      const cartdata = await user.addtoCart(cart);
      await user.save();
      res.status(201).json({ message: "product added to cart", data: user });
    } else {
      res.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unknow error" });
  }
});

//geting cart data
router.get("/cartdetails", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userID });
    //console.log(user);
    if (user) {
      res.status(201).json({ data: user });
    } else {
      res.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

//get valid user
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const validuser = await User.findOne({ _id: req.userID });
    //console.log(user);
    if (validuser) {
      res.status(201).json({ data: validuser });
    } else {
      res.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

//remove cart data
router.post("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((curele) => {
      return curele.id !== id;
    });
    await req.rootUser.save();
    res
      .status(201)
      .json({ message: "product removed from cart", data: req.user });
  } catch (error) {
    console.log("error:" + error);
    res.status(401).json({ error: "Unknow error" });
  }
});

//logout user
router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curele) => {
      return curele.token !== req.token;
    });
    res.clearCookie("Anycartweb", { path: "/" });
    await req.rootUser.save();
    res.status(201).json({ message: "user logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unknow error" });
  }
});

module.exports = router;
