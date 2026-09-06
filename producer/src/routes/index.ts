import { Router } from "express";
import Controller from "../controller";
import middleware from "../middleware";

const router = Router();
const controller = new Controller()

router.post("/notify", middleware, (req,res) => controller.sendNotification(req,res))
router.post("/add-template", middleware, (req,res) => controller.addTemplate(req,res))

export default router