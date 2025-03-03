// popup.js

// Constants for API configuration
const API_KEY = '3194fd42a2c1871cf8108fa5dd0a2cc5'; 
const BASE_URL = 'https://v2.nba.api-sports.io';

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements from popup.html
    const teamInput = document.getElementById('teamInput');
    const searchBtn = document.getElementById('searchBtn');
    const teamList = document.getElementById('teamList');
    const matchesContainer = document.getElementById('matchesContainer');

    // Event listeners for search
    searchBtn.addEventListener('click', handleSearch);
    teamInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Handle search initiation
    async function handleSearch() {
        const teamName = teamInput.value.trim();
        if (!teamName) return;

        teamList.innerHTML = '<div class="no-results">Searching...</div>';
        const teams = await searchTeams(teamName);
        displayTeams(teams);
    }

    // Fetch and filter teams from NBA API
    async function searchTeams(teamName) {
        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", API_KEY);
        myHeaders.append("x-rapidapi-host", "v2.nba.api-sports.io");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${BASE_URL}/teams`, requestOptions);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            // Filter teams by name (case-insensitive)
            const teams = data.response.filter(team => 
                team.name.toLowerCase().includes(teamName.toLowerCase())
            );
            return teams;
        } catch (error) {
            console.error('Search error:', error);
            teamList.innerHTML = '<div class="no-results">Error searching teams</div>';
            return [];
        }
    }

    // Display filtered teams in the popup
    function displayTeams(teams) {
        teamList.innerHTML = teams.length > 0
            ? teams.map(team => `
                <div class="team-item" data-id="${team.id}">
                    ${team.name} <small>(NBA)</small>
                </div>
              `).join('')
            : '<div class="no-results">No teams found</div>';

        // Add click handlers for team selection
        document.querySelectorAll('.team-item').forEach(item => {
            item.addEventListener('click', () => {
                const teamId = item.dataset.id;
                const teamName = item.textContent.trim().replace('(NBA)', '').trim();
                saveTeamSelection(teamId, teamName);
                loadTeamMatches(teamId);
            });
        });
    }

    // Save selected team to storage
    async function saveTeamSelection(teamId, teamName) {
        await chrome.storage.local.set({ 
            selectedTeam: { id: teamId, name: teamName } 
        });
    }

    // Fetch and display matches for a selected team
    async function loadTeamMatches(teamId) {
        matchesContainer.innerHTML = '<div class="no-results">Loading matches...</div>';

        const myHeaders = new Headers();
        myHeaders.append("x-rapidapi-key", API_KEY);
        myHeaders.append("x-rapidapi-host", "v2.nba.api-sports.io");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        try {
            const response = await fetch(`${BASE_URL}/games?team=${teamId}&season=2023`, requestOptions);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            displayMatches(data.response);
        } catch (error) {
            console.error('Match load error:', error);
            matchesContainer.innerHTML = '<div class="no-results">Error loading matches</div>';
        }
    }

    // Display matches in the popup
    function displayMatches(matches) {
        matchesContainer.innerHTML = matches.length > 0
            ? matches.map(match => `
                <div class="match-item">
                    <h3>${match.teams.home.name} vs ${match.teams.visitors.name}</h3>
                    <p>${new Date(match.date).toLocaleString()}</p>
                    ${match.status.short === 'FT' ? `
                        <p>${match.scores.home.total} - ${match.scores.visitors.total}</p>
                    ` : '<p>Scheduled Match</p>'}
                </div>
              `).join('')
            : '<div class="no-results">No matches found</div>';
    }

    // Load previous team selection on popup open
    chrome.storage.local.get(['selectedTeam'], (result) => {
        if (result.selectedTeam) {
            teamInput.value = result.selectedTeam.name;
            loadTeamMatches(result.selectedTeam.id);
        }
    });
});