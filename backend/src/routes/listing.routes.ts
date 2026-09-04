import { Router } from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createListing, getListingById, updateListing, updateListingStatus } from "../controllers/listing.controller.js";
import { createListingSchema, updateListingSchema, updateListingStatusSchema } from "../validators/listing.validator.js"

const router = Router();

router.post("/", requireAuth, validate(createListingSchema), createListing);
router.get("/:id", getListingById);
router.patch("/:id", requireAuth, validate(updateListingSchema), updateListing);
router.patch("/:id/status", requireAuth, validate(updateListingStatusSchema), updateListingStatus);

export default router;