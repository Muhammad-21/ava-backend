# 💁🏻 Ava-backend

---
## Technologies

- Express
- Microsoft-cognitiveservices-speech-sdk
- Axios
## Installing

```sh
> npm install
> npm start
```
deployed here: [ava-backend](https://ava-backend-72sc.onrender.com/).


## Request Example

```
    curl --location 'https://ava-backend-72sc.onrender.com/talk' \
    --header 'Content-Type: application/json' \
    --data '{
        "text": "привет",
        "language": "ru"
    }'
```

---