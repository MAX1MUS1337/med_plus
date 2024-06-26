## Разработка

После копирования проекта и установки зависимостей с помощью команд `npm install` (or `pnpm install` or `yarn`), запустите сервер разработки, используя:

```bash
npm run dev
```

## Сборка

Для сборки проекта воспользуйтесь следующей командой:

```bash
npm run build
```

Присутствует возможность предварительного просмотра, используя команду `npm run preview`.

## Переменные окружения
В режиме разработки и предпросмотра собранного приложения переменные окруджения считываются из соответствующих файлов (`.env`).

Для того чтобы это работало и в релизе, нужно установить `dotenv` в проект:

```bash
npm install dotenv
```

И вызвать его перед запуском приложения

```bash
node -r dotenv/config build
```

Если используется Node.js версии 20.6 или новее, можно использовать [--env-file](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) флаг:

```bash
node --env-file=.env build
```

## Перечень переменных оркужения для управления сервером
- `SEC_KEY_PATH` - путь к ключу шифрования данных
- `JWT_SECRET_KEY` - секретный ключ для JWT токена
- `JWT_EXPIRES_IN` - время жини токена в часах
- `DB_ADDR` - адрес хоста базы данных
- `DB_USER` - имя пользователя базы данных
- `DB_PASS` - пароль пользователя базы данных
- `DB_DATABASE` - имя базы данных
- `HOST` - адрес хоста приложения
- `PORT` - номер порта хоста приложения

## База данных
Разработанный модуль использует базу данных [PostgreSQL](https://www.postgresql.org/download/)