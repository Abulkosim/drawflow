import http from '../interceptors/http'

export async function createURL(data) {
  try {
    console.log(data)
    return http.post(`tg/bot/callback/url/create`, data)
  } catch (error) {
    console.error("Failed to create URL:", error);
    throw error;
  }
}