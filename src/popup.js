//Manages the popup.html page

document.addEventListener('DOMContentLoaded', function() {
  const scoresContainer = document.getElementById('scores-container');
  
  chrome.storage.local.get(['soccerScores'], function(result) {
      const scores = result.soccerScores;
      
      if (!scores || scores.length === 0) {
          scoresContainer.innerHTML = '<p>No live matches currently.</p>';
          return;
      }

      scoresContainer.innerHTML = ''; // Clear loading state
      
      scores.forEach(match => {
          const matchElement = document.createElement('div');
          matchElement.className = 'score-item';
          
          matchElement.innerHTML = `
              <div class="teams">
                  ${match.strHomeTeam} ${match.intHomeScore} - ${match.intAwayScore} ${match.strAwayTeam}
              </div>
              <div class="status">
                  ${match.strStatus} - ${match.strProgress || '1st Half'}
              </div>
          `;
          
          scoresContainer.appendChild(matchElement);
      });
  });
});