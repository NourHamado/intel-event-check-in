// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Get greeting message element (already in HTML above check-in form)
const greetingDiv = document.getElementById("greetingMessage");

// Get progress bar element
const progressBar = document.getElementById("progressBar");

// Reset everything if goal was reached on previous session
if (
  localStorage.getItem("totalCount") &&
  parseInt(localStorage.getItem("totalCount")) >= maxCount
) {
  localStorage.setItem("totalCount", "0");
  localStorage.setItem("waterCount", "0");
  localStorage.setItem("zeroCount", "0");
  localStorage.setItem("powerCount", "0");
  localStorage.removeItem("attendeeList");
}

// Reload counts and attendee list after possible reset
count = 0;
if (localStorage.getItem("totalCount")) {
  count = parseInt(localStorage.getItem("totalCount"));
  document.getElementById("attendeeCount").textContent = `${count}`;
}
if (localStorage.getItem("waterCount")) {
  document.getElementById("waterCount").textContent =
    localStorage.getItem("waterCount");
}
if (localStorage.getItem("zeroCount")) {
  document.getElementById("zeroCount").textContent =
    localStorage.getItem("zeroCount");
}
if (localStorage.getItem("powerCount")) {
  document.getElementById("powerCount").textContent =
    localStorage.getItem("powerCount");
}
let attendeeArray = [];
if (localStorage.getItem("attendeeList")) {
  attendeeArray = JSON.parse(localStorage.getItem("attendeeList"));
}
const attendeeList = document.getElementById("attendeeList");

// Function to display attendee list
function displayAttendeeList() {
  attendeeList.innerHTML = "";
  for (let i = 0; i < attendeeArray.length; i++) {
    const attendee = attendeeArray[i];
    const li = document.createElement("li");
    li.textContent = `${attendee.name} (${attendee.teamName})`;
    li.setAttribute("role", "listitem");
    attendeeList.appendChild(li);
  }
}
displayAttendeeList();

// Update progress bar on page load (move this after count is set)
const percentage = Math.round((count / maxCount) * 100);
progressBar.style.width = `${percentage}%`;

// Create or get confetti overlay for full-screen effect
let confettiOverlay = document.getElementById("confettiOverlay");
if (!confettiOverlay) {
  confettiOverlay = document.createElement("div");
  confettiOverlay.id = "confettiOverlay";
  confettiOverlay.style.display = "none";
  document.body.appendChild(confettiOverlay);
}

// Function to show full-screen confetti
function showFullScreenConfetti() {
  confettiOverlay.innerHTML = "";
  confettiOverlay.style.display = "block";
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti-piece";
    conf.style.left = `${Math.random() * 100}%`;
    conf.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    conf.style.animationDelay = `${Math.random()}s`;
    confettiOverlay.appendChild(conf);
  }
  // Hide confetti overlay after animation (1.8s + buffer)
  setTimeout(function () {
    confettiOverlay.style.display = "none";
    confettiOverlay.innerHTML = "";
  }, 2200);
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team);

  // Increment count
  count++;
  localStorage.setItem("totalCount", count);
  console.log(`Total check-ins: ${count}`);

  // Update attendee count display
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = `${count}`;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  const newTeamCount = parseInt(teamCounter.textContent) + 1;
  teamCounter.textContent = newTeamCount;
  localStorage.setItem(team + "Count", newTeamCount);

  // Show welcome message in the greetingDiv
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  greetingDiv.textContent = message;

  // Add attendee to list and localStorage
  attendeeArray.push({ name: name, teamName: teamName });
  localStorage.setItem("attendeeList", JSON.stringify(attendeeArray));
  displayAttendeeList();

  // Check if attendance goal is reached
  if (count >= maxCount) {
    // Get team counts
    const waterCount = parseInt(
      document.getElementById("waterCount").textContent
    );
    const zeroCount = parseInt(
      document.getElementById("zeroCount").textContent
    );
    const powerCount = parseInt(
      document.getElementById("powerCount").textContent
    );

    // Find winning team
    let winningTeam = "Team Water Wise";
    let maxTeamCount = waterCount;
    if (zeroCount > maxTeamCount) {
      winningTeam = "Team Net Zero";
      maxTeamCount = zeroCount;
    }
    if (powerCount > maxTeamCount) {
      winningTeam = "Team Renewables";
      maxTeamCount = powerCount;
    }

    // Show celebration message above check-in
    greetingDiv.innerHTML = `
      <div class="congrats-box">
        <div class="congrats-text">
          🏆 Attendance goal reached!<br>
          <strong>Congratulations, ${winningTeam} is the winner!</strong>
        </div>
      </div>
    `;

    // Show full-screen confetti
    showFullScreenConfetti();

    // Do NOT hide confetti or message after any time
    // Only reset the form
    form.reset();
    return;
  }

  form.reset();
});
