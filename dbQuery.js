const util = require('util');
const dayjs = require('dayjs');
const database = require('./dbConfig');
const { encrypt } = require('./crypto');
const { refreshOauthToken, revokeOauthToken } = require('./zoomUtils');

const {
  ZOOM_TOKEN_REFRESH_SUCCESS, ZOOM_USER_REVOKE_SUCCESS,
} = require('./constants');

// return promise from database queries to allow for async/await
const query = util.promisify(database.query).bind(database);

const { MYSQL_TABLE } = process.env;

const getUsers = async () => {
  try {
    const users = await query(`SELECT zoom_user_id, email FROM ${MYSQL_TABLE}`);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const getCurrentUser = async ({ zoom_user_id }) => {
  try {
    const existingUser = await query(`SELECT * FROM ${MYSQL_TABLE} WHERE zoom_user_id = ?`, [zoom_user_id]);

    return existingUser[0] || {};
  } catch (error) {
    throw new Error(error);
  }
};

const createNewUser = async ({
  zoom_user_id, access_token, refresh_token, email,
}) => {
  try {
    await query(`INSERT INTO ${MYSQL_TABLE} SET ?`, {
      zoom_user_id,
      access_token: encrypt(access_token),
      refresh_token: encrypt(refresh_token),
      email,
      last_updated: dayjs().format(),
    });
  } catch (error) {
    throw new Error(error);
  }
};

const updateCurrentUserToken = async ({ zoom_user_id, refresh_token: old_refresh_token }) => {
  try {
    const { access_token, refresh_token } = await refreshOauthToken({ old_refresh_token });

    await query(`UPDATE ${MYSQL_TABLE} SET ? WHERE zoom_user_id = ?`, [
      {
        access_token: encrypt(access_token),
        refresh_token: encrypt(refresh_token),
        last_updated: dayjs().format(),
      },
      zoom_user_id,
    ]);

    return { message: ZOOM_TOKEN_REFRESH_SUCCESS };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCurrentUser = async ({ zoom_user_id, access_token }) => {
  try {
    const { data } = await revokeOauthToken({ access_token });

    const { status, errorMessage } = data;

    if (status === 'success') {
      await query(`DELETE FROM ${MYSQL_TABLE} WHERE zoom_user_id = ?`, [zoom_user_id]);

      return { message: ZOOM_USER_REVOKE_SUCCESS };
    }
    throw new Error(errorMessage);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  query,
  createNewUser,
  getCurrentUser,
  getUsers,
  updateCurrentUserToken,
  deleteCurrentUser,
};
