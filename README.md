# `Task Tracker API`
### `POST /api/auth/login`
##### Request Body:
* username `(STRING)`
* password `(STRING)`
##### Response Object:
* message `(STRING)`
* accessToken `(STRING)` **or** `(NULL)`
 ##### Response Cookies:
 * jwt `(STRING)`
---
### `POST /api/auth/refresh`
##### Request Cookies:
* jwt `(STRING)`
##### Response Object:
* message `(STRING)`
* accessToken `(STRING)` **or** `(NULL)`
* userId `(STRING)` **or** `(NULL)`
---
### `POST /api/auth/logout`
##### Response Object:
* message `(STRING)`
---
### `GET /api/users`
##### Request Headers:
* authorization `(STRING)`
##### Response Object:
* message `(STRING)`
* users `(ARRAY)`
---
### `GET /api/users/{userId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* userId `(STRING)`
##### Response Object:
* message `(STRING)`
* user `(OBJECT)` **or** `(NULL)`
---
### `POST /api/users`
##### Request Body:
* username `(STRING)`
* password `(STRING)`
##### Response Object:
* message `(STRING)`
---
### `PATCH /api/users/{userId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* userId `(STRING)`
##### Request Body:
* username `(STRING)`
* password `(STRING)`
##### Response Object:
* message `(STRING)`
---
### `DELETE /api/users/{userId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* userId `(STRING)`
##### Response Object:
* message `(STRING)`
---
### `GET /api/tasks`
##### Request Headers:
* authorization `(STRING)`
##### Response Object:
* message `(STRING)`
* tasks `(ARRAY)`
---
### `GET /api/tasks/{taskId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* taskId `(STRING)`
##### Response Object:
* message `(STRING)`
* task `(OBJECT)` **or** `(NULL)`
---
### `POST /api/tasks`
##### Request Headers:
* authorization `(STRING)`
##### Request Body:
* title `(STRING)`
* body `(STRING)`
##### Response Object:
* message `(STRING)`
---
### `PATCH /api/tasks/{taskId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* taskId `(STRING)`
##### Request Body:
* title `(STRING)`
* body `(STRING)`
* completed `(BOOLEAN)`
##### Response Object:
* message `(STRING)`
---
### `DELETE /api/tasks/{taskId}`
##### Request Headers:
* authorization `(STRING)`
##### Request Path Parameters:
* taskId `(STRING)`
##### Response Object:
* message `(STRING)`
---