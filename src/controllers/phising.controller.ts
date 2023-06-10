import { Request, Response } from "express";
import { ObjectId } from "mongodb";

import mongoUtil from "../utils/mongo-connect.utils";

export const addLinkHandler = async (req: Request, res: Response) => {
  const { link, description, isSecured } = req.body;
  const db = await mongoUtil.getDB();

  try {
    const isLinkAlreadyExist = await db?.collection("links").findOne({ link });
    if (isLinkAlreadyExist) {
      return res.status(409).json({ message: "Link already exist" });
    }

    const result = await db
      ?.collection("links")
      .insertOne({ link, description, isSecured });

    if (!result) {
      return res.status(500).json({
        message: "Unable to add link, please try again later."
      });
    }

    res.status(200).json({
      message: "Link added to the phising website list successfully."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to add link, please try again later."
    });
  }
};

export const removeLinkHandler = async (req: Request, res: Response) => {
  const { linkId } = req.params;
  const db = await mongoUtil.getDB();

  try {
    const isLinkAlreadyExist = await db
      ?.collection("links")
      .findOne({ _id: new ObjectId(linkId) });
    if (!isLinkAlreadyExist) {
      return res
        .status(404)
        .json({ message: "Link doesn't exist in our Database" });
    }

    const result = await db
      ?.collection("links")
      .deleteOne({ _id: new ObjectId(linkId) });

    if (!result) {
      res.status(500).json({
        message: "Unable to remove link, please try again later."
      });
    }

    res.status(200).json({
      message: "Link removed successfully."
    });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to remove link, please try again later."
    });
  }
};

export const listHandler = async (req: Request, res: Response) => {
  const db = await mongoUtil.getDB();

  try {
    const links = await db
      ?.collection("links")
      .aggregate([{ $sample: { size: 30 } }])
      .limit(30)
      .toArray();
    if (!links) {
      return res.status(404).json({ message: "0 Links found." });
    }

    res.status(200).json({ links, message: "success" });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to get links, please try again later."
    });
  }
};

export const checkWebsiteHandler = async (req: Request, res: Response) => {
  const db = await mongoUtil.getDB();
  const { link } = req.body;

  try {
    const linkDetails = await db?.collection("links").findOne({ link });
    if (!linkDetails) {
      return res.status(404).json({
        message:
          "There is no information about the given website, request admin to add the details about the website."
      });
    }
    res.status(200).json({ linkDetails, message: "success" });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to get the link details, please try again later."
    });
  }
};

export const updateLinkHandler = async (req: Request, res: Response) => {
  const db = await mongoUtil.getDB();
  const { description } = req.body;
  const { linkId } = req.params;
  console.log(linkId, description);

  try {
    const result = await db
      .collection("links")
      .updateOne({ _id: new ObjectId(linkId) }, { $set: { description } });
    console.log(result);
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
