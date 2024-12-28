document.getElementById("generateCard").addEventListener("click", generateCard);
document.getElementById("downloadCard").addEventListener("click", downloadCard);

function generateCard() {
  const canvas = document.getElementById("cardCanvas");
  const ctx = canvas.getContext("2d");

  // Get input values
  const name = document.getElementById("name").value;
  const cardType = document.getElementById("cardType").value;
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

  // Fonts
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";

  // Name
  ctx.font = "bold 36px Arial";
  ctx.fillText(name, canvas.width / 2, 50);

  // Abilities
  ctx.textAlign = "left";
  ctx.font = "18px Arial";
  wrapText(ctx, abilities, 30, 650, canvas.width - 60, 24);

  // Flavor Text
  ctx.font = "italic 16px Arial";
  wrapText(ctx, flavorText, 30, canvas.height - 200, canvas.width - 60, 20);

  // Credits (Far Left, 24px)
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  ctx.fillText(credits + "c", 30, canvas.height - 20);

  // Stats (Far Right, 24px)
  ctx.textAlign = "right";
  ctx.fillText(stats, canvas.width - 30, canvas.height - 20);

  // Card Type (Centered Bottom)
  ctx.textAlign = "center";
  ctx.font = "24px Arial";
  ctx.fillText(cardType, canvas.width / 2, canvas.height - 20);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
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

  // Get input values
  const name = document.getElementById("name").value;
  const cardType = document.getElementById("cardType").value;
  const stats = document.getElementById("stats").value;
  const abilities = document.getElementById("abilities").value;
  const credits = document.getElementById("credits").value;
  const flavorText = document.getElementById("flavorText").value;

  // Download the image
  const imageLink = document.createElement("a");
  imageLink.download = `${name || "card"}.png`;
  imageLink.href = canvas.toDataURL("image/png");
  imageLink.click();

  // Generate the card details as a .txt file
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
  textLink.download = `${name || "card"}.txt`;
  textLink.href = URL.createObjectURL(textBlob);
  textLink.click();
}
