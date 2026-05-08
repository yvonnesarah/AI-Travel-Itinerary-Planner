let currentPlan = [];

function generateItinerary() {

  const destination = document.getElementById("destination").value;
  const days = parseInt(document.getElementById("days").value);
  const budget = document.getElementById("budget").value;
  const style = document.getElementById("style").value;
  const travelers = document.getElementById("travelers").value;
  const startDate = document.getElementById("startDate").value;

  const preferences = document.getElementById("preferences").value.toLowerCase();

  const itineraryContainer = document.getElementById("itinerary");
  const tripSummary = document.getElementById("tripSummary");

  if (!destination || !days) {
    alert("Enter destination and days");
    return;
  }

  // =========================
  // ACTIVITIES 
  // =========================
  const activities = {

  Adventure: [
    "Mountain Hiking Trail",
    "Sunrise Summit Climb",
    "Zipline Forest Adventure",
    "White Water Rafting",
    "Camping Under the Stars",
    "Rock Climbing Session",
    "Paragliding Experience",
    "Off-road Desert Safari",
    "Scuba Diving Reef Tour",
    "Snorkeling Lagoon Trip",
    "Bungee Jump Experience",
    "Kayaking River Tour",
    "ATV Quad Biking",
    "Cave Exploration Tour"
  ],

  Relaxation: [
    "Luxury Spa Treatment",
    "Beach Sun Lounging",
    "Hot Spring Wellness Bath",
    "Yoga & Meditation Retreat",
    "Infinity Pool Relaxation",
    "Full Body Massage Session",
    "Aromatherapy Spa Experience",
    "Floating Salt Therapy",
    "Private Resort Chill Day",
    "Scenic Garden Walk",
    "Thermal Spa Experience",
    "Beachside Reading Day"
  ],

  Cultural: [
    "National Museum Tour",
    "Historic Castle Exploration",
    "Local Art Gallery Visit",
    "Traditional Dance Show",
    "Heritage Walking Tour",
    "Ancient Temple Visit",
    "Old Town Exploration",
    "Cultural Cooking Workshop",
    "Folk Music Performance",
    "Archaeological Site Visit",
    "Religious Landmark Tour",
    "Street Art Discovery Walk"
  ],

  Romantic: [
    "Sunset Beach Walk",
    "Candlelight Fine Dining",
    "Private Yacht Cruise",
    "Couples Spa Day",
    "Scenic Rooftop Dinner",
    "Wine Vineyard Tasting",
    "Stargazing Desert Night",
    "Horse Carriage City Ride",
    "Helicopter Scenic Tour",
    "Private Picnic Experience",
    "Lake Side Dinner Setup",
    "Hot Air Balloon Ride"
  ],

  "Food & Nightlife": [
    "Street Food Night Tour",
    "Rooftop Bar Hopping",
    "Night Market Exploration",
    "Local Cooking Class",
    "Wine & Cheese Tasting",
    "Live Jazz Bar Night",
    "Food Festival Experience",
    "Dessert Café Crawl",
    "Michelin Star Dining",
    "Craft Beer Tasting Tour",
    "Night Club Experience",
    "Karaoke Night Out",
    "Sushi Making Workshop",
    "Hidden Local Food Spots Tour"
  ]
};

  const hotels = {
    Budget: ["Budget Inn", "City Hostel"],
    "Mid-Range": ["Grand Hotel", "City Suites"],
    Luxury: ["Royal Palace", "Elite Resort"]
  };

  const foods = ["Local Food Tour", "Cafe Visit", "Fine Dining"];
  const transport = ["Use Metro", "Book Taxi", "Walk Friendly Areas"];

  const cost =
    budget === "Budget" ? days * 80 :
    budget === "Mid-Range" ? days * 180 :
    days * 400;

  // =========================
  // SMART ACTIVITY ENGINE
  // =========================
  const getSmartActivity = (categoryArray) => {

    if (!preferences) {
      return categoryArray[Math.floor(Math.random() * categoryArray.length)];
    }

    const matched = categoryArray.filter(activity =>
      preferences.split(",").some(pref =>
        activity.toLowerCase().includes(pref.trim())
      )
    );

    const pool = matched.length ? matched : categoryArray;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // =========================
  // SUMMARY
  // =========================
  tripSummary.innerHTML = `
    <div class="day-card">
      <h3>${destination}</h3>
      <p>${days} Days | ${travelers} Travelers</p>
      <p>Estimated Cost: £${cost}</p>
      <p><b>AI Style:</b> ${style}</p>
    </div>
  `;

  itineraryContainer.innerHTML = "";
  currentPlan = [];

  // =========================
  // BUILD ITINERARY
  // =========================
  for (let i = 1; i <= days; i++) {

    const date = new Date(startDate || Date.now());
    date.setDate(date.getDate() + i - 1);

    const dayPlan = {
      day: i,
      date: date.toDateString(),
      morning: getSmartActivity(activities[style]),
      afternoon: getSmartActivity(activities[style]),
      evening: getSmartActivity(activities[style]),
      hotel: hotels[budget][Math.floor(Math.random() * hotels[budget].length)],
      food: foods[Math.floor(Math.random() * foods.length)],
      transport: transport[Math.floor(Math.random() * transport.length)]
    };

    currentPlan.push(dayPlan);

    itineraryContainer.innerHTML += `
      <div class="day-card">

        <h3>Day ${i} - ${destination}</h3>
        <small>${dayPlan.date}</small>

        <div class="activity">🌅 Morning: ${dayPlan.morning}</div>
        <div class="activity">☀️ Afternoon: ${dayPlan.afternoon}</div>
        <div class="activity">🌙 Evening: ${dayPlan.evening}</div>

        ${document.getElementById("includeHotel").checked ? `
        <div class="activity">🏨 Hotel: ${dayPlan.hotel}</div>` : ""}

        ${document.getElementById("includeFood").checked ? `
        <div class="activity">🍜 Food: ${dayPlan.food}</div>` : ""}

        ${document.getElementById("includeTransport").checked ? `
        <div class="activity">🚕 Transport: ${dayPlan.transport}</div>` : ""}

        <div class="activity">
          💰 Daily Budget: £${Math.round(cost / days)}
        </div>

      </div>
    `;
  }
}

// =========================
// CLEAR PLAN
// =========================
function clearPlan() {
  document.getElementById("tripSummary").innerHTML = "";
  document.getElementById("itinerary").innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-earth-americas"></i>
      <p>Your AI itinerary will appear here.</p>
    </div>
  `;
}

// =========================
// PDF DOWNLOAD
// =========================
function downloadPlan() {
  const element = document.querySelector(".result-section");
  html2pdf().from(element).save("travel-plan.pdf");
}

// =========================
// SAVE TRIP
// =========================
function saveTrip() {
  localStorage.setItem("travelPlan", JSON.stringify(currentPlan));
  alert("Trip saved!");
}

// =========================
// EXPORT JSON
// =========================
function exportJSON() {
  const blob = new Blob([JSON.stringify(currentPlan, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "travel-plan.json";
  a.click();
}

// =========================
// THEME TOGGLE
// =========================
function toggleTheme() {
  document.body.classList.toggle("dark");
}