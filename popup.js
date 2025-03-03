document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const teamList = document.getElementById('teamList');
  const matchesContainer = document.getElementById('matchesContainer');
  const API_KEY = '3194fd42a2c1871cf8108fa5dd0a2cc5';
  const BASE_URL = 'https://v2.nba.api-sports.io';

  // Load saved team on popup open
  chrome.storage.local.get(['selectedTeam'], ({ selectedTeam }) => {
    if (selectedTeam?.id) {
      loadTeamMatches(selectedTeam.id);
    }
  });

  // Search teams on input
  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
      teamList.innerHTML = '';
      return;
    }
    const teams = await searchTeams(query);
    displayTeams(teams);
  });

  // Handle team selection
  teamList.addEventListener('click', (e) => {
    const teamItem = e.target.closest('.team-item');
    if (teamItem) {
      const team = {
        id: teamItem.dataset.id,
        name: teamItem.querySelector('h3').textContent
      };
      chrome.storage.local.set({ selectedTeam: team }, () => {
        loadTeamMatches(team.id);
      });
    }
  });

  // Search NBA teams
  async function searchTeams(teamName) {
    try {
      const response = await fetch(`${BASE_URL}/teams`, {
        headers: { 'x-apisports-key': API_KEY }
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const teams = data.response.filter(team => 
        team.name.toLowerCase().includes(teamName.toLowerCase()) && team.nba === true
      );
      return teams;
    } catch (error) {
      console.error('Search error:', error);
      teamList.innerHTML = '<div class="no-results">Error searching teams. Please try again later.</div>';
      return [];
    }
  }

  // Display teams in the popup
  function displayTeams(teams) {
    teamList.innerHTML = teams.length > 0
      ? teams.map(team => `
          <div class="team-item" data-id="${team.id}">
            <h3>${team.name}</h3>
            <small>NBA</small>
          </div>
        `).join('')
      : '<div class="no-results">No teams found</div>';
  }

  // Load matches for a team
  async function loadTeamMatches(teamId) {
    matchesContainer.innerHTML = '<div class="no-results">Loading matches...</div>';
    try {
      const response = await fetch(`${BASE_URL}/games?team=${teamId}&season=2023`, {
        headers: { 'x-apisports-key': API_KEY }
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      displayMatches(data.response);
    } catch (error) {
      console.error('Match load error:', error);
      matchesContainer.innerHTML = '<div class="no-results">Error loading matches. Please try again later.</div>';
    }
  }

  // Display matches in the popup
  function displayMatches(matches) {
    const now = new Date();
    const matchHTML = matches.map(match => {
      const matchDate = new Date(match.date);
      const isPast = matchDate < now && match.status.short === 'FT'; // FT = Finished
      return `
        <div class="match-item">
          <h3>${match.teams.home.name} vs ${match.teams.visitors.name}</h3>
          <p>${matchDate.toLocaleString()}</p>
          ${isPast 
            ? `<p>${match.scores.home.total} - ${match.scores.visitors.total}</p>` 
            : '<p>Scheduled Match</p>'}
        </div>
      `;
    }).join('');
    matchesContainer.innerHTML = matchHTML || '<div class="no-results">No matches found</div>';
  }
});