const fs = require('fs');
const { google } = require('googleapis');
const url = require('url');
const axios = require('axios');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

module.exports = authorize;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(token_path, callback) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.CALLBACK_URL);

    // Check if we have previously stored a token.
    fs.readFile(token_path, async (err, token) => {
        if (err) return await getNewToken(oAuth2Client, token_path, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

