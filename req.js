const { default: axios } = require('axios');
require('dotenv').config();

const { AUTH, RQUID } = process.env;

const gigaReq = async (text, language, answer) => {
  console.log(answer)
  const body = {
    model: "GigaChat:latest",
    messages: [
        {
            role: "user",
            content: language === 'ru' ? `Представь что ты девушка. Поддержи разговор со мной как собеседник` : `Imagine that you are a girl. Keep up the conversation with me as a conversationalist.`,
        }
    ],
    max_tokens: 80
  };

  if(answer.length){
    body.messages.push({
      role: "assistant",
      content: answer
    },
    {
      role: "user",
      content: text
    }
  )}else{
    body.messages.push({
      role: "user",
      content: text
    })
  }

  const bodyToken = {
    scope: 'GIGACHAT_API_PERS',
  };

  const requestTokenOptions = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: AUTH,
      RqUID: RQUID,
    },
  };

  const response = await axios.post('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', bodyToken, requestTokenOptions);

  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${response.data.access_token}`,
    },
  };

  return axios.post('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', body, requestOptions);
};

module.exports = gigaReq