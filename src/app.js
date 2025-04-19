import express from "express";
import cors from "cors";
import Stripe from "stripe";
import "dotenv/config.js";
const app = express();

app.use(cors());
app.use(express.json());

const stripeKey = process.env.STRIPE_KEY;
const stripeConfig = new Stripe(stripeKey);

app.post("/api/create/checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log("==================products", products);
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "INR",
      product_data: {
        name: product.dish,
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));
  console.log("==================lineItems", lineItems);
  const session = await stripeConfig.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancle",
  });

  res.json({ id: session.id });
});

app.listen(7000, () => {
  console.log("App is working in PORT 7000");
});
