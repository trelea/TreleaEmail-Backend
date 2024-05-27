import { Router } from "express";
import { query } from "express-validator";
import { available } from "../controllers/user/available.controller";

const router: Router = Router();

router.get('/available', query('name').trim().customSanitizer(value => String(value).replace(/\s+/g, '')), available)

export default router;