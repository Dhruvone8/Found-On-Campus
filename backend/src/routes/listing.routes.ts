import { Router } from 'express';
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createListing } from "../controllers/listing.controller.js";
import { createListingSchema } from "../validators/listing.validator.js"

const router = Router();

router.post("/", requireAuth, validate(createListingSchema), createListing);

export default router;