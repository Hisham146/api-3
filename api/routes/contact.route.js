import express from "express";
import {postContact, getContacts, selectedDeleteContact} from '../controllers/contact.controller.js'

const router = express.Router();

router.post("/post", postContact);
router.get("/get", getContacts);
router.delete("/delete/:ids", selectedDeleteContact);
export default router;
