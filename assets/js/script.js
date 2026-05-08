function generateItinerary() {

  const destination = document.getElementById("destination").value;
  const days = parseInt(document.getElementById("days").value);
  const budget = document.getElementById("budget").value;
  const style = document.getElementById("style").value;
  const preferences = document.getElementById("preferences").value;
  const travelers = document.getElementById("travelers").value;
  const startDate = document.getElementById("startDate").value;

  const includeHotel = document.getElementById("includeHotel").checked;
  const includeFood = document.getElementById("includeFood").checked;
  const includeTransport = document.getElementById("includeTransport").checked;

  const itineraryContainer = document.getElementById("itinerary");
  const tripSummary = document.getElementById("tripSummary");

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
      "Camping Under Stars",
      "Waterfall Trek",
      "Scuba Diving"
    ],

    Relaxation: [
      "Spa Session",
      "Beach Relaxation",
      "Sunset Cruise",
      "Yoga Retreat",
      "Luxury Café Visit",
      "Resort Pool Day"
    ],

    Cultural: [
      "Museum Tour",
      "Historic Landmark Visit",
      "Local Market Exploration",
      "Traditional Dance Show",
      "Art Gallery Visit",
      "Cultural Workshop"
    ],

    Romantic: [
      "Candlelight Dinner",
      "Sunset Walk",
      "Boat Ride",
      "Wine Tasting",
      "Private Beach Evening",
      "Couple Spa"
    ],

    "Food & Nightlife": [
      "Street Food Tour",
      "Fine Dining Experience",
      "Night Club Visit",
      "Rooftop Bar",
      "Local Cuisine Workshop",
      "Live Music Lounge"
    ]
  };

  const hotels = {
    Budget: ["City Backpack Hostel", "Budget Stay Inn", "Urban Sleep Hotel"],
    "Mid-Range": ["Grand Horizon Hotel", "Central Suites", "Skyline Residency"],
    Luxury: ["Royal Palace Resort", "The Imperial Luxury", "Elite Grand Hotel"]
  };

  const foods = [
    "Try authentic local cuisine",
    "Visit a famous café",
    "Taste traditional desserts",
    "Enjoy local seafood specialties",
    "Experience a rooftop dinner"
  ];

  const transportTips = [
    "Use metro for faster travel",
    "Book airport transfer early",
    "Use city travel passes",
    "Avoid rush hour traffic",
    "Download offline maps"
  ];

  const weatherOptions = [
    "☀️ Sunny 24°C",
    "⛅ Cloudy 19°C",
    "🌦 Light Rain 18°C",
    "🌤 Pleasant 22°C"
  ];

  itineraryContainer.innerHTML = "";

  const estimatedCost =
    budget === "Budget"
      ? days * 80
      : budget === "Mid-Range"
      ? days * 180
      : days * 400;

  tripSummary.innerHTML = `
    <div class="trip-summary">
      <h3>${destination} Adventure Overview</h3>

      <div class="summary-grid">

        <div class="summary-item">
          <span>Duration</span>
          <strong>${days} Days</strong>
        </div>

        <div class="summary-item">
          <span>Travelers</span>
          <strong>${travelers}</strong>
        </div>

        <div class="summary-item">
          <span>Budget</span>
          <strong>${budget}</strong>
        </div>

        <div class="summary-item">
          <span>Estimated Cost</span>
          <strong>$${estimatedCost}</strong>
        </div>

      </div>
    </div>
  `;

  for (let i = 1; i <= days; i++) {

    const randomActivities = [];

    for (let j = 0; j < 3; j++) {
      const random =
        activities[style][
          Math.floor(Math.random() * activities[style].length)
        ];

      randomActivities.push(random);
    }

    const randomWeather =
      weatherOptions[Math.floor(Math.random() * weatherOptions.length)];

    const randomHotel =
      hotels[budget][Math.floor(Math.random() * hotels[budget].length)];

    const randomFood =
      foods[Math.floor(Math.random() * foods.length)];

    const randomTransport =
      transportTips[Math.floor(Math.random() * transportTips.length)];

    const tripDate = startDate
      ? new Date(startDate)
      : new Date();

    tripDate.setDate(tripDate.getDate() + (i - 1));

    const formattedDate = tripDate.toDateString();

    const dayCard = `
      <div class="day-card">

        <div class="day-header">
          <div>
            <div class="day-title">Day ${i} - ${destination}</div>
            <small>${formattedDate}</small>
          </div>

          <div class="weather-badge">
            ${randomWeather}
          </div>
        </div>

        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-sun"></i>
          </div>

          <div class="activity-content">
            <strong>Morning</strong>
            ${randomActivities[0]}
          </div>
        </div>

        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-cloud-sun"></i>
          </div>

          <div class="activity-content">
            <strong>Afternoon</strong>
            ${randomActivities[1]}
          </div>
        </div>

        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-moon"></i>
          </div>

          <div class="activity-content">
            <strong>Evening</strong>
            ${randomActivities[2]}
          </div>
        </div>

        ${includeHotel ? `
        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-hotel"></i>
          </div>

          <div class="activity-content">
            <strong>Recommended Hotel</strong>
            ${randomHotel}
          </div>
        </div>
        ` : ""}

        ${includeFood ? `
        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-utensils"></i>
          </div>

          <div class="activity-content">
            <strong>Food Recommendation</strong>
            ${randomFood}
          </div>
        </div>
        ` : ""}

        ${includeTransport ? `
        <div class="activity">
          <div class="activity-icon">
            <i class="fa-solid fa-bus"></i>
          </div>

          <div class="activity-content">
            <strong>Transport Tip</strong>
            ${randomTransport}
          </div>
        </div>
        ` : ""}

        <div class="tag-row">
          <div class="tag">${style}</div>
          <div class="tag">${budget}</div>
          <div class="tag">${travelers} Travelers</div>
        </div>

      </div>
    `;

    itineraryContainer.innerHTML += dayCard;
  }
}

function clearPlan() {

  document.getElementById("tripSummary").innerHTML = "";

  document.getElementById("itinerary").innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-earth-americas"></i>
      <p>Your AI itinerary will appear here.</p>
    </div>
  `;
}

function downloadPlan() {

  const content = document.querySelector(".result-section").innerText;

  const blob = new Blob([content], { type: "text/plain" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "travel-plan.txt";

  link.click();
}