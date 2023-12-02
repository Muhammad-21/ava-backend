const { default: axios } = require('axios');
require('dotenv').config();

const { AUTH, RQUID } = process.env;

const gigaReq = async (text, language) => {
  const body = {
    model: "GigaChat:latest",
    messages: [
        {
            role: "user",
            content: language === 'ru' ? `Представь что ты учитель русского языка. И ты девушка. Ответ кратко на мои вопросы и также задавай мне` : `Imagine that you are an English teacher. And you're a girl. Answer my questions briefly and also ask me.`,
        },
        {
            role: "user",
            content: text
        }
    ],
    max_tokens: 40
  };

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