document.getElementById("generateCard").addEventListener("click", generateCard);
document.getElementById("downloadCard").addEventListener("click", downloadCard);
document.getElementById("loadCard").addEventListener("click", loadCard);

function loadCard() {
  const fileInput = document.getElementById("loadFile");

  // Check if a file is selected
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select a .txt file to load!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  // File read success handler
  reader.onload = function (e) {
    const content = e.target.result;
    console.log("File content loaded:", content); // Debugging

    // Parse the file content
    const lines = content.split("\n");
    const data = {};
    let currentKey = null;

    lines.forEach((line, index) => {
      console.log(`Processing line ${index + 1}:`, line); // Debugging

      if (line.includes(":")) {
        // Key-value pair detected
        const [key, ...valueParts] = line.split(":");
        currentKey = key.trim().toLowerCase();
        const value = valueParts.join(":").trim();
        data[currentKey] = value;
      } else if (currentKey) {
        // Append multi-line values
        data[currentKey] += `\n${line.trim()}`;
      }
    });

    console.log("Parsed data:", data); // Debugging

    // Populate the form fields
    try {
      document.getElementById("name").value = data.name || "";
      document.getElementById("cardType").value = data.type || "Character";
      document.getElementById("faction").value = data.faction || "Misc";
      document.getElementById("stats").value = data.stats || "";
      document.getElementById("abilities").value = data.abilities || "";
      document.getElementById("credits").value = data.credits || "";
      document.getElementById("flavorText").value = data["flavor text"] || "";

      alert("Card details loaded successfully!");
    } catch (error) {
      console.error("Error populating fields:", error);
      alert("An error occurred while populating the fields. Please check the file format.");
    }
  };

  // File read error handler
  reader.onerror = function () {
    alert("Error reading file. Please try again.");
  };

  // Start reading the file
  reader.readAsText(file);
}



function generateCard() {
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");

  // Get input values
  const name = document.getElementById("name").value.trim();
  const cardType = document.getElementById("cardType").value;
  const faction = document.getElementById("faction").value; // Faction selection
  const stats = document.getElementById("stats").value;
  const abilities = document.getElementById("abilities").value;
  const credits = document.getElementById("credits").value;
  const flavorText = document.getElementById("flavorText").value;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background color
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borders
  ctx.strokeStyle = "#000000";
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
  ctx.fillText(`${faction}`, canvas.width / 2, 100); // Position faction below the name

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
  imageLink.download = `${filename}.png`;  // Use the name input for the image file
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
  textLink.download = `${filename}.txt`;  // Use the same filename for the .txt file
  textLink.href = URL.createObjectURL(textBlob);
  textLink.click();

  // Clear the form fields
  clearFields();
}

function clearFields() {
  document.getElementById("name").value = "";
  document.getElementById("cardType").value = "Character"; // Default value for dropdown
  document.getElementById("stats").value = "";
  document.getElementById("abilities").value = "";
  document.getElementById("credits").value = "";
  document.getElementById("flavorText").value = "";
}
