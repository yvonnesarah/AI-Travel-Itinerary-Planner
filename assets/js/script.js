let currentPlan = [];
let toastTimeout;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // Load Theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    showToast("Dark mode enabled 🌙", "info");
  }

  const saveBtn =
    document.querySelector(
      'button[onclick="saveTrip()"]'
    );

  // Load Saved Plan
  const saved = localStorage.getItem("travelPlan");

  if (saved) {

    currentPlan = JSON.parse(saved);

    renderSavedPlan();

    saveBtn.innerHTML =
      "❌ Remove Saved Trip";

    showToast("Saved trip loaded ✈️");

  } else {

    saveBtn.innerHTML =
      "💾 Save Trip";

    showToast(
      "Welcome to AI Travel Itinerary Planner ✈️",
      "info"
    );
  }
});

// =========================
// TOAST
// =========================
function showToast(msg, type = "success") {

  const toast = document.getElementById("toast");

  clearTimeout(toastTimeout);

  toast.innerText = msg;

  toast.className = "toast";

  toast.classList.add("show");

  if (type === "error") {
    toast.classList.add("error");
  }

  if (type === "info") {
    toast.classList.add("info");
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// =========================
// THEME TOGGLE
// =========================
function toggleTheme() {

  document.body.classList.toggle("dark");

  const theme =
    document.body.classList.contains("dark")
      ? "dark"
      : "light";

  localStorage.setItem("theme", theme);

  showToast(
    theme === "dark"
      ? "Dark mode enabled 🌙"
      : "Light mode enabled ☀️",
    "info"
  );
}

// =========================
// DATA
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

// =========================
// GENERATE ITINERARY
// =========================
function generateItinerary() {

  const destination =
    document.getElementById("destination").value;

  const days =
    parseInt(document.getElementById("days").value);

  const budget =
    document.getElementById("budget").value;

  const style =
    document.getElementById("style").value;

  const startDate =
    document.getElementById("startDate").value;

  const itineraryContainer =
    document.getElementById("itinerary");

  const tripSummary =
    document.getElementById("tripSummary");

  // Validation
  if (!destination.trim()) {
    showToast("Please enter a destination", "error");
    return;
  }

  if (!days || days <= 0) {
    showToast("Please enter valid trip days", "error");
    return;
  }

  showToast("Generating smart itinerary...");

  itineraryContainer.innerHTML =
    "⏳ Generating itinerary...";

  // Random picker
  const pick = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  // Budget estimation
  const cost =
    budget === "Budget"
      ? days * 80
      : budget === "Mid-Range"
      ? days * 180
      : days * 400;

  // Summary Card
  tripSummary.innerHTML = `
    <div class="day-card">
      <h3>${destination}</h3>
      <p>${days} days trip</p>
      <p>Cost: £${cost}</p>
      <p>Travel Style: ${style}</p>
    </div>
  `;

  itineraryContainer.innerHTML = "";

  currentPlan = [];

  // Time Slots
  const timeSlots = {
    morning: "08:00 - 11:00",
    midday: "12:00 - 14:00",
    afternoon: "14:30 - 17:30",
    evening: "18:00 - 22:00"
  };

  // Build Days
  for (let i = 1; i <= days; i++) {

    const date =
      new Date(startDate || Date.now());

    date.setDate(date.getDate() + i - 1);

    const day = {

      day: i,

      date: date.toDateString(),

      schedule: {

        morning: {
          time: timeSlots.morning,
          activity: pick(activities[style])
        },

        midday: {
          time: timeSlots.midday,
          activity: pick(foods)
        },

        afternoon: {
          time: timeSlots.afternoon,
          activity: pick(activities[style])
        },

        evening: {
          time: timeSlots.evening,
          activity: pick(transport)
        }
      },

      hotel: pick(hotels[budget])
    };

    currentPlan.push(day);

    itineraryContainer.innerHTML += `

      <div class="day-card">

        <h3>Day ${i}</h3>

        <small>${day.date}</small>

        <div class="activity">
          🌅 ${day.schedule.morning.time}
          — ${day.schedule.morning.activity}
        </div>

        <div class="activity">
          🍽️ ${day.schedule.midday.time}
          — ${day.schedule.midday.activity}
        </div>

        <div class="activity">
          ☀️ ${day.schedule.afternoon.time}
          — ${day.schedule.afternoon.activity}
        </div>

        <div class="activity">
          🌙 ${day.schedule.evening.time}
          — ${day.schedule.evening.activity}
        </div>

        <div class="activity">
          🏨 ${day.hotel}
        </div>

        <div class="activity">
          💰 £${Math.round(cost / days)}/day
        </div>

      </div>
    `;
  }

  showToast("Itinerary generated successfully ✨");
}

// =========================
// SAVE / UNSAVE TRIP
// =========================
function saveTrip() {

  const saveBtn =
    document.querySelector(
      'button[onclick="saveTrip()"]'
    );

  // No plan generated
  if (currentPlan.length === 0) {
    showToast("Generate a trip first", "error");
    return;
  }

  // Already saved → remove it
  if (localStorage.getItem("travelPlan")) {

    localStorage.removeItem("travelPlan");

    showToast("Saved trip removed 🗑️", "info");

    saveBtn.innerHTML = "💾 Save Trip";

    return;
  }

  // Save trip
  localStorage.setItem(
    "travelPlan",
    JSON.stringify(currentPlan)
  );

  showToast("Trip saved successfully 💾");

  saveBtn.innerHTML = "❌ Remove Saved Trip";
}

// =========================
// EXPORT JSON
// =========================
function exportJSON() {

  if (currentPlan.length === 0) {
    showToast("No trip data to export", "error");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(currentPlan, null, 2)],
    {
      type: "application/json"
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "travel-plan.json";

  a.click();

  showToast("JSON exported successfully 📄");
}

// =========================
// PDF EXPORT
// =========================
function downloadPlan() {

  if (currentPlan.length === 0) {
    showToast("Generate a trip before downloading", "error");
    return;
  }

  showToast("Generating PDF...");

  html2pdf()
    .from(document.querySelector(".result-section"))
    .save("travel-plan.pdf")
    .then(() => {
      showToast("PDF downloaded successfully ⬇");
    })
    .catch(() => {
      showToast("PDF generation failed", "error");
    });
}

// =========================
// LOAD SAVED PLAN
// =========================
function renderSavedPlan() {

  const container =
    document.getElementById("itinerary");

  container.innerHTML = "";

  currentPlan.forEach(day => {

    container.innerHTML += `

      <div class="day-card">

        <h3>Day ${day.day}</h3>

        <small>${day.date}</small>

        <div class="activity">
          🌅 ${day.schedule.morning.time}
          — ${day.schedule.morning.activity}
        </div>

        <div class="activity">
          🍽️ ${day.schedule.midday.time}
          — ${day.schedule.midday.activity}
        </div>

        <div class="activity">
          ☀️ ${day.schedule.afternoon.time}
          — ${day.schedule.afternoon.activity}
        </div>

        <div class="activity">
          🌙 ${day.schedule.evening.time}
          — ${day.schedule.evening.activity}
        </div>

        <div class="activity">
          🏨 ${day.hotel}
        </div>

      </div>
    `;
  });

  showToast("Saved itinerary restored ✨");
}