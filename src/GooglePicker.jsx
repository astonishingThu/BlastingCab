// GooglePicker.jsx
import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '363808482416-dm5spios3gtrrtfvms5ru5vl3k1q3ugr.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBUKMgUc9zS9CEPi6p4cHmG7ZDoR6T7PWQ';

const GooglePicker = ({ setSpreadsheetId }) => {
    useEffect(() => {
        const initClient = () => {
            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/drive.readonly',
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
                });
            });
        };
        gapi.load('client:picker', initClient);
    }, []);

    const createPicker = () => {
        const view = new google.picker.View(google.picker.ViewId.SPREADSHEETS);
        const picker = new google.picker.PickerBuilder()
            .addView(view)
            .setOAuthToken(gapi.auth.getToken().access_token)
            .setDeveloperKey(API_KEY)
            .setCallback(pickerCallback)
            .build();
        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data.action === google.picker.Action.PICKED) {
            const doc = data.docs[0];
            setSpreadsheetId(doc.id);
        }
    };

    const handleLogin = () => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            createPicker();
        });
    };

    return <button onClick={handleLogin}>Select Google Sheet</button>;
};

export default GooglePicker;
