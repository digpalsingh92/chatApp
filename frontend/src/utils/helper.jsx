import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export const setToken = (token) => {
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; ${
    process.env.NODE_ENV === "production" ? "secure;" : ""
  } samesite=strict`;
};

export const getToken = () => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return value;
    }
  }
  return null;
};

export const removeToken = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const generateAvatar = (seed) => {

  const seedName = ["Ryker", "Eliza", "Avery", "Easton", "Andrea" ]
  return createAvatar(adventurer, {
    seed: seedName[Math.floor(Math.random() * seedName.length)],
    size: 128,
  }).toDataUri();
};
