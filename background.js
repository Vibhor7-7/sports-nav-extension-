//Runs in background for API requests and updates 

const API_KEY = '3'; // Free User API Key
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/' + API_KEY;

// Fetch live scores from TheSportsDB
async function fetchLiveScores() {
    try {
        const response = await fetch(`${BASE_URL}/livescore.php?s=Soccer`);
        const data = await response.json();
        
        if (data?.events) {
            console.log('Live Soccer Scores:', data.events);
            chrome.storage.local.set({ soccerScores: data.events });
        }
    } catch (error) {
        console.error('Error fetching live scores:', error);
    }
}

// Set up periodic fetch (every 1 minute)
chrome.alarms.create('fetchLiveScores', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'fetchLiveScores') {
        fetchLiveScores();
    }
});

// Listen for extension startup and fetch scores immediately
chrome.runtime.onStartup.addListener(fetchLiveScores);
chrome.runtime.onInstalled.addListener(fetchLiveScores);
