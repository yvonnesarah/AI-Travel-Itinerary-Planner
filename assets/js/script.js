let budgetChart;
let currentPlan = [];
let toastTimeout;

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // Theme load
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  else {
    showToast("Welcome to AI Travel Planner ✈️", "info");
  }
});

// =========================
// TOAST 
// =========================
function showToast(msg, type = "success") {

  const toast = document.getElementById("toast");
  if (!toast) return;

  clearTimeout(toastTimeout);

  toast.innerText = msg;
  toast.className = "toast show";

  // reset & apply type
  toast.classList.remove("error", "info", "success");

  if (type) toast.classList.add(type);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// =========================
// THEME
// =========================
function toggleTheme() {

  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark")
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


function formatCurrency(amount){

  const currency =
    document.getElementById("currency").value;

  return new Intl.NumberFormat(
    "en-US",
    {
      style:"currency",
      currency
    }
  ).format(amount);
}


function loadMap(destination){

  document.getElementById("map").innerHTML = `

    <iframe
      width="100%"
      height="350"
      frameborder="0"
      style="border:0"
      src="https://www.google.com/maps?q=${destination}&output=embed"
      allowfullscreen>
    </iframe>

  `;
}

function startCountdown(startDate){

  if(!startDate) return;

  const countdown =
    document.getElementById("countdown");

  const interval = setInterval(()=>{

    const tripDate =
      new Date(startDate);

    const now =
      new Date();

    const diff =
      tripDate - now;

    if(diff <= 0){

      countdown.innerHTML =
        "✈️ Trip Started!";

      clearInterval(interval);

      return;
    }

    const days =
      Math.floor(
        diff /
        (1000*60*60*24)
      );

    countdown.innerHTML =
      `⏳ ${days} days until your trip`;

  },1000);
}

function renderBudgetChart(total){

  const ctx =
    document.getElementById("budgetChart");

  if(budgetChart){
    budgetChart.destroy();
  }

  budgetChart = new Chart(ctx,{

    type:"doughnut",

    data:{
      labels:[
        "Hotels",
        "Food",
        "Activities",
        "Transport"
      ],

      datasets:[{
        data:[
          total * 0.4,
          total * 0.2,
          total * 0.25,
          total * 0.15
        ]
      }]
    }
  });
}

function getAISuggestion(style, weather){

  if(weather.includes("Rain")){
    return "Visit museums and indoor cafés today ☔";
  }

  if(style === "Adventure"){
    return "Perfect weather for outdoor exploration 🏔";
  }

  if(style === "Romantic"){
    return "Book a sunset dinner tonight 🌅";
  }

  return "Explore local attractions nearby ✨";
}

let expenses = [];

function addExpense(){

  const value =
    document.getElementById(
      "expenseInput"
    ).value;

  if(!value) return;

  expenses.push(Number(value));

  renderExpenses();

  document.getElementById(
    "expenseInput"
  ).value = "";
}

function renderExpenses(){

  const total =
    expenses.reduce(
      (a,b)=>a+b,
      0
    );

  document.getElementById(
    "expenseList"
  ).innerHTML = `

    <div class="expense-item">
      Total Expenses:
      ${formatCurrency(total)}
    </div>

  `;
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


/* =========================
   WEATHER SYSTEM (SIMULATED DAILY)
========================= */

const weatherTypes = [
  "Sunny ☀️",
  "Cloudy ☁️",
  "Rainy 🌧️",
  "Windy 🌬️",
  "Partly Cloudy ⛅"
];

/* =========================
   WEATHER TIP ENGINE
========================= */

function getWeatherTip(weather) {

  if (weather.includes("Rain")) {
    return "Carry umbrella ☔ & focus on indoor attractions";
  }

  if (weather.includes("Sunny")) {
    return "Perfect for outdoor activities 🌞 Use sunscreen";
  }

  if (weather.includes("Wind")) {
    return "Avoid high altitude or boat activities 🌬️";
  }

  if (weather.includes("Cloud")) {
    return "Good sightseeing weather 🚶 Comfortable for walking";
  }

  return "Check conditions before heading out";
}


function getPackingList(weather) {

  let items = [];

  if (weather.includes("Rain")) {
    items.push("☔ Umbrella");
    items.push("🧥 Waterproof jacket");
    items.push("👟 Waterproof shoes");
  }

  if (weather.includes("Sunny")) {
    items.push("🧴 Sunscreen");
    items.push("🕶 Sunglasses");
    items.push("🧢 Hat / Cap");
  }

  if (weather.includes("Wind")) {
    items.push("🧥 Light jacket");
  }

  if (weather.includes("Cloud")) {
    items.push("👕 Comfortable clothing");
  }

  // always included essentials
  items.push("📱 Phone charger");
  items.push("🪪 ID / Passport");
  items.push("💳 Wallet");

  return items;
}

/* =========================
   WEATHER
========================= */

async function fetchWeather(destination){

    document.getElementById("weatherBox").innerHTML =
  "<div class='activity'>🌍 Loading weather...</div>";

  try{

    const apiKey =
      "81c0d22b83ccbe180ccf4acf19f7d978";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}&units=metric`
    );

   const data = await res.json();

if (!data.main) {
  throw new Error("Invalid weather response");
}

   document.getElementById("weatherBox").innerHTML = `

  <div class="day-card">

    <h3>🌍 Weather in ${data.name}</h3>

    <div class="activity">🌡 Temperature: ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)</div>

    <div class="activity">📉 Min: ${data.main.temp_min}°C | 📈 Max: ${data.main.temp_max}°C</div>

    <div class="activity">☁️ Condition: ${data.weather[0].description}</div>

    <div class="activity">💧 Humidity: ${data.main.humidity}%</div>

    <div class="activity">🌬 Wind: ${data.wind.speed} m/s (${getWindDirection(data.wind.deg)})</div>

    <div class="activity">🔵 Pressure: ${data.main.pressure} hPa</div>

    <div class="activity">👀 Visibility: ${(data.visibility / 1000).toFixed(1)} km</div>

    <div class="activity">🌅 Sunrise: ${formatTime(data.sys.sunrise)}</div>

    <div class="activity">🌇 Sunset: ${formatTime(data.sys.sunset)}</div>

    <div class="activity">🌧 Rain chance: ${data.rain?.["1h"] ? data.rain["1h"] + " mm (last hour)" : "No rain detected"}</div>

    <div class="activity">💡 Travel Tip: ${getSmartWeatherAdvice(data)}</div>

  </div>

`;

} catch (err) {
  console.error(err);
  showToast("Weather unavailable ❌", "error");
  }
}

function formatTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getWindDirection(deg) {
  const directions = [
    "N", "NE", "E", "SE",
    "S", "SW", "W", "NW"
  ];

  return directions[Math.round(deg / 45) % 8];
}

function getSmartWeatherAdvice(data) {

  const temp = data.main.temp;
  const weather = data.weather[0].main.toLowerCase();

  if (weather.includes("rain")) {
    return "Rain expected ☔ → indoor attractions & museum visits recommended";
  }

  if (temp > 30) {
    return "Very hot 🔥 → stay hydrated, plan indoor midday breaks";
  }

  if (temp < 5) {
    return "Very cold ❄️ → warm clothing required, limit outdoor exposure";
  }

  if (weather.includes("cloud")) {
    return "Mild cloudy weather ☁️ → perfect for sightseeing walks";
  }

  if (weather.includes("clear")) {
    return "Clear skies ☀️ → best time for outdoor activities & photography";
  }

  return "Good travel conditions 👍 enjoy your day!";
}

/* =========================
   FAVORITES
========================= */

function saveFavorite(activity){

  let favs = JSON.parse(localStorage.getItem("favorites")) || [];

  favs.push(activity);

  localStorage.setItem("favorites", JSON.stringify(favs));

  showToast("Added to favourites ❤️");
}

/* =========================
   COLLAPSE
========================= */

function toggleDay(id){

  document
    .getElementById(id)
    .classList.toggle("hidden");
}

/* =========================
   GENERATE ITINERARY
========================= */

function generateItinerary() {

const destination = document.getElementById("destination").value;
const days = parseInt(document.getElementById("days").value);
const budget = document.getElementById("budget").value;
const style = document.getElementById("style").value;
const travelers = document.getElementById("travelers").value;
const startDate = document.getElementById("startDate").value;

fetchWeather(destination); 

  if (!destination || !days) {
    showToast("Fill all fields", "error");
    return;
  }

  const pick = arr =>
    arr[Math.floor(Math.random() * arr.length)];

  // PRICE PER DAY
  let baseCost =
    budget === "Budget" ? 80 :
    budget === "Mid-Range" ? 180 : 400;

  let totalCost = baseCost * days;

  document.getElementById("tripSummary").innerHTML = `

    <div class="stats-grid">

      <div class="stat-card">
        <h3>${days}</h3>
        <p>Days</p>
      </div>

      <div class="stat-card">
        <h3>${travelers}</h3>
        <p>Travelers</p>
      </div>

      <div class="stat-card">
        <h3>${formatCurrency(totalCost)}</h3>
        <p>Total Trip Cost</p>
      </div>

    </div>

    <div class="day-card">
      <h2>${destination}</h2>
      <p>${style} travel plan</p>
    </div>

  `;

  const itinerary = document.getElementById("itinerary");

  itinerary.innerHTML = "";
  currentPlan = [];

  for (let i = 1; i <= days; i++) {

    const baseDate = startDate ? new Date(startDate) : new Date();
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i - 1);

    // 🌤 WEATHER + TIP
    const weather = weatherTypes[i % weatherTypes.length];
    const tip = getWeatherTip(weather);

    const dayCost = baseCost; // 💰 DAILY PRICE

    const day = {
      day: i,
      date: date.toDateString(),
      weather: weather,
      tip: tip,
      cost: dayCost,
      packing: getPackingList(weather), 
      hotel: pick(hotels[budget]),
      schedule: {
        morning: pick(activities[style]),
        midday: pick(foods),
        afternoon: pick(activities[style]),
        evening: pick(transport)
      }
    };

    currentPlan.push(day);

    itinerary.innerHTML += `

      <div class="day-card">

        <div class="day-header"
          onclick="toggleDay('d${i}')">

          <div>
            <h3>Day ${i}</h3>
            <small>${day.date}</small>
          </div>

          <i class="fa-solid fa-chevron-down"></i>

        </div>

        <div class="day-content" id="d${i}">

        <div class="activity">🎒 Packing List:</div>

        <ul class="packing-list">
        ${day.packing.map(item => `<li>${item}</li>`).join("")}
         </ul>

          <div class="activity">🌤 Weather: ${day.weather}</div>

          <div class="activity">💡 Tip: ${day.tip}</div>

          <div class="activity">
           🤖 AI Suggestion:
           ${getAISuggestion(style, weather)}
        </div>

          <div class="activity">Day Cost: £${day.cost}</div>

           <div class="activity">🌅 ${day.schedule.morning}</div>
           <div class="activity">🍽️ ${day.schedule.midday}</div>
           <div class="activity">☀️ ${day.schedule.afternoon}</div>
           <div class="activity">🌙 ${day.schedule.evening}</div>

          <div class="activity">🏨 ${day.hotel}</div>

        <!-- ⭐ Favourite moved to end -->
       <div class="activity">
  ❤️ Favourite this day
  <button class="favorite-btn"
    onclick="saveFavorite('Day ${i} - ${day.schedule.morning}')">
    ❤️
  </button>
</div>

      </div>

    `;
  }

  loadMap(destination);

startCountdown(startDate);

renderBudgetChart(totalCost);


  showToast("Trip generated ✨");
}

function saveTrip() {

  if (!currentPlan.length) {
    showToast("No trip to save ❌", "error");
    return;
  }

  const tripData = {
    createdAt: new Date().toISOString(),
    plan: currentPlan
  };

  let savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];

  savedTrips.push(tripData);

  localStorage.setItem("savedTrips", JSON.stringify(savedTrips));

  showToast("Trip saved 💾");
}

function loadLastTrip() {

  let savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];

  if (!savedTrips.length) {
    showToast("No saved trips found ❌", "error");
    return;
  }

  currentPlan = savedTrips[savedTrips.length - 1].plan;

  renderSavedPlan();

  showToast("Last trip loaded 📂");
}

/* =========================
   EXPORT JSON
========================= */

function exportJSON(){

  if(currentPlan.length === 0){
    showToast("No trip to export ❌", "error");
    return;
  }

  const blob = new Blob(
    [JSON.stringify(currentPlan,null,2)],
    { type:"application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "travel-plan.json";

  a.click();

  showToast("JSON exported 📄");
}

/* =========================
   PDF
========================= */

function downloadPlan(){

  if(currentPlan.length === 0){
    showToast("Generate a trip first ❌", "error");
    return;
  }

  showToast("Generating PDF ⏳", "info");

  html2pdf()
    .from(document.querySelector(".result-section"))
    .save("travel-plan.pdf")
    .then(() => {
      showToast("PDF downloaded 📥");
    });
}

function renderSavedPlan() {
  if (!currentPlan.length) return;

  const itinerary = document.getElementById("itinerary");
  itinerary.innerHTML = "";

  currentPlan.forEach((day, i) => {
    itinerary.innerHTML += `
      <div class="day-card">
        <div class="day-header" onclick="toggleDay('saved${i}')">
          <div>
            <h3>Day ${day.day}</h3>
            <small>${day.date}</small>
          </div>
          <i class="fa-solid fa-chevron-down"></i>
        </div>

        <div class="day-content" id="saved${i}">
          <div class="activity">🌤 Weather: ${day.weather}</div>
          <div class="activity">💡 Tip: ${day.tip}</div>
          <div class="activity">🏨 ${day.hotel}</div>
        </div>
      </div>
    `;
  });
}