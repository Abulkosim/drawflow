function check() {
  let info = $data.url
  let data = {
    user: {
      id: "248e4b78-8edb-6c86-a663-f0d35b278317",
      attributes: {},
      telegram_id: 1456374097,
      full_name: "async def",
      username: "greatdestination",
      phone: "998882690011",
      lang_id: 1,
      bot_id: "2267e7b6-92ea-0f9a-cef5-81dbf5b96b85",
      role_id: 1,
      user_state: "reply",
      stage_id: 36,
      state: 1,
      created_at: "2024-02-20 17:15:31.790009",
      updated_at: null,
      status: "ACTIVE"
    },
    msg_data: "Success"
  }
  http.post(info, data).then(res => {
    if (res.data.data.main) {
      let keys = res.data.data.main;
      let notPresentKeys = [];
      let key_list = ['btn_sizes', 'buttons', 'media', 'next', 'text', 'url', 'user_state']
      key_list.forEach(key => {
        if (!keys.hasOwnProperty(key)) {
          notPresentKeys.push(key);
        }
      });
      if (notPresentKeys.length > 0) {
        console.log(`${notPresentKeys} keys are not found in callback url response !`)
      } else {
        console.log('All keys are present in callback url response!')
      }
    } else {
      console.log('main stage does not exist in callback url response!')
    }
  }).catch(err => { console.log('This callback url does not work !') });
}