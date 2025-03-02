//Runs in background for API requests and updates 
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ selectedTeam: null });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'teamUpdate') {
        const { selectedTeam } = await chrome.storage.local.get(['selectedTeam']);
        if (selectedTeam?.id) {
            const response = await fetch(
                `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${selectedTeam.id}`
            );
            const data = await response.json();
            chrome.storage.local.set({ upcomingMatches: data.events || [] });
        }
    }
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.selectedTeam) {
        chrome.alarms.clear('teamUpdate');
        if (changes.selectedTeam.newValue) {
            chrome.alarms.create('teamUpdate', { periodInMinutes: 5 });
        }
    }
});