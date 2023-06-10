import bcrypt from "bcryptjs";

require("dotenv").config();

export const hmsHeaders = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MANAGEMENT_TOKEN}`
    }
  };
};

export const fetchRetry = async (
  count: number,
  fn: Function,
  params?: any[]
) => {
  for (let i = 0; i < count; i++) {
    const data = await fn(params?.join(","));
    if (data) {
      return data;
    }
  }
  return null;
};

export const hashfunction = async (password: string) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    return false;
  }
};

export const compareHash = (password: string, hash: string) => {
  try {
    const result = bcrypt.compareSync(password, hash);
    return result;
  } catch (err) {
    return "error";
  }
};

// Generate random numbers
export const generateRandomNumber = (length: number) =>
  Math.random().toFixed(length).split(".")[1];
