const express = require('express');
const axios = require('axios');
const qs = require('query-string');
const httpErrorHandler = require('../../httpErrorHandler');
const logHttpErrorPath = require('../../logHttpErrorPath');
const withCurrentUser = require('../../middlewares/withCurrentUser');
const {
  ZOOM_API_BASE_URL, ZOOM_LIST_MEETINGS_ERROR, ZOOM_LIST_WEBINARS_ERROR, ZOOM_CREATE_MEETING_ERROR,
  ZOOM_CREATE_WEBINAR_ERROR, ZOOM_UPDATE_MEETING_ERROR, ZOOM_UPDATE_WEBINAR_ERROR,
  ZOOM_LIST_RECORDINGS_ERROR,
} = require('../../constants');

const router = express.Router();

/**
 * List meetings
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetings
 */
router.get('/:zoom_user_id/meetings', withCurrentUser, async (req, res) => {
  const { headerConfig, params, query } = req;
  const { zoom_user_id } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/users/${zoom_user_id}/meetings?${qs.stringify({ next_page_token })}`,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_LIST_MEETINGS_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * List webinars
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/webinars
 */
router.get('/:zoom_user_id/webinars', withCurrentUser, async (req, res) => {
  const { headerConfig, params, query } = req;
  const { zoom_user_id } = params;
  const { next_page_token } = query;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/users/${zoom_user_id}/webinars?${qs.stringify({ next_page_token })}`,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_LIST_WEBINARS_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * Create a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingCreate
 */
router.post('/:zoom_user_id/meetings', withCurrentUser, async (req, res) => {
  const { headerConfig, params, body } = req;
  const { zoom_user_id } = params;
  try {
    const request = await axios.post(
      `${ZOOM_API_BASE_URL}/users/${zoom_user_id}/meetings`,
      body,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_CREATE_MEETING_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * Update a meeting
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingUpdate
 */
router.patch('/:zoom_user_id/meetings/:meeting_id', withCurrentUser, async (req, res) => {
  const { headerConfig, params, body } = req;
  const { meeting_id } = params;

  try {
    const request = await axios.patch(
      `${ZOOM_API_BASE_URL}/meetings/${meeting_id}`,
      body,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_UPDATE_MEETING_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * Create a webinar
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/webinarCreate
 */
router.post('/:zoom_user_id/webinars', withCurrentUser, async (req, res) => {
  const { headerConfig, body, params } = req;
  const { zoom_user_id } = params;

  try {
    const request = await axios.post(
      `${ZOOM_API_BASE_URL}/users/${zoom_user_id}/webinars`,
      body,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_CREATE_WEBINAR_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * Update a webinar
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/webinarUpdate
 */
router.patch('/:zoom_user_id/webinars/:webinar_id', withCurrentUser, async (req, res) => {
  const { headerConfig, params, body } = req;
  const { webinar_id } = params;

  try {
    const request = await axios.patch(
      `${ZOOM_API_BASE_URL}/webinars/${webinar_id}`,
      body,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_UPDATE_WEBINAR_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

/**
 * List all recordings
 * https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/recordingsList
 */
router.get('/:zoom_user_id/recordings', withCurrentUser, async (req, res) => {
  const { headerConfig, params, query } = req;
  const { zoom_user_id } = params;
  const { from, to, next_page_token } = query;

  try {
    const request = await axios.get(
      `${ZOOM_API_BASE_URL}/users/${zoom_user_id}/recordings?${qs.stringify({
        from,
        to,
        next_page_token,
      })}`,
      headerConfig,
    );

    return res.json(request.data);
  } catch (error) {
    return httpErrorHandler({
      error,
      res,
      customMessage: ZOOM_LIST_RECORDINGS_ERROR,
      logErrorPath: logHttpErrorPath(req),
    });
  }
});

module.exports = router;
