import http from '../interceptors/http'

export async function deleteButton(id) {
  try {
    return http.put(`tg/bot/stage/button/delete?id=${id}`)
  } catch (error) {
    console.error("Failed to delete button:", error);
    throw error;
  }
}

export async function fetchButtons(stageId) {
  try {
    const response = await http.get(`tg/bot/stage/button/list?stage_id=${stageId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch buttons:", error);
    throw error;
  }
}