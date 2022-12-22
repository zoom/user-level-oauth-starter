const dayjs = require('dayjs');
const httpErrorHandler = require('../httpErrorHandler');
const logHttpErrorPath = require('../logHttpErrorPath');
const { getCurrentUser } = require('../dbQuery');
const { decrypt } = require('../crypto');
const { updateCurrentUserToken } = require('../dbQuery');
const { USER_NOT_FOUND, ZOOM_USER_ID_MISSING, ZOOM_TOKEN_REFRESH_SUCCESS } = require('../constants');

const withCurrentUser = async (req, res, next) => {
  try {
    const { zoom_user_id } = req.params || {};

    if (!zoom_user_id) {
      return httpErrorHandler({
        error: new Error(ZOOM_USER_ID_MISSING),
        res,
        customMessage: ZOOM_USER_ID_MISSING,
        logErrorPath: logHttpErrorPath(req),
      });
    }

    const currentUser = await getCurrentUser({ zoom_user_id });

    if (Object.keys(currentUser).length === 0) {
      return httpErrorHandler({
        error: new Error(USER_NOT_FOUND),
        res,
        customMessage: USER_NOT_FOUND,
        logErrorPath: logHttpErrorPath(req),
      });
    }

    const { access_token, refresh_token, last_updated } = currentUser;
    let bearerToken = '';
    let user = currentUser;

    // Refresh access_token if it's 55+ minutes old (tokens are valid for 1 hour)
    if (dayjs().diff(dayjs(last_updated), 'minute') > 55) {
      const updateRequest = await updateCurrentUserToken({
        zoom_user_id,
        refresh_token,
      });

      if (updateRequest?.message === ZOOM_TOKEN_REFRESH_SUCCESS) {
        const updatedCurrentUser = await getCurrentUser(({ zoom_user_id }));
        user = updatedCurrentUser;
        bearerToken = `Bearer ${decrypt(updatedCurrentUser?.access_token)}`;
      }
    } else {
      bearerToken = `Bearer ${decrypt(access_token)}`;
    }
    req.headerConfig = {
      headers: {
        Authorization: bearerToken,
      },
    };
    req.currentUser = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = withCurrentUser;
