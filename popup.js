//Manages the popup.html page

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('scores-container');
    
    chrome.storage.local.get(['soccerScores'], (result) => {
        const scores = result.soccerScores || [];
        
        if (scores.length === 0) {
            container.innerHTML = '<p>No live matches currently ⏳</p>';
            return;
        }

        container.innerHTML = scores.map(match => `
            <div class="score-item">
                <div class="teams">
                    ${match.strHomeTeam} ${match.intHomeScore} - ${match.intAwayScore} ${match.strAwayTeam}
                </div>
                <div class="status">
                    ${match.strStatus} (${match.strProgress || '1st Half'})
                </div>
            </div>
        `).join('');
    });
});