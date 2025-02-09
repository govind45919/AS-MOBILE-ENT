// Add Event Listener for Form Submission
document.getElementById("bagForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Capture Input Values
  const bagName = document.getElementById("bagName").value.trim();
  const salePrice = parseFloat(document.getElementById("salePrice").value);
  const discount = parseFloat(document.getElementById("discount").value);

  if (!bagName || isNaN(salePrice) || isNaN(discount)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // Calculate Final Income: (Sales Price ÷ 2) - Discount
  const finalIncome = (salePrice / 2) - discount;

  // Create Sale Object
  const sale = {
    date: new Date().toLocaleString(),
    bagName,
    salePrice: salePrice.toFixed(2),
    discount: discount.toFixed(2),
    finalIncome: finalIncome.toFixed(2),
  };

  // Store in Local Storage
  let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
  salesData.push(sale);
  localStorage.setItem("salesData", JSON.stringify(salesData));

  // Clear Form Fields
  document.getElementById("bagName").value = "";
  document.getElementById("salePrice").value = "";
  document.getElementById("discount").value = "";

  // Update UI
  renderLedger();
  updateStats();
});

// Render Ledger Function
function renderLedger() {
  const ledgerBody = document.getElementById("ledgerBody");
  ledgerBody.innerHTML = "";
  const salesData = JSON.parse(localStorage.getItem("salesData")) || [];

  salesData.forEach((data, index) => {
    const row = `
      <tr>
        <td>${data.date}</td>
        <td>${data.bagName}</td>
        <td>₹${data.salePrice}</td>
        <td>₹${data.discount}</td>
        <td>₹${data.finalIncome}</td>
        <td>
          <button onclick="deleteRow(${index})">Delete</button>
        </td>
      </tr>`;
    ledgerBody.innerHTML += row;
  });
}

// Update Statistics
function updateStats() {
  const salesData = JSON.parse(localStorage.getItem("salesData")) || [];
  let todayIncome = 0,
    weekIncome = 0,
    monthIncome = 0,
    yearIncome = 0;

  const now = new Date();

  salesData.forEach((data) => {
    const saleDate = new Date(data.date);
    const differenceInTime = now - saleDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 1) todayIncome += parseFloat(data.finalIncome);
    if (differenceInDays < 7) weekIncome += parseFloat(data.finalIncome);
    if (differenceInDays < 30) monthIncome += parseFloat(data.finalIncome);
    if (differenceInDays < 365) yearIncome += parseFloat(data.finalIncome);
  });

  document.getElementById("todayIncome").textContent = `₹${todayIncome.toFixed(2)}`;
  document.getElementById("weekIncome").textContent = `₹${weekIncome.toFixed(2)}`;
  document.getElementById("monthIncome").textContent = `₹${monthIncome.toFixed(2)}`;
  document.getElementById("yearIncome").textContent = `₹${yearIncome.toFixed(2)}`;
}

// Delete Row Function
function deleteRow(index) {
  let salesData = JSON.parse(localStorage.getItem("salesData")) || [];
  salesData.splice(index, 1);
  localStorage.setItem("salesData", JSON.stringify(salesData));
  renderLedger();
  updateStats();
}

// Initialize on Page Load
renderLedger();
updateStats();
