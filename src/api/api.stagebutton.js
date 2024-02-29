import http from '../interceptors/http'

export async function fetchStages(bot_id) {
  try {
    const response = await http.get(`v1/bot/stage/list?bot_id=${bot_id}`)
    return response.data.data;
  } catch (error) {
    console.error("Failed to get stages:", error);
  }
}

export async function fetchURLs(user_id) {
  try {
    const response = await http.get(`tg/bot/user/callback_urls?user_id=${user_id}`)
    return response.data.data;
  } catch (error) {
    console.error("Failed to get urls:", error);
  }
}

export async function fetchButtons(user_id) {
  try {
    const response = await http.get(`tg/bot/user/buttons?user_id=${user_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get buttons:", error);
  }
}

export async function fetchInfo(stageButtonId) {
  try {
    const response = await http.get(`tg/bot/stage/button?id=${stageButtonId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get info:", error);
  }
}

export async function fetchOrder(stage_id) {
  try {
    const response = await http.get(`tg/bot/stage/button/new/order?stage_id=${stage_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get order:", error);
  }
}

export async function update(id, data) {
  try {
    await http.put(`tg/bot/stage/button/update?id=${id}`, data);
  } catch (error) {
    console.error("Failed to update:", error);
  }
}

export async function create(data) {
  try {
    await http.post(`tg/bot/stage/button/create`, data);
  } catch (error) {
    console.error("Failed to create:", error);
  }
}