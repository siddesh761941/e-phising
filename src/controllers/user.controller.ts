import { Request, Response } from "express";
import mongoDB, { ObjectId } from "mongodb";

import mongoUtil from "../utils/mongo-connect.utils";
import { signJWT } from "../utils/jwt.utils";
import {
  fetchRetry,
  hashfunction,
  compareHash,
  generateRandomNumber
} from "../utils/common.utils";
import { sendTemporaryPassword } from "../utils/mail.utils";

const addUser = async (
  db: mongoDB.Db,
  name: string,
  email: string,
  password: string,
  verified: boolean,
  role: string,
  rest: any
) => {
  try {
    const result = await db
      ?.collection("users")
      .insertOne({ email, name, password, verified, role, ...rest });
    return result;
  } catch (err) {
    return false;
  }
};

export const signupHandler = async (req: Request, res: Response) => {
  const { email, name, password, role, ...rest } = req.body;
  const db = await mongoUtil.getDB();

  // Check user exists or not
  try {
    const user = await db?.collection("users").findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "User with the email already exist" });
    }

    // Generate password hash
    const hash = await fetchRetry(5, hashfunction, [password]);

    if (!hash) {
      return res
        .status(500)
        .json({ message: "Some error occured please try again" });
    }

    // Insert user to the DB
    const isUserAdded = await addUser(db, name, email, hash, false, role, rest);

    if (isUserAdded) {
      const accessToken = signJWT({ email, name, role }, "10m");

      const refreshToken = signJWT({ email, name, role }, "1y");

      // Set access and refresh token in cookie
      res.cookie("accessToken", accessToken, {
        maxAge: 30000000,
        httpOnly: true,
        sameSite: "none",
        secure: true
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
        sameSite: "none",
        secure: true
      });

      res.cookie("role", role, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
        sameSite: "none",
        secure: true
      });

      return res.status(200).json({
        email,
        name,
        role,
        message: "User added succefully"
      });
    }

    res.status(500).json({ message: "Some error occured please try again" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Some error occured please try again" });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = await mongoUtil.getDB();

  // Verify the user exist or not from DB
  try {
    const user = await db?.collection("users").findOne({ email });
    console.log(password, user?.password.length);
    if (!user) {
      return res.status(404).json({
        message: "Email or password does not match with our records."
      });
    }

    // Compare the password
    const result = compareHash(password.toString(), user.password);

    if (!result) {
      return res.status(404).json({
        message: "Email or password does not match with our records."
      });
    } else if (result === "error") {
      return res
        .status(500)
        .json({ message: "Some error occured please try again" });
    }

    const accessToken = signJWT(
      { email, name: user?.name, role: user?.role },
      "5m"
    );

    const refreshToken = signJWT(
      { email, name: user?.name, role: user?.role },
      "1y"
    );

    // Set access and refresh token in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 30000000,
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.cookie("role", user?.role, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.status(200).json({
      email,
      name: user.name,
      role: user?.role,
      message: "Logged in successfully"
    });
  } catch (err) {
    console.log(err);
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  // Set access and refresh token in cookie
  res.cookie("accessToken", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.cookie("refreshToken", "", {
    maxAge: 0, // 1 year
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  res.cookie("role", "", {
    maxAge: 0, // 1 year
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  return res.status(200).send({ message: "logged out successfully" });
};

export const changePasswordHandler = async (req: Request, res: Response) => {
  // @ts-ignore
  const email = req?.user?.email;
  const db = await mongoUtil.getDB();
  const { oldPassword, newPassword } = req.body;

  console.log(email);
  try {
    const user = await db?.collection("users").findOne({ email });

    // Compare the password
    // @ts-ignore
    const result = compareHash(oldPassword.toString(), user.password);

    if (!result) {
      return res.status(404).json({
        message: "Your current password does not match with our records."
      });
    } else if (result === "error") {
      return res
        .status(500)
        .json({ message: "Some error occured please try again" });
    }

    const isPasswordChanged = await setPassword(email, newPassword);
    if (isPasswordChanged) {
      return res.status(200).json({ message: "Password changed successfully" });
    }
    return res.status(304).json({ message: "Unable to change password" });
  } catch (err) {
    res.status(500).json({ message: "Some error occured please try again" });
  }
};

export const setPassword = async (email: string, password: string) => {
  const db = await mongoUtil.getDB();

  // Generate password hash
  const hash = await fetchRetry(5, hashfunction, [password]);

  if (!hash) {
    return false;
  }

  try {
    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: { password: hash } });
    return result;
  } catch (err) {
    return false;
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body;
  const db = await mongoUtil.getDB();
  const password = generateRandomNumber(6);
  try {
    const result = await db?.collection("users").findOne({ email });
    if (result) {
      const isPasswordChanged = await setPassword(email, password);
      if (isPasswordChanged) {
        sendTemporaryPassword(email, password);
        return res
          .status(200)
          .json({ message: "Temproary password is sent to your mail Id" });
      }
    }
    res.status(500).json({
      message: "Unable to generate new password please try again."
    });
  } catch (err) {
    res.status(500).json({ message: "Some error occured please try again" });
  }
};

export const usersListHandler = async (req: Request, res: Response) => {
  const db = await mongoUtil.getDB();

  try {
    const users = await db
      ?.collection("users")
      .find({ role: "user" })
      .toArray();
    if (!users) {
      return res.status(404).json({ message: "0 Users found." });
    }

    res.status(200).json({ users, message: "success" });
  } catch (err) {
    return res.status(500).json({
      message: "Unable to get users, please try again later."
    });
  }
};
