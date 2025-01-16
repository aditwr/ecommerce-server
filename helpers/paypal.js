require("dotenv").config();
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AQeoigIlDGWCCqmjkcVHzPrzMs9L4_E1PYu3pKiwpZWR_nRxxqp7p83CS98-1whIavbAD1Ce8PUoou04",
  client_secret:
    "ECXiojMbImhEHCtr4i7zctbscA5kY5OKUufR4zMyCSsNzdM9oTMyjobNjfVGrPl3_GEpFfuZTZamj6Ry",
});

module.exports = paypal;
