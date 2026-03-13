const express = require("express")
const router = express.Router()

const analyticsController = require("../controllers/analytics.controller")

router.get("/analytics", analyticsController.getAnalytics)

router.get(
"/analytics/customer-growth",
analyticsController.getCustomerGrowth
)

router.get(
"/revenue-by-category",
analyticsController.getRevenueByCategory
)

module.exports = router