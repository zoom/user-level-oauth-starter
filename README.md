# User Level OAuth Starter

This boilerplate app creates a functional starting point for building user level Oauth applications with Zoom. It demonstrates solutions for managing user tokens and making Zoom REST API requests on their behalf. It also refreshes access tokens automatically by use of an [express middleware](https://expressjs.com/en/guide/using-middleware.html).

This app utilizes [Express](https://expressjs.com/) for the server, [MySQL](https://www.mysql.com/) for the database ([Node MySQl](https://github.com/mysqljs/mysql)), and [Axios](https://axios-http.com/docs/intro) for http requests. 

## Getting Started

1. Create a user-level Oauth application in the [Zoom Marketplace](https://marketplace.zoom.us/). Please refer to our [public documentation](https://marketplace.zoom.us/docs/guides/build/oauth-app/) for further instructions on doing so.
    * Keep the **Client ID** and **Client Secret** handy as we will need those soon.
2. Add the following scopes:
    * _/meeting:write_
    * _/recording:write_
    * _/user:read_
    * _/user:write_
    * _/webinar:write_

    **Note**: If you wish to add additional API endpoints to this application, you may need to add additional scopes.

3. Install [Node](https://nodejs.org/en/) and [Ngrok](https://ngrok.com/).
4. [Create a MySQL database](https://dev.mysql.com/doc/refman/8.0/en/creating-database.html) with the following table schema. Graphical UI: [MySQL Workbench](https://www.mysql.com/products/workbench/).

```
CREATE TABLE `zoomCredential` (
  `zoom_user_id` varchar(255) NOT NULL,
  `access_token` text,
  `refresh_token` text,
  `email` varchar(255) DEFAULT NULL,
  `last_updated` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`zoom_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

**Note**: Feel free to name your database and table whatever you'd like. Just ensure to fill in your environment variables correctly.

5. Clone this repository and run `npm install` to download dependencies.
6. Add environment variables as described in `.env.example`. 

`touch .env`

```
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_REDIRECT_URL=
MYSQL_USER=
MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_PASSWORD=
MYSQL_TABLE=
MYSQL_CIPHER_KEY=
```

**Note on env setup**:
* **ZOOM_REDIRECT_URL**: run `ngrok http 8000` to create a tunnel to port 8000 and use the _forwarding URL_ for this value. Also add this value in your marketplace app configuration for the **App Credentials** -> **Redirect URL for OAuth** and **Add allow lists** text input values.
* **MYSQL_CIPHER_KEY**, please use a 256 bit key which can be easily generated [here](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx).

## Usage

With your ngrok tunnel active and applied to your marketplace application, use either of the following commands to start your express server:

* **npm run dev** (w/ hot reloading)
* **npm run start** (w/o hot reloading)

Head to your marketplace Oauth application and click on the **Activation** tab. Either click the **Add** button or copy your **Add URL** into a new tab. If everything above was setup correctly, you should see a Zoom Oauth Allow page! Click **Allow** to authorize the Zoom Oauth handshake. Upon a `Zoom token retrieved` success response, you should have a newly registered user in your database!

To ensure this worked, send a `GET` request to http://localhost:8000/oauth_users to fetch the newly added user. This server provides the following APIs:


| GET   | /                                   | Zoom Oauth Base (used only once per user activation) |
|-------|-------------------------------------|------------------------------------------------------|
| GET   | /oauth_users                        | List registered database users                       |
| POST  | /:zoom_user_id/refresh_token        | Manually refresh access token                        |
| GET   | /:zoom_user_id/get_token            | Retrieve access token from database                  |
| POST  | /:zoom_user_id/revoke_token         | Revoke access token                                  |
| GET   | /:zoom_user_id/meetings             | List meetings                                        |
| GET   | /:zoom_user_id/webinars             | List webinars                                        |
| POST  | /:zoom_user_id/meetings             | Create meeting                                       |
| PATCH | /:zoom_user_id/meetings/:meeting_id | Update meeting                                       |
| POST  | /:zoom_user_id/webinars             | Create webinar                                       |
| PATCH | /:zoom_user_id/webinars/:webinar_id | Update webinar                                       |
| GET   | /:zoom_user_id/recordings           | List cloud recordings                                |

## Need help?

For help using this app or any of Zoom's APIs, head to our [Developer Forum](https://devforum.zoom.us/c/api-and-webhooks).

