import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '363808482416-dm5spios3gtrrtfvms5ru5vl3k1q3ugr.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBUKMgUc9zS9CEPi6p4cHmG7ZDoR6T7PWQ';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

const GoogleSheetsIntegration = ({ setWords, spreadsheetId }) => {
    const handleLogin = () => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                developerKey: API_KEY,
                clientId: CLIENT_ID,
                //discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                scope: SCOPES
            }).then(() => {
                gapi.auth2.getAuthInstance().signIn().then(() => {
                    if (spreadsheetId) {
                        gapi.client.sheets.spreadsheets.values.get({
                            spreadsheetId: spreadsheetId,
                            range: 'Sheet1!A1:D10',
                        }).then((response) => {
                            console.log(response.result.values);
                            // Update your state with the new data
                            setWords(response.result.values.map(([word, definition, samples, level]) => ({
                                word,
                                definition,
                                samples: samples.split(','), // Assuming samples are comma-separated in the sheet
                                level: parseInt(level, 10),
                            })));
                        });
                    }
                });
            });
        });
    };

    return <button onClick={handleLogin}>Login with Google Sheets</button>;
};

export default GoogleSheetsIntegration;