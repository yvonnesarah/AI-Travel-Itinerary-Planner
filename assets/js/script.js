function generateItinerary() {

  const destination = document.getElementById("destination").value;
  const days = document.getElementById("days").value;
  const budget = document.getElementById("budget").value;
  const style = document.getElementById("style").value;
  const preferences = document.getElementById("preferences").value;

  const itineraryContainer = document.getElementById("itinerary");

  if (!destination || !days) {
    alert("Please enter destination and number of days.");
    return;
  }

  const activities = {
    Adventure: [
      "Mountain Hiking",
      "River Rafting",
      "ATV Ride",
      "Zipline Experience",
      "Camping Under Stars"
    ],

    Relaxation: [
      "Spa Session",
      "Beach Relaxation",
      "Sunset Cruise",
      "Yoga Retreat",
      "Luxury Café Visit"
    ],

    Cultural: [
      "Museum Tour",
      "Historic Landmark Visit",
      "Local Market Exploration",
      "Traditional Dance Show",
      "Art Gallery Visit"
    ],

    Romantic: [
      "Candlelight Dinner",
      "Sunset Walk",
      "Boat Ride",
      "Wine Tasting",
      "Private Beach Evening"
    ],

    "Food & Nightlife": [
      "Street Food Tour",
      "Fine Dining Experience",
      "Night Club Visit",
      "Rooftop Bar",
      "Local Cuisine Workshop"
    ]
  };

  itineraryContainer.innerHTML = "";

  for (let i = 1; i <= days; i++) {

    const randomActivities = [];

    for (let j = 0; j < 3; j++) {
      const random =
        activities[style][
          Math.floor(Math.random() * activities[style].length)
        ];

      randomActivities.push(random);
    }

    const dayCard = `
      <div class="day-card">
        <h3>Day ${i} - ${destination}</h3>

        <div class="activity">
          <strong>Morning:</strong> ${randomActivities[0]}
        </div>

        <div class="activity">
          <strong>Afternoon:</strong> ${randomActivities[1]}
        </div>

        <div class="activity">
          <strong>Evening:</strong> ${randomActivities[2]}
        </div>

        <div class="activity">
          <strong>Budget:</strong> ${budget}
        </div>

        <div class="activity">
          <strong>Preferences:</strong> ${preferences || "General sightseeing"}
        </div>
      </div>
    `;

    itineraryContainer.innerHTML += dayCard;
  }
}