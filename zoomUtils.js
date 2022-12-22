const axios = require('axios');
const qs = require('query-string');
const { decrypt } = require('./crypto');
const { ZOOM_OAUTH_TOKEN_URL, ZOOM_OAUTH_REVOKE_TOKEN_URL } = require('./constants');

const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = process.env;

const refreshOauthToken = async ({ old_refresh_token }) => {
  try {
    const zoomRefreshTokenRequest = await axios.post(
      ZOOM_OAUTH_TOKEN_URL,
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token: decrypt(old_refresh_token),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    );

    const { data } = await zoomRefreshTokenRequest;
    const { access_token, refresh_token } = data;

    return { access_token, refresh_token };
  } catch (error) {
    throw new Error(error);
  }
};

const revokeOauthToken = async ({ access_token }) => {
  try {
    const revokeTokenResponse = await axios.post(
      ZOOM_OAUTH_REVOKE_TOKEN_URL,
      qs.stringify({
        token: decrypt(access_token),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        },
      },
    );

    const { data } = await revokeTokenResponse;

    return { data };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  refreshOauthToken,
  revokeOauthToken,
};
