const activities = {
  relaxed: [
    "Morning café stroll",
    "Sunrise walk in the city",
    "Museum visit",
    "Art gallery exploration",
    "Park relaxation",
    "Picnic in scenic garden",
    "Local food tasting",
    "Spa or wellness session",
    "Boat ride or river cruise",
    "Evening river walk",
    "Book café reading session",
    "Slow shopping at local markets"
  ],
   balanced: [
    "City walking tour",
    "Famous landmark visit",
    "Historical site exploration",
    "Local market exploration",
    "Cultural museum visit",
    "Street food tasting",
    "Sunset viewpoint hike",
    "Guided architecture tour",
    "Neighborhood discovery walk",
    "Night city stroll",
    "Food tour experience",
    "Photography walk"
  ],
   adventurous: [
    "Mountain hiking trip",
    "Cycling through countryside",
    "Kayaking adventure",
    "Rock climbing session",
    "Ziplining experience",
    "Scuba diving or snorkeling",
    "Camping under stars",
    "Off-road jeep safari",
    "Street food night hunt",
    "Night city exploration",
    "Paragliding experience",
    "White water rafting"
  ]
};

/* ---------- LOADING ---------- */
function setLoading(state){
  document.getElementById('loader').style.display = state ? 'block' : 'none';
  document.getElementById('generateBtn').disabled = state;
}

/* ---------- SMART PICK ---------- */
function pickActivities(style){
  return [...activities[style]]
    .map(a => ({a, score: Math.random() + (a.includes("tour") ? 0.2 : 0)}))
    .sort((x,y)=>y.score-x.score)
    .slice(0,3)
    .map(x=>x.a);
}

/* ---------- GENERATE ---------- */
function generateItinerary(){
  const destination = document.getElementById('destination').value;
  const days = parseInt(document.getElementById('days').value);
  const style = document.getElementById('style').value;

  const output = document.getElementById('output');

  if(!destination){
    toast("Enter destination");
    return;
  }

  setLoading(true);

  setTimeout(() => {
    let html = `<h2>${destination} Trip Plan</h2>`;

    for(let i=1;i<=days;i++){
      const daily = pickActivities(style);

      html += `
        <div class="day">
          <h3>Day ${i}</h3>
          <ul>
            ${daily.map(a=>`<li>${a} in ${destination}</li>`).join('')}
          </ul>
          <textarea class="note" placeholder="Notes for Day ${i}"></textarea>
        </div>
      `;
    }

    output.innerHTML = html;

    localStorage.setItem("last", html);

    setLoading(false);
    toast("Itinerary generated");
  }, 500);
}

/* ---------- COPY ---------- */
function copyItinerary(){
  navigator.clipboard.writeText(document.getElementById('output').innerText);
  toast("Copied to clipboard");
}

/* ---------- SAVE / LOAD ---------- */
function saveItinerary(){
  const data = {
    destination: document.getElementById('destination').value,
    days: document.getElementById('days').value,
    style: document.getElementById('style').value,
    html: document.getElementById('output').innerHTML
  };

  localStorage.setItem("itinerary", JSON.stringify(data));
  toast("Saved");
}

function loadItinerary(){
  const data = JSON.parse(localStorage.getItem("itinerary"));
  if(!data){
    toast("No saved data");
    return;
  }

  document.getElementById('destination').value = data.destination;
  document.getElementById('days').value = data.days;
  document.getElementById('style').value = data.style;
  document.getElementById('output').innerHTML = data.html;

  toast("Loaded");
}

/* ---------- EXPORT ---------- */
function exportJSON(){
  const data = localStorage.getItem("itinerary");
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "itinerary.json";
  a.click();
}

/* ---------- THEME ---------- */
function toggleTheme(){
  document.body.classList.toggle("dark");
}

/* ---------- TOAST ---------- */
function toast(msg){
  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

/* ---------- INIT ---------- */
window.onload = () => {
  document.getElementById('output').innerHTML = localStorage.getItem("last") || "";
};