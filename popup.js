// popup.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const teamSearchInput = document.getElementById('team-search');
    const searchBtn = document.getElementById('search-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const liveGamesContainer = document.getElementById('live-games');
    const teamTagsContainer = document.getElementById('team-tags');
    
    // SportsDB API key and base URL
    const apiKey = '3'; // Replace with your actual API key if needed
    const baseUrl = 'https://www.thesportsdb.com/api/v1/json/';
    
    // Team name to short code mapping
    const teamShortCodes = {
      // NBA Teams
      'atlanta hawks': 'ATL',
      'boston celtics': 'BOS',
      'brooklyn nets': 'BKN',
      'charlotte hornets': 'CHA',
      'chicago bulls': 'CHI',
      'cleveland cavaliers': 'CLE',
      'dallas mavericks': 'DAL',
      'denver nuggets': 'DEN',
      'detroit pistons': 'DET',
      'golden state warriors': 'GSW',
      'houston rockets': 'HOU',
      'indiana pacers': 'IND',
      'los angeles clippers': 'LAC',
      'los angeles lakers': 'LAL',
      'memphis grizzlies': 'MEM',
      'miami heat': 'MIA',
      'milwaukee bucks': 'MIL',
      'minnesota timberwolves': 'MIN',
      'new orleans pelicans': 'NOP',
      'new york knicks': 'NYK',
      'oklahoma city thunder': 'OKC',
      'orlando magic': 'ORL',
      'philadelphia 76ers': 'PHI',
      'phoenix suns': 'PHX',
      'portland trail blazers': 'POR',
      'sacramento kings': 'SAC',
      'san antonio spurs': 'SAS',
      'toronto raptors': 'TOR',
      'utah jazz': 'UTA',
      'washington wizards': 'WAS'
    };
    
    // Load tracked teams from storage
    let trackedTeams = [];
    chrome.storage.local.get(['trackedTeams'], function(result) {
      if (result.trackedTeams) {
        trackedTeams = result.trackedTeams;
        renderTeamTags();
        fetchLiveScores();
      }
    });
    
    // Convert team name to short code
    function getTeamShortCode(teamName) {
      const normalizedName = teamName.toLowerCase().trim();
      return teamShortCodes[normalizedName] || null;
    }
    
    // Search for a team using the API
    async function searchTeam(shortCode) {
      try {
        const response = await fetch(`${baseUrl}${apiKey}/searchteams.php?sname=${shortCode}`);
        const data = await response.json();
        return data.teams || [];
      } catch (error) {
        console.error('Error searching for team:', error);
        return [];
      }
    }
    
    // Fetch live scores for tracked teams
    async function fetchLiveScores() {
      liveGamesContainer.innerHTML = '<div class="loading">Loading live scores...</div>';
      
      if (trackedTeams.length === 0) {
        liveGamesContainer.innerHTML = '<p>No teams tracked yet. Search and add teams to track their scores.</p>';
        return;
      }
      
      try {
        // In a real implementation, you would use the SportsDB API endpoint for live scores
        // Since there isn't a direct method to get live scores by team short code in the free tier,
        // you might need to get all live events and filter for your tracked teams
        const response = await fetch(`${baseUrl}${apiKey}/livescore.php?s=Basketball`);
        const data = await response.json();
        
        if (!data.events || data.events.length === 0) {
          liveGamesContainer.innerHTML = '<p>No live games at the moment.</p>';
          return;
        }
        
        // Filter for games involving tracked teams
        const relevantGames = data.events.filter(game => {
          const homeTeam = game.strHomeTeam.toLowerCase();
          const awayTeam = game.strAwayTeam.toLowerCase();
          
          return trackedTeams.some(team => {
            return homeTeam.includes(team.toLowerCase()) || 
                   awayTeam.includes(team.toLowerCase());
          });
        });
        
        if (relevantGames.length === 0) {
          liveGamesContainer.innerHTML = '<p>No live games for your tracked teams.</p>';
          return;
        }
        
        // Render games
        renderGames(relevantGames);
      } catch (error) {
        console.error('Error fetching live scores:', error);
        liveGamesContainer.innerHTML = '<p>Error loading live scores. Please try again.</p>';
      }
    }
    
    // Render live games
    function renderGames(games) {
      liveGamesContainer.innerHTML = '';
      
      games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        const homeScore = game.intHomeScore || '0';
        const awayScore = game.intAwayScore || '0';
        const gameStatus = game.strStatus || 'Live';
        const gameTime = game.strTime || '';
        
        gameCard.innerHTML = `
          <div class="teams">
            <div>${game.strHomeTeam}</div>
            <div>${game.strAwayTeam}</div>
          </div>
          <div class="score">${homeScore} - ${awayScore}</div>
          <div class="game-info">${gameStatus} - ${gameTime}</div>
        `;
        
        liveGamesContainer.appendChild(gameCard);
      });
    }
    
    // Render team tags
    function renderTeamTags() {
      teamTagsContainer.innerHTML = '';
      
      trackedTeams.forEach(team => {
        const tag = document.createElement('span');
        tag.className = 'team-tag';
        tag.textContent = team;
        tag.addEventListener('click', () => removeTeam(team));
        
        teamTagsContainer.appendChild(tag);
      });
    }
    
    // Add a team to tracked teams
    function addTeam(team) {
      if (team && !trackedTeams.includes(team)) {
        trackedTeams.push(team);
        chrome.storage.local.set({ 'trackedTeams': trackedTeams });
        renderTeamTags();
        fetchLiveScores();
      }
    }
    
    // Remove a team from tracked teams
    function removeTeam(team) {
      trackedTeams = trackedTeams.filter(t => t !== team);
      chrome.storage.local.set({ 'trackedTeams': trackedTeams });
      renderTeamTags();
      fetchLiveScores();
    }
    
    // Event listeners
    searchBtn.addEventListener('click', async () => {
      const teamName = teamSearchInput.value.trim();
      if (!teamName) return;
      
      const shortCode = getTeamShortCode(teamName);
      if (shortCode) {
        const teams = await searchTeam(shortCode);
        if (teams.length > 0) {
          addTeam(teams[0].strTeam);
          teamSearchInput.value = '';
        } else {
          alert('Team not found. Please check the name and try again.');
        }
      } else {
        alert('Unable to find short code for this team. Please try another team name.');
      }
    });
    
    refreshBtn.addEventListener('click', fetchLiveScores);
    
    // Initial fetch
    fetchLiveScores();
  });