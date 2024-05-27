import { Router } from "express";
import { authorized } from "../services/authorized.service";
import { emailReqBody } from "../dtos/email.body.validation";
import { validateEmailReq } from "../midllewares/email.validate";

const router: Router = Router();

/**
 * 
 * AVAILABLE LABELS
 * /inbox
 * /sent
 * /starred
 * 
 * /archived    -> store original locations for undo
 * /spam        -> store original locations for undo
 * 
 * /trash    
 * 
 */

import { sendEmail } from "../controllers/mail/send.email.controller";
import { getInbox, getInboxById } from "../controllers/mail/get.inbox.controller";
import { getSentEmails, getSentEmailsById } from "../controllers/mail/get.sent.controller";

import { getStarredEmails, getStarredEmailsById } from "../controllers/mail/get.starred.controller";
import { startEmail } from "../controllers/mail/start.email.controller";
import { unstartEmail } from "../controllers/mail/unstar.email.controller";
import { starEmailMidlleware } from "../midllewares/star.midlleware";

import { getArchivedEmails, getArchivedEmailsById } from "../controllers/mail/get.archived.controller";
import { archiveEmail } from "../controllers/mail/archive.email.controller";
import { unarchiveEmail } from "../controllers/mail/unarchive.email.controller";
import { archiveEmailMidlleware } from "../midllewares/archive.midlleware";

import { getSpammed, getSpammedById } from "../controllers/mail/get.spammed.controller";
import { spamEmail } from "../controllers/mail/spam.email.controller";
import { unspamEmail } from "../controllers/mail/unspam.email.controller"
import { spamEmailMidlleware } from "../midllewares/spam.midlleware";

import { getTrashedEmails, getTrashedEmailsById } from "../controllers/mail/get.trash.controller";
import { trashEmail } from "../controllers/mail/trash.email.controller";
import { trashEmailMidlleware } from "../midllewares/trash.midlleware";
import { deleteEmail } from "../controllers/mail/delete.email.controller";
import { cleanupTrash } from "../controllers/mail/clean.trash.controller";

import { updateEmailMidlleware } from "../midllewares/update.midlleware";
import { updateEmail } from "../controllers/mail/update.email.controller";
import { updateEmailReqBody } from "../dtos/update.email.validation";
import { validateUpdateEmailReq } from "../midllewares/update.email.validate";

import { destroyEmail } from "../controllers/mail/destroy.email.controller";

import { getAllEmails, getAllEmailsById } from "../controllers/mail/get.all.controller";


// ROUTES
router.get('/inbox', authorized, getInbox);
router.get('/inbox/:email_id', authorized, getInboxById);

router.get('/sent',  authorized, getSentEmails);
router.get('/sent/:email_id',  authorized, getSentEmailsById);

router.get('/starred', authorized, getStarredEmails);
router.get('/starred/:email_id', authorized, getStarredEmailsById);
router.put('/star/:email_id', authorized, starEmailMidlleware, startEmail);
router.put('/unstart/:email_id', authorized, starEmailMidlleware, unstartEmail);

router.get('/archived', authorized, getArchivedEmails);
router.get('/archived/:email_id', authorized, getArchivedEmailsById);
router.put('/archive/:email_id', authorized, archiveEmailMidlleware, archiveEmail);
router.put('/unarchive/:email_id', authorized, unarchiveEmail);

router.get('/spamed', authorized), getSpammed;
router.get('/spamed/:email_id', authorized, getSpammedById);
router.put('/spam/:email_id', authorized, spamEmailMidlleware, spamEmail);
router.put('/unspam/:email_id', authorized, unspamEmail);

router.get('/trash', authorized, getTrashedEmails);
router.get('/trash/:email_id', authorized, getTrashedEmailsById);
router.put('/trash/:email_id', authorized, trashEmailMidlleware, trashEmail);
router.delete('/trash/:email_id', authorized, deleteEmail);
router.delete('/trash/cleanup', authorized, cleanupTrash);

router.get('/all', authorized, getAllEmails);
router.get('/all/:email_id', authorized, getAllEmailsById);

router.post('/send', authorized, emailReqBody, validateEmailReq, sendEmail);
router.put('/update/:email_id', authorized, updateEmailMidlleware, updateEmailReqBody, validateUpdateEmailReq, updateEmail); 
router.delete('/destroy/:email_id', authorized, destroyEmail);

export default router;