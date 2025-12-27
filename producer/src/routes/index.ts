import { Router } from "express";
import Controller from "../controller";
import middleware from "../middleware";

const router = Router();
const controller = new Controller()

router.post("/notify", middleware, (req,res) => controller.sendNotification(req,res))

export default router