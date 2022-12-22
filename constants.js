// URLs
const ZOOM_OAUTH_TOKEN_URL = 'https://zoom.us/oauth/token';
const ZOOM_OAUTH_AUTHORIZATION_URL = 'https://zoom.us/oauth/authorize';
const ZOOM_API_BASE_URL = 'https://api.zoom.us/v2';
const ZOOM_OAUTH_REVOKE_TOKEN_URL = 'https://zoom.us/oauth/revoke';
// Database Algorithm
const ZOOM_CRYPTO_ALGO = 'aes-256-ctr';
// Custom Error Messages
const ZOOM_USER_ID_MISSING = 'Please supply a valid Zoom user ID';
const ZOOM_TOKEN_RETRIEVED = 'Zoom token retrieved';
const ZOOM_TOKEN_ERROR = 'Error fetching Zoom token';
const ZOOM_TOKEN_REFRESH_SUCCESS = 'Zoom token refresh successful';
const ZOOM_TOKEN_REFRESH_ERROR = 'Zoom token refresh error';
const ZOOM_USER_REVOKE_SUCCESS = 'User revoke success';
const ZOOM_USER_REVOKE_ERROR = 'User revoke error';
const ZOOM_LIST_MEETINGS_ERROR = 'Error fetching meetings';
const ZOOM_LIST_WEBINARS_ERROR = 'Error fetching webinars';
const ZOOM_CREATE_MEETING_ERROR = 'Error creating meeting';
const ZOOM_CREATE_WEBINAR_ERROR = 'Error creating webinar';
const ZOOM_UPDATE_MEETING_ERROR = 'Error updating meeting';
const ZOOM_UPDATE_WEBINAR_ERROR = 'Error updating webinar';
const ZOOM_LIST_RECORDINGS_ERROR = 'Error fetching recordings';
const ZOOM_FETCH_OAUTH_USERS_ERROR = 'Error fetching oauth users';
const ZOOM_OAUTH_ERROR = 'Error registering new Zoom oauth user';
const ERROR_PLACEHOLDER = 'Error';
const USER_NOT_FOUND = 'User not found';

module.exports = {
  ZOOM_OAUTH_TOKEN_URL,
  ZOOM_OAUTH_AUTHORIZATION_URL,
  ZOOM_API_BASE_URL,
  ZOOM_OAUTH_REVOKE_TOKEN_URL,
  ZOOM_CRYPTO_ALGO,
  ZOOM_USER_ID_MISSING,
  ZOOM_TOKEN_RETRIEVED,
  ZOOM_TOKEN_ERROR,
  ZOOM_TOKEN_REFRESH_SUCCESS,
  ZOOM_TOKEN_REFRESH_ERROR,
  ZOOM_USER_REVOKE_SUCCESS,
  ZOOM_USER_REVOKE_ERROR,
  ZOOM_LIST_MEETINGS_ERROR,
  ZOOM_LIST_WEBINARS_ERROR,
  ZOOM_CREATE_MEETING_ERROR,
  ZOOM_CREATE_WEBINAR_ERROR,
  ZOOM_UPDATE_MEETING_ERROR,
  ZOOM_UPDATE_WEBINAR_ERROR,
  ZOOM_LIST_RECORDINGS_ERROR,
  ZOOM_FETCH_OAUTH_USERS_ERROR,
  ZOOM_OAUTH_ERROR,
  ERROR_PLACEHOLDER,
  USER_NOT_FOUND,
};
