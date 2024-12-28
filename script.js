document.getElementById("generateCard").addEventListener("click", generateCard);
document.getElementById("downloadCard").addEventListener("click", downloadCard);
document.getElementById("loadCard").addEventListener("click", loadCard);
document.getElementById("viewSavedCards").addEventListener("click", displaySavedCards);

function loadCard() {
  const fileInput = document.getElementById("loadFile");

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select a .txt file to load!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;
    const lines = content.split("\n");
    const data = {};
    let currentKey = null;

    lines.forEach((line) => {
      if (line.includes(":")) {
        const [key, ...valueParts] = line.split(":");
        currentKey = key.trim().toLowerCase();
        const value = valueParts.join(":").trim();
        data[currentKey] = value;
      } else if (currentKey) {
        data[currentKey] += `\n${line.trim()}`;
      }
    });

    try {
      document.getElementById("name").value = data.name || "";
      document.getElementById("cardType").value = data.type || "Character";
      document.getElementById("faction").value = data.faction || "Misc";
      document.getElementById("stats").value = data.stats || "";
      document.getElementById("abilities").value = data.abilities || "";
      document.getElementById("credits").value = data.credits || "";
      document.getElementById("flavorText").value = data["flavor text"] || "";

      generateCard();
    } catch (error) {
      console.error("Error populating fields:", error);
      alert("An error occurred while populating the fields. Please check the file format.");
    }
  };

  reader.onerror = function () {
    alert("Error reading file. Please try again.");
  };

  reader.readAsText(file);
}

function generateCard() {
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");

  const name = document.getElementById("name").value.trim();
  const cardType = document.getElementById("cardType").value;
  const faction = document.getElementById("faction").value;
  const stats = document.getElementById("stats").value;
  const abilities = document.getElementById("abilities").value;
  const credits = document.getElementById("credits").value;
  const flavorText = document.getElementById("flavorText").value;

  // Save the card to local storage
  saveCard({ name, cardType, faction, stats, abilities, credits, flavorText });

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set border color based on faction
  let borderColor = "#000000"; // Default border color
  if (faction === "Hackers") {
    borderColor = "#00FF00"; // Green for Hackers
  } else if (faction === "CEO") {
    borderColor = "#FF0000"; // Red for CEO
  }

  // Background color
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borders
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Fonts and text styles
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  // Name
  ctx.font = "bold 36px Arial";
  ctx.fillText(name, canvas.width / 2, 50);

  // Faction (Added to the card)
  ctx.font = "14px Arial";
  ctx.fillText(`${faction}`, canvas.width / 2, 100);

  // Card Type
  ctx.font = "24px Arial";
  ctx.fillText(cardType, canvas.width / 2, canvas.height - 20);

  // Stats
  ctx.textAlign = "right";
  ctx.fillText(stats, canvas.width - 30, canvas.height - 20);

  // Credits
  ctx.textAlign = "left";
  ctx.fillText(`${credits}c`, 30, canvas.height - 20);

  // Abilities
  ctx.textAlign = "left";
  ctx.font = "18px Arial";
  wrapText(ctx, abilities, 30, 700, canvas.width - 60, 24);

  // Flavor Text
  ctx.font = "italic 16px Arial";
  wrapText(ctx, flavorText, 30, canvas.height - 100, canvas.width - 60, 20);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function downloadCard() {
  const canvas = document.getElementById("cardCanvas");

  // Get the name from the Name field
  const name = document.getElementById("name").value;

  // Check if the name is not empty, otherwise default to "card"
  const filename = name.trim() ? name : "card";

  // Get input values for the card details
  const cardType = document.getElementById("cardType").value;
  const stats = document.getElementById("stats").value;
  const abilities = document.getElementById("abilities").value;
  const credits = document.getElementById("credits").value;
  const flavorText = document.getElementById("flavorText").value;

  // Download the card image as PNG
  const imageLink = document.createElement("a");
  imageLink.download = `${filename}.png`;
  imageLink.href = canvas.toDataURL("image/png");
  imageLink.click();

  // Generate card details and download as .txt file
  const cardDetails = `
Name: ${name}
Type: ${cardType}
Stats: ${stats}
Abilities: ${abilities}
Credits: ${credits}
Flavor Text: ${flavorText}
`.trim();

  const textBlob = new Blob([cardDetails], { type: "text/plain" });
  const textLink = document.createElement("a");
  
  // Use the same name for the text file
  textLink.download = `${filename}.txt`;
  textLink.href = URL.createObjectURL(textBlob);
  textLink.click();

  // Clear the form fields
  clearFields();
}

function clearFields() {
  document.getElementById("name").value = "";
  document.getElementById("cardType").value = "Character";
  document.getElementById("faction").value = "Hackers";
  document.getElementById("stats").value = "";
  document.getElementById("abilities").value = "";
  document.getElementById("credits").value = "";
  document.getElementById("flavorText").value = "";

  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCard(card) {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(card);
  localStorage.setItem("cards", JSON.stringify(cards));
}

function displaySavedCards() {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];

  const container = document.getElementById("savedCardsContainer");
  const title = document.createElement("h2");
  title.textContent = "Saved Cards";
  title.style.textAlign = "center";
  container.appendChild(title);
  container.innerHTML = "";

  if (savedCards.length === 0) {
    container.innerHTML = "<p>No saved cards found.</p>";
    return;
  }

  savedCards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "saved-card";
    cardDiv.innerHTML = `
      <h3>${card.name}</h3>
      <button onclick="loadSavedCard(${index})">Load</button>
      <button onclick="deleteSavedCard(${index})">Delete</button>
    `;
    container.appendChild(cardDiv);
  });
}

function loadSavedCard(index) {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  const card = savedCards[index];
  if (!card) {
    alert("Card not found.");
    return;
  }

  document.getElementById("name").value = card.name || "";
  document.getElementById("cardType").value = card.cardType || "Character";
  document.getElementById("faction").value = card.faction || "Misc";
  document.getElementById("stats").value = card.stats || "";
  document.getElementById("abilities").value = card.abilities || "";
  document.getElementById("credits").value = card.credits || "";
  document.getElementById("flavorText").value = card.flavorText || "";

  generateCard();
}

function deleteSavedCard(index) {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  if (index >= 0 && index < savedCards.length) {
    savedCards.splice(index, 1);
    localStorage.setItem("cards", JSON.stringify(savedCards));
    displaySavedCards();
    alert("Card deleted successfully.");
  } else {
    alert("Unable to delete card.");
  }
}
