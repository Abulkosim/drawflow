import http from "../interceptors/http";

export async function fetchNum(bot_id) {
  try {
    const response = await http.get(`tg/bot/stage/new?bot_id=${bot_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get number:", error);
  }
}

export async function fetchBackhands(id) {
  try {
    const response = await http.get(`tg/bot/stage/availabe/hands?stage_id=${id}`);
    return response;
  } catch (error) {
    console.error("Failed to get backhands:", error);
  }
}

export async function fetchAliases(user_id) {
  try {
    const response = await http.get(`v1/bot/user/texts?user_id=${user_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get aliases:", error);
  }
}

export async function fetchStages(bot_id) {
  try {
    const response = await http.get(`v1/bot/stage/list?bot_id=${bot_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get stages:", error);
  }
}

export async function fetchURLs(user_id) {
  try {
    const response = await http.get(`tg/bot/user/callback_urls?user_id=${user_id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get urls:", error);
  }
}

export async function checkCode(data) {
  try {
    const response = await http.post(`https://bot-platon.platon.uz/bot/main/code/check`, data);
    return response;
  } catch (error) {
    console.error("Failed to check:", error);
  }
}