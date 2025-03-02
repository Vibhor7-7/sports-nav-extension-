//Manages the popup.html page
document.addEventListener('DOMContentLoaded', () => {
    const teamInput = document.getElementById('teamInput');
    const searchBtn = document.getElementById('searchBtn');
    const teamList = document.getElementById('teamList');
    const matchesContainer = document.getElementById('matchesContainer');

    // Search teams when button clicked or Enter pressed
    searchBtn.addEventListener('click', handleSearch);
    teamInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    async function handleSearch() {
        const teamName = teamInput.value.trim();
        if (!teamName) return;
        
        teamList.innerHTML = '<div class="no-results">Searching...</div>';
        const teams = await searchTeams(teamName);
        displayTeams(teams);
    }

    async function searchTeams(teamName) {
        try {
            const response = await fetch(
                `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(teamName)}`
            );
            if (!response.ok) throw new Error('API request failed');
            return (await response.json()).teams || [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    function displayTeams(teams) {
        teamList.innerHTML = teams.length > 0 
            ? teams.map(team => `
                <div class="team-item" data-id="${team.idTeam}">
                    ${team.strTeam} 
                    <small>(${team.strLeague})</small>
                </div>
              `).join('')
            : '<div class="no-results">No teams found</div>';

        document.querySelectorAll('.team-item').forEach(item => {
            item.addEventListener('click', () => {
                const teamId = item.dataset.id;
                const teamName = item.textContent.trim();
                saveTeamSelection(teamId, teamName);
                loadTeamMatches(teamId);
            });
        });
    }

    async function saveTeamSelection(teamId, teamName) {
        await chrome.storage.local.set({ 
            selectedTeam: { id: teamId, name: teamName } 
        });
        window.close(); // Close popup after selection
    }

    async function loadTeamMatches(teamId) {
        matchesContainer.innerHTML = '<div class="no-results">Loading matches...</div>';
        
        try {
            const [pastResponse, upcomingResponse] = await Promise.all([
                fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`),
                fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`)
            ]);
            
            const pastMatches = (await pastResponse.json()).results || [];
            const upcomingMatches = (await upcomingResponse.json()).events || [];
            
            displayMatches([...upcomingMatches, ...pastMatches]);
        } catch (error) {
            console.error('Match load error:', error);
            matchesContainer.innerHTML = '<div class="no-results">Error loading matches</div>';
        }
    }

    function displayMatches(matches) {
        matchesContainer.innerHTML = matches.length > 0
            ? matches.map(match => `
                <div class="match-item">
                    <h3>${match.strEvent}</h3>
                    <p>${match.dateEvent} • ${match.strTime}</p>
                    ${match.intHomeScore !== undefined ? `
                        <p>${match.intHomeScore} - ${match.intAwayScore}</p>
                    ` : '<p>Scheduled Match</p>'}
                </div>
              `).join('')
            : '<div class="no-results">No matches found</div>';
    }

    // Load previous selection on startup
    chrome.storage.local.get(['selectedTeam'], (result) => {
        if (result.selectedTeam) {
            teamInput.value = result.selectedTeam.name;
            loadTeamMatches(result.selectedTeam.id);
        }
    });
});