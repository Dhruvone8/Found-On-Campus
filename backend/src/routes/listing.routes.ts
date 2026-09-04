import { Router } from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createListing, getListingById, updateListing } from "../controllers/listing.controller.js";
import { createListingSchema, updateListingSchema } from "../validators/listing.validator.js"

const router = Router();

router.post("/", requireAuth, validate(createListingSchema), createListing);
router.get("/:id", getListingById);
router.patch("/:id", requireAuth, validate(updateListingSchema), updateListing);

export default router;