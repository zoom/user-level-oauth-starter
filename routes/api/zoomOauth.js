const express = require('express');
const axios = require('axios');
const qs = require('query-string');
const {
  createNewUser, getCurrentUser, getUsers, updateCurrentUserToken, deleteCurrentUser,
} = require('../../dbQuery');
const { decrypt } = require('../../crypto');
const withCurrentUser = require('../../middlewares/withCurrentUser');
const httpErrorHandler = require('../../httpErrorHandler');
const logHttpErrorPath = require('../../logHttpErrorPath');
const {
  ZOOM_OAUTH_TOKEN_URL, ZOOM_OAUTH_AUTHORIZATION_URL, ZOOM_API_BASE_URL, ZOOM_TOKEN_RETRIEVED,
  ZOOM_USER_REVOKE_ERROR, ZOOM_TOKEN_ERROR, ZOOM_TOKEN_REFRESH_ERROR,
  ZOOM_OAUTH_ERROR, ZOOM_FETCH_OAUTH_USERS_ERROR,
} = require('../../constants');

const router = express.Router();

// Zoom OAuth
router.get('/', async (req, res) => {
  const {
    ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_REDIRECT_URL,
  } = process.env;
  const { code } = req.query;

  if (code) {
    try {
      // Request access token if authorization code is present
      const zoomAuthRequest = await axios.post(
        ZOOM_OAUTH_TOKEN_URL,
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: ZOOM_REDIRECT_URL,
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
          },
        },
      );
      const { access_token, refresh_token } = await zoomAuthRequest.data;

      // Get current user information from Zoom
      const zoomUser = await axios.get(`${ZOOM_API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const me = await zoomUser?.data;

      const { id: zoom_user_id, email } = me;
      const existingUser = await getCurrentUser({ zoom_user_id });

      // Check if user exists before creating a new entry in database
      if (!existingUser.length) {
        await createNewUser({
          zoom_user_id,
          access_token,
          refresh_token,
          email,
        });
        return res.json({ message: ZOOM_TOKEN_RETRIEVED });
      }
    } catch (error) {
      return httpErrorHandler({
        error,
        res,
        customMessage: ZOOM_OAUTH_ERROR,
        logErrorPath: logHttpErrorPath(req),
      });
    }
  } else {
    // Request authorization code in preparation for access token request
    return res.redirect(`${ZOOM_OAUTH_AUTHORIZATION_URL}?${qs.stringify({
      response_type: 'code',
      client_id: ZOOM_CLIENT_ID,
      redirect_uri: ZOOM_REDIRECT_URL,
    })}`);
  }
  return null;
});

router.get('/oauth_users', async (req, res) => {
  try {
    const users = await getUsers();
    return res.json(users);
  } catch (error) {
    return httpErrorHandler({
      error, res, customMessage: ZOOM_FETCH_OAUTH_USERS_ERROR, logErrorPath: logHttpErrorPath(req),
    });
  }
});

// https://marketplace.zoom.us/docs/guides/auth/oauth/#refreshing-an-access-token
router.post('/:zoom_user_id/refresh_token', withCurrentUser, async (req, res) => {
  const { currentUser } = req;

  try {
    const { zoom_user_id, refresh_token } = currentUser;
    const updatedUser = await updateCurrentUserToken({
      zoom_user_id,
      refresh_token,
    });

    return res.json({ message: updatedUser?.message });
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_TOKEN_REFRESH_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

router.get('/:zoom_user_id/get_token', withCurrentUser, async (req, res) => {
  const { currentUser } = req;

  try {
    const decryptedToken = decrypt(currentUser?.access_token);

    return res.json({ access_token: decryptedToken });
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_TOKEN_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

// https://marketplace.zoom.us/docs/guides/auth/oauth/#revoking-an-access-token
router.post('/:zoom_user_id/revoke_token', withCurrentUser, async (req, res) => {
  const { currentUser } = req;

  try {
    const { access_token, zoom_user_id } = currentUser;
    const deleteUserResponse = await deleteCurrentUser({ zoom_user_id, access_token });

    return res.json({ message: deleteUserResponse?.message });
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_USER_REVOKE_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

module.exports = router;
