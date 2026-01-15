const db = require("./src/models");

async function check() {
  try {
    console.log("Loaded models:", Object.keys(db));

    const Order = db.Order;
    const User = db.User;

    if (!Order)
      console.error("BIG PROBLEM: Order model not found in db object");
    if (!User) console.error("BIG PROBLEM: User model not found in db object");

    console.log("Order associations:", Object.keys(Order.associations));
    console.log("User associations:", Object.keys(User.associations));

    if (Order.associations.user) {
      console.log("PASS: Order belongsTo User is defined.");
    } else {
      console.error("FAIL: Order belongsTo User is MISSING.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

check();
