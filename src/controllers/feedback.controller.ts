import { Request, Response } from "express";
import mongoDB from "mongodb";

import mongoUtil from "../utils/mongo-connect.utils";

export const addFeedbackHandler = async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req?.user;
  const { feedback } = req.body;
  const db = await mongoUtil.getDB();

  try {
    const result = await db
      ?.collection("feedback")
      .insertOne({ feedback, user });

    if (!result) {
      res.status(500).json({
        message: "Unable to add feedback, please try again later."
      });
    }

    res.status(200).json({
      message: "Feedback added successfully."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to add feedback, please try again later."
    });
  }
};

export const listFeedbackHandler = async (req: Request, res: Response) => {
  const db = await mongoUtil.getDB();

  try {
    const feedbacks = await db?.collection("feedback").find({}).toArray();
    if (!feedbacks) {
      return res.status(404).json({ message: "0 feedbacks found." });
    }

    res.status(200).json({ feedbacks, message: "success" });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to get feedbacks, please try again later."
    });
  }
};
