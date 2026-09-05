import { Router } from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate, validateQuery } from "../middleware/validate.middleware.js";
import { createListing, getListingById, updateListing, updateListingStatus, getMyListings } from "../controllers/listing.controller.js";
import { createListingSchema, updateListingSchema, updateListingStatusSchema, paginationSchema } from "../validators/listing.validator.js"

const router = Router();

router.post("/", requireAuth, validate(createListingSchema), createListing);
router.get("/me", requireAuth, validateQuery(paginationSchema), getMyListings);
router.get("/:id", getListingById);
router.patch("/:id", requireAuth, validate(updateListingSchema), updateListing);
router.patch("/:id/status", requireAuth, validate(updateListingStatusSchema), updateListingStatus);

export default router;