 const activities = {
      relaxed: [
        "Morning café stroll",
        "Museum visit",
        "Park relaxation",
        "Local food tasting",
        "Evening river walk"
      ],
      balanced: [
        "City walking tour",
        "Famous landmark visit",
        "Local market exploration",
        "Cultural museum",
        "Sunset viewpoint"
      ],
      adventurous: [
        "Hiking trip",
        "Cycling tour",
        "Kayaking adventure",
        "Street food hunt",
        "Night city exploration"
      ]
    };

    function generateItinerary() {
      const destination = document.getElementById('destination').value;
      const days = parseInt(document.getElementById('days').value);
      const style = document.getElementById('style').value;
      const output = document.getElementById('output');

      if (!destination) {
        output.innerHTML = '<p>Please enter a destination.</p>';
        return;
      }

      let plan = `<h2>Itinerary for ${destination}</h2>`;

      for (let i = 1; i <= days; i++) {
        const dailyActivities = shuffle([...activities[style]]).slice(0, 3);
        plan += `
          <div class="day">
            <h3>Day ${i}</h3>
            <ul>
              ${dailyActivities.map(a => `<li>${a} in ${destination}</li>`).join('')}
            </ul>
          </div>
        `;
      }

      output.innerHTML = plan;
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }