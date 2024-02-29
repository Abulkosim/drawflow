import http from "../interceptors/http";

export async function fetchLocales(bot_id) {
  try {
    const response = await http.get(`tg/bot/flow/locales?bot_id=${bot_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get locales:", error);
  }
}

export async function create(data) {
  try {
    const response = await http.post(`tg/bot/text/create`, data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create locale:", error);
  }
}