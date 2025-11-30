import { createServerFn } from "@tanstack/react-start";

const API_URL = process.env.API_URL as string;

export const api = createServerFn({ method: "GET" }).handler(
  async ({ context, data }) => {
    await fetch(API_URL);
  },
);
