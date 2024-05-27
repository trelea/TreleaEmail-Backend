import { Router } from "express";
import { authorized } from "../services/authorized.service";
import { deleteAccount } from "../controllers/account/delete.account.controller";

const router: Router = Router();

router.delete('/delete', authorized, deleteAccount);
/**
 * More Routes For Account Settings Here...
 */

export default router;