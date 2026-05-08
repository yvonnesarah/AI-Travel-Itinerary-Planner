function generateItinerary() {

  const destination = document.getElementById("destination").value;
  const days = parseInt(document.getElementById("days").value);
  const budget = document.getElementById("budget").value;
  const style = document.getElementById("style").value;
  const travelers = document.getElementById("travelers").value;
  const startDate = document.getElementById("startDate").value;

  const itineraryContainer = document.getElementById("itinerary");
  const tripSummary = document.getElementById("tripSummary");

  if (!destination || !days) {
    alert("Enter destination and days");
    return;
  }

  const activities = {
    Adventure: ["Hiking", "Zipline", "Rafting", "Camping"],
    Relaxation: ["Spa", "Beach Day", "Yoga", "Cruise"],
    Cultural: ["Museum", "Historic Tour", "Art Gallery"],
    Romantic: ["Dinner", "Sunset Walk", "Boat Ride"],
    "Food & Nightlife": ["Street Food", "Rooftop Bar", "Night Club"]
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

  tripSummary.innerHTML = `
    <div class="day-card">
      <h3>${destination}</h3>
      <p>${days} Days | ${travelers} Travelers</p>
      <p>Estimated Cost: £${cost}</p>
    </div>
  `;

  itineraryContainer.innerHTML = "";

  for (let i = 1; i <= days; i++) {

    const date = new Date(startDate || Date.now());
    date.setDate(date.getDate() + i - 1);

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const dayHTML = `
      <div class="day-card">

        <h3>Day ${i} - ${destination}</h3>
        <small>${date.toDateString()}</small>

        <div class="activity">Morning: ${random(activities[style])}</div>
        <div class="activity">Afternoon: ${random(activities[style])}</div>
        <div class="activity">Evening: ${random(activities[style])}</div>

        ${document.getElementById("includeHotel").checked ? `
        <div class="activity">Hotel: ${random(hotels[budget])}</div>` : ""}

        ${document.getElementById("includeFood").checked ? `
        <div class="activity">Food: ${random(foods)}</div>` : ""}

        ${document.getElementById("includeTransport").checked ? `
        <div class="activity">Transport: ${random(transport)}</div>` : ""}

        <div class="activity">
          Daily Budget: £${Math.round(cost / days)}
        </div>

      </div>
    `;

    itineraryContainer.innerHTML += dayHTML;
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
  const element = document.querySelector(".result-section");
  html2pdf().from(element).save("travel-plan.pdf");
}