import http from '../interceptors/http'

export async function fetchLocales() {
  try {
    const response = await http.get('tg/locales')
    return response.data.data;
  } catch (error) {
    console.error("Failed to get locales:", error);
  }
}

export async function fetchBotLocales(bot_id) {
  try {
    const response = await http.get(`tg/bot/flow/locales?bot_id=${bot_id}`)
    return response.data.data;
  } catch (error) {
    console.error("Failed to get bot locales:", error);
  }
}

export async function updateBotLocale(data) {
  try {
    const response = await http.post(`tg/bot/locale/update`, data)
    return response.data.data;
  } catch (error) {
    console.error("Failed to update bot locale:", error);
  }
}
