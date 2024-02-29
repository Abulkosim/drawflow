import http from '../interceptors/http'

export async function updatePos(data) {
  try {
    return http.put(`tg/bot/stage/position/update`, data)
  } catch (error) {
    console.error('Failed to update position:', error)
  }
}

export async function fetchStages(bot_id) {
  try {
    const response = await http.get(`v1/bot/stage/list?bot_id=${bot_id}`)
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch stages:', error)
  }
}

export async function fetchBotInfo(bot_id) {
  try {
    const response = await http.get(`tg/bot/info?bot=${bot_id}`)
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch bot info:', error)
  }
}

export async function createStage(data) {
  try {
    return http.post('tg/bot/stage/create', data)
  } catch (error) {
    console.error('Failed to create stage:', error)
  }
}

export async function deleteStage(id) {
  try {
    return http.put(`tg/bot/stage/delete?id=${id}`)
  } catch (error) {
    console.error('Failed to delete node:', error)
  }
}

export async function updateStage(data) {
  try {
    return http.put('tg/bot/stage/update', data)
  } catch (error) {
    console.error('Failed to update node:', error)
  }
}

export async function updateCallback(data) {
  try {
    return http.put('tg/bot/stage/update/callback_url', data)
  } catch (error) {
    console.error('Failed to update callback:', error)
  }
}

export async function fetchStage(id) {
  try {
    const response = await http.get(`v1/bot/stage?id=${id}`)
    return response.data.data.stage
  } catch (error) {
    console.error('Failed to fetch stage:', error)
  }
}

export async function fetchConnections(bot_id) {
  try {
    return http.get(`tg/bot/stage/connections?bot_id=${bot_id}`)
  } catch (error) {
    console.error('Failed to fetch connections:', error)
  }
}

export async function fetchBotLocales(bot_id) {
  try {
    const response = await http.get(`tg/bot/flow/locales?bot_id=${bot_id}`)
    return response;
  } catch (error) {
    console.error("Failed to get bot locales:", error);
  }
}

export async function createBack(data) {
  try {
    return http.post('tg/bot/stage/back/hand/create', data)
  } catch (error) {
    console.error('Failed to create back:', error)
  }
}