let currentPlan = [];

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const saved = localStorage.getItem("travelPlan");
  if (saved) {
    currentPlan = JSON.parse(saved);
    renderSavedPlan();
  }
});

// =========================
// TOAST
// =========================
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}

// =========================
// THEME
// =========================
function toggleTheme() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// =========================
// GENERATE ITINERARY
// =========================
function generateItinerary() {

  const destination = document.getElementById("destination").value;
  const days = parseInt(document.getElementById("days").value);
  const budget = document.getElementById("budget").value;
  const style = document.getElementById("style").value;
  const startDate = document.getElementById("startDate").value;

  const itineraryContainer = document.getElementById("itinerary");
  const tripSummary = document.getElementById("tripSummary");

  if (!destination || !days) {
    showToast("Enter destination & days");
    return;
  }

  itineraryContainer.innerHTML = "⏳ Generating...";

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
    "Cave Exploration Tour",
    "Glacier Trekking",
    "Skydiving Experience",
    "Jungle Night Safari",
    "Volcano Hiking Tour",
    "Sandboarding Dunes",
    "Ice Climbing Adventure"
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
    "Beachside Reading Day",
    "Oceanfront Hammock Rest",
    "Sauna & Steam Therapy",
    "Forest Sound Healing Session",
    "Wellness Detox Retreat",
    "Sunset Beach Meditation"
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
    "Street Art Discovery Walk",
    "Local Market Exploration",
    "Historical Monument Tour",
    "UNESCO Heritage Site Visit",
    "Traditional Craft Workshop",
    "Cultural Village Experience"
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
    "Hot Air Balloon Ride",
    "Moonlit River Walk",
    "Luxury Couple Massage",
    "Private Island Escape Day",
    "Sunset Cliff View Dinner"
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
    "Hidden Local Food Spots Tour",
    "Authentic Street BBQ Crawl",
    "Cocktail Mixology Class",
    "Seafood Night Feast Tour",
    "Late Night Diner Run"
  ]
};

const airports = {
  default: [
    "International Airport Arrival Terminal",
    "City Airport Transfer Hub",
    "Main International Airport",
    "Regional Airport Terminal"
  ]
};

const hotels = {
  Budget: [
    "City Hostel",
    "Backpacker Lodge",
    "Budget Inn",
    "Urban Capsule Hotel",
    "EasyStay Hostel",
    "Nomad Pod Stay",
    "Smart Sleep Inn",
    "Downtown Budget Rooms",
    "Cozy Backpackers Hub",
    "Metro Hostel Central"
  ],

  "Mid-Range": [
    "City Plaza Hotel",
    "Comfort Suites",
    "Grand Horizon Hotel",
    "Urban Boutique Hotel",
    "Harbour View Hotel",
    "Central Stay Hotel",
    "Parkside Inn",
    "Elite Comfort Hotel",
    "Metro Grand Hotel",
    "Riverside Business Hotel"
  ],

  Luxury: [
    "Royal Palace Hotel",
    "Elite Resort & Spa",
    "Grand Imperial Hotel",
    "Skyline Luxury Suites",
    "Oceanfront Palace Resort",
    "The Grand Regent",
    "Diamond Bay Resort",
    "Presidential Luxury Hotel",
    "Aurora Grand Hotel",
    "Golden Crown Palace"
  ]
};

const foods = [
  "Local Street Food Tour",
  "Traditional Home-Style Cuisine",
  "Fine Dining Experience",
  "Hidden Local Restaurant Discovery",
  "Night Market Food Crawl",
  "Seafood Feast by the Coast",
  "Authentic Regional Dish Tasting",
  "Food Truck Street Sampling",
  "Michelin Star Dining Experience",
  "Dessert Café Hopping",
  "Buffet Cultural Feast",
  "Vegetarian Local Specialties Tour",
  "Spice Market Food Walk",
  "Farm-to-Table Dining Experience",
  "Local Bakery & Pastry Crawl",
  "Late Night Snack Run",
  "Chef’s Special Tasting Menu"
];

const transport = [
  "Metro / Subway System",
  "Public Bus Network",
  "Ride-sharing (Uber/Bolt/Lyft)",
  "Traditional Taxi Service",
  "Walking Friendly City Routes",
  "Bike Rental Exploration",
  "Scooter Rental Travel",
  "Tram / Light Rail System",
  "Ferry Boat Transfer",
  "Private Chauffeur Service",
  "Airport Express Train",
  "Hop-on Hop-off Tourist Bus",
  "Rental Car Road Trip",
  "Cable Car Scenic Ride",
  "Boat Taxi Experience"
];

  const cost =
    budget === "Budget" ? days * 80 :
    budget === "Mid-Range" ? days * 180 :
    days * 400;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  tripSummary.innerHTML = `
    <div class="day-card">
      <h3>${destination}</h3>
      <p>${days} days</p>
      <p>£${cost} </p>
    </div>
  `;

  itineraryContainer.innerHTML = "";
  currentPlan = [];

  for (let i = 1; i <= days; i++) {

    const date = new Date(startDate || Date.now());
    date.setDate(date.getDate() + i - 1);

    const day = {
      day: i,
      date: date.toDateString(),

      airport: i === 1
        ? "✈️ Arrival: " + pick(airports.default)
        : i === days
        ? "✈️ Departure: " + pick(airports.default)
        : "",

      morning: pick(activities[style]),
      afternoon: pick(activities[style]),
      evening: pick(activities[style]),

      hotel: pick(hotels[budget]),
      food: pick(foods),
      transport: pick(transport)
    };

    currentPlan.push(day);

    itineraryContainer.innerHTML += `
      <div class="day-card">

        <h3>Day ${i}</h3>
        <small>${day.date}</small>

        ${day.airport ? `<div class="activity"> ${day.airport}</div>` : ""}

        <div class="activity">🌅 ${day.morning}</div>
        <div class="activity">☀️ ${day.afternoon}</div>
        <div class="activity">🌙 ${day.evening}</div>

        <div class="activity">🏨 ${day.hotel}</div>
        <div class="activity">🍜 ${day.food}</div>
        <div class="activity">🚕 ${day.transport}</div>

        <div class="activity">💰 £${Math.round(cost / days)}/day</div>

      </div>
    `;
  }

  showToast("Itinerary generated!");
}

// =========================
// SAVE
// =========================
function saveTrip() {
  localStorage.setItem("travelPlan", JSON.stringify(currentPlan));
  showToast("Trip saved!");
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
// PDF EXPORT
// =========================
function downloadPlan() {
  html2pdf().from(document.querySelector(".result-section"))
    .save("travel-plan.pdf");
}

// =========================
// LOAD SAVED PLAN
// =========================
function renderSavedPlan() {
  const container = document.getElementById("itinerary");
  container.innerHTML = "";

  currentPlan.forEach(day => {
    container.innerHTML += `
      <div class="day-card">

        <h3>Day ${day.day}</h3>
        <small>${day.date}</small>

        ${day.airport ? `<div class="activity"> ${day.airport}</div>` : ""}

        <div class="activity">🌅 ${day.morning}</div>
        <div class="activity">☀️ ${day.afternoon}</div>
        <div class="activity">🌙 ${day.evening}</div>

        <div class="activity">🏨 ${day.hotel}</div>
        <div class="activity">🍜 ${day.food}</div>
        <div class="activity">🚕 ${day.transport}</div>

      </div>
    `;
  });
}