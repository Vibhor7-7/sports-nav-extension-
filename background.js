//Runs in background for API requests and updates 
const API_KEY = '3194fd42a2c1871cf8108fa5dd0a2cc5';
const BASE_URL = 'https://v2.nba.api-sports.io';

// Create alarm for periodic updates
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('teamUpdate', { periodInMinutes: 5 });
});

// Handle alarm trigger
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'teamUpdate') {
    const { selectedTeam } = await chrome.storage.local.get(['selectedTeam']);
    if (selectedTeam?.id) {
      try {
        const response = await fetch(`${BASE_URL}/games?team=${selectedTeam.id}&season=2023`, {
          headers: { 'x-apisports-key': API_KEY }
        });
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        const upcomingMatches = data.response.filter(match => 
          new Date(match.date) > new Date() && match.status.short !== 'FT'
        );
        chrome.storage.local.set({ upcomingMatches });
      } catch (error) {
        console.error('Background fetch error:', error);
      }
    }
  }
});