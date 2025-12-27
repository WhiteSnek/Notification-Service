import { Request, Response } from "express";
import { notificationSchema } from "../schema";
import Service from "../service";
import { ZodError } from "zod";
import { ApiResponse } from "../utils/ApiResponse";

class Controller {
  private service: Service;
  constructor() {
    this.service = new Service();
  }
  async sendNotification(req: Request, res: Response) {
    try {
      const data = notificationSchema.parse(req.body);
      const clientId = req.clientId;
      const allowedChannels = req.channels;

      if (!clientId) {
        return res.status(401).json(new ApiResponse(401, {}, "Unauthorized!"));
      }

      if (!allowedChannels || allowedChannels.length === 0) {
        return res.status(401).json(new ApiResponse(401, {}, "Unauthorized!"));
      }

      if (
        data.channels &&
        data.channels.some((channel) => !allowedChannels.includes(channel))
      ) {
        return res
          .status(401)
          .json(
            new ApiResponse(
              401,
              {},
              "You are not allowed to use one or more channels"
            )
          );
      }

      const payload = {
        userId: data.userId,
        eventType: data.eventType,
        data: data.data,
        channels: data.channels || allowedChannels,
        priority: data.priority || "low",
        sender: data.sender,
        reciever: data.reciever,
        clientId,
      };

      await this.service.sendNotification(payload);

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Notification sent successfully!"));
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              error,
              "All fields are required and must be valid!"
            )
          );
      }

      return res
        .status(500)
        .json(new ApiResponse(500, {}, "Internal server error!"));
    }
  }
}

export default Controller;
