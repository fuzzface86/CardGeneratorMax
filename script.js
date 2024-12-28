document.getElementById("generateCard").addEventListener("click", generateCard);
document.getElementById("downloadCard").addEventListener("click", downloadCard);
document.getElementById("loadCard").addEventListener("click", loadCard);

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
    } catch {
      alert("Error parsing file. Ensure the format is correct.");
    }
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "bold 36px Arial";
  ctx.fillText(name, canvas.width / 2, 50);

  ctx.font = "14px Arial";
  ctx.fillText(`${faction}`, canvas.width / 2, 100);

  ctx.font = "24px Arial";
  ctx.fillText(cardType, canvas.width / 2, canvas.height - 20);

  ctx.textAlign = "right";
  ctx.fillText(stats, canvas.width - 30, canvas.height - 20);

  ctx.textAlign = "left";
  ctx.fillText(`${credits}c`, 30, canvas.height - 20);

  wrapText(ctx, abilities, 30, 700, canvas.width - 60, 24);

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
  if (!confirm("Would you like to download this card?")) return;

  const canvas = document.getElementById("cardCanvas");
  const name = document.getElementById("name").value || "card";
  const cardDetails = `
Name: ${name}
Type: ${document.getElementById("cardType").value}
Stats: ${document.getElementById("stats").value}
Abilities: ${document.getElementById("abilities").value}
Credits: ${document.getElementById("credits").value}
Flavor Text: ${document.getElementById("flavorText").value}
  `.trim();

  // Download the card image as PNG
  const imageLink = document.createElement("a");
  imageLink.download = `${name}.png`;
  imageLink.href = canvas.toDataURL("image/png");
  imageLink.click();

  // Download the card details as a .txt file
  const textBlob = new Blob([cardDetails], { type: "text/plain" });
  const textLink = document.createElement("a");
  textLink.download = `${name}.txt`;
  textLink.href = URL.createObjectURL(textBlob);
  textLink.click();

  // Clear form fields and canvas
  clearFields();
}

function clearFields() {
  document.getElementById("name").value = "";
  document.getElementById("cardType").value = "Character"; // Reset to default
  document.getElementById("faction").value = "Hackers"; // Reset to default
  document.getElementById("stats").value = "";
  document.getElementById("abilities").value = "";
  document.getElementById("credits").value = "";
  document.getElementById("flavorText").value = "";

  // Clear the canvas
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
