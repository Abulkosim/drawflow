import http from '../interceptors/http'

export async function createURL(data) {
  try {
    return http.post(`tg/bot/callback/url/create`, data)
  } catch (error) {
    console.error("Failed to create URL:", error);
  }
}

export async function createTemplate(alias) {
  try {
    return http.post(`dont/create/api`, alias)
  } catch (error) {
    console.error("Failed to create template:", error);
  }
}