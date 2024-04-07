import http from "../interceptors/http";

export async function fetchBots(user_id) {
  try {
    const response = await http.get(`tg/bot/user/bots?user_id=${user_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get bots:", error);
  }
}