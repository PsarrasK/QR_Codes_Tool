document.addEventListener("DOMContentLoaded", () => {
  const prefixField = document.getElementById("prefix");
  const digitsCountField = document.getElementById("digits-count");
  const totalCountField = document.getElementById("total-count");
  const manualCodesInputField = document.getElementById("manual-codes");
  const generateListButton = document.getElementById("generateList");

  function lockManualCodesField() {
    manualCodesInputField.setAttribute("readonly", true); // Disable typing
    manualCodesInputField.style.opacity = "0.25";
  }

  function unlockManualCodesField() {
    manualCodesInputField.removeAttribute("readonly"); // Enable typing
    manualCodesInputField.style.opacity = "1";
  }

  function lockManualFields() {
    digitsCountField.setAttribute("readonly", true); // Disable typing
    digitsCountField.style.opacity = "0.25";
    totalCountField.setAttribute("readonly", true); // Disable typing
    totalCountField.style.opacity = "0.25";
  }

  function unlockManualFields() {
    //prefixField.removeAttribute("readonly"); // Enable typing
    digitsCountField.removeAttribute("readonly"); // Enable typing
    digitsCountField.style.opacity = "1";
    totalCountField.removeAttribute("readonly"); // Enable typing
    totalCountField.style.opacity = "1";
  }

  function enableManualCodesSelection() {
    manualCodesInputField.style.userSelect = "all"; // Allow text selection
  }

  function checkFieldsAndToggleManualCodes() {
    if (digitsCountField.value.trim() || totalCountField.value.trim()) {
      lockManualCodesField(); // Disable typing if any field has a value
    } else if (manualCodesInputField.value.trim()) {
      lockManualFields();
    } else {
      unlockManualCodesField(); // Enable typing if all fields are empty
      unlockManualFieldss();
    }
  }

  // Attach event listeners to detect changes in prefix, digits-count, or total-count
  prefixField.addEventListener("input", checkFieldsAndToggleManualCodes);
  digitsCountField.addEventListener("input", checkFieldsAndToggleManualCodes);
  totalCountField.addEventListener("input", checkFieldsAndToggleManualCodes);
  manualCodesInputField.addEventListener(
    "input",
    checkFieldsAndToggleManualCodes
  );

  // Ensure the manual-codes field is selectable
  manualCodesInputField.addEventListener("focus", enableManualCodesSelection);
});

function generateMultipleQRCodes() {
  const prefixField = document.getElementById("prefix");
  const manualCodesInputField = document.getElementById("manual-codes");
  const digitsCountField = document.getElementById("digits-count");
  const totalCountField = document.getElementById("total-count");
  const generateListButton = document.getElementById("generateList");
  const printLogoInputField = document.getElementById("qrPrintLogo");
  const printColorInputField = document.getElementById(
    "color-picker-container"
  );

  let manualCodes = [];
  const prefix = prefixField.value.trim(); // Get the prefix value

  if (manualCodesInputField.value.trim()) {
    // Manual method
    manualCodes = manualCodesInputField.value
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean);

    // Apply the prefix to each code
    manualCodes = manualCodes.map((code) => `${prefix}${code}`);
    console.log("Generated QR codes: ", manualCodes);

    // Update the manual-codes input field with the modified codes
    manualCodesInputField.value = manualCodes.join(","); // Update the field with prefixed codes
  } else {
    // Auto generation method
    const digitsCount = parseInt(digitsCountField.value.trim(), 10);
    const totalCount = parseInt(totalCountField.value.trim(), 10);

    if (isNaN(digitsCount) || isNaN(totalCount)) {
      alert(
        "Please provide valid digits count and total count to generate numbers."
      );
      return;
    }

    manualCodes = generateNumbers(digitsCount, totalCount, prefix);
    manualCodesInputField.value = manualCodes.join(","); // Update the field with generated numbers
  }

  // Clear and hide fields
  //digitsCountField.value = "";
  //totalCountField.value = "";
  //prefixField.value = "";

  digitsCountField.setAttribute("readonly", true); // Disable typing
  digitsCountField.style.backgroundColor = "lightgray";
  digitsCountField.style.cursor = "not-allowed";
  //digitsCountField.style.display = "none";
  totalCountField.setAttribute("readonly", true); // Disable typing
  totalCountField.style.backgroundColor = "lightgray";
  totalCountField.style.cursor = "not-allowed";
  //totalCountField.style.display = "none";
  prefixField.setAttribute("readonly", true); // Disable typing
  prefixField.style.backgroundColor = "lightgray";
  prefixField.style.cursor = "not-allowed";
  //prefixField.style.display = "none";
  manualCodesInputField.setAttribute("readonly", true); // Disable typing
  manualCodesInputField.style.opacity = "1";
  manualCodesInputField.style.backgroundColor = "lightgray";
  generateListButton.style.display = "none";
  document.getElementById("export-csv-button").disabled = false;
}

function generateNumbers(digitsCount, totalCount, prefix) {
  const numbers = new Set();

  while (numbers.size < totalCount) {
    let number = prefix + generateRandomNumber(digitsCount);
    numbers.add(number); // Add the number to the set (ensures uniqueness)
  }

  return Array.from(numbers);
}

function generateRandomNumber(digitsCount) {
  let number = "";
  for (let i = 0; i < digitsCount; i++) {
    number += Math.floor(Math.random() * 10); // Add a random digit (0-9)
  }
  return number;
}

function exportCodesAsCSV() {
  const manualCodesInputField = document.getElementById("manual-codes");

  if (!manualCodesInputField.value.trim()) {
    alert("No codes available to export!");
    return;
  }

  const manualCodes = manualCodesInputField.value
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
  const csvContent = manualCodes.join(","); // Join values with commas

  const blob = new Blob([csvContent], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "qr_codes.csv";
  downloadLink.click();
}

function dataURLtoBlob(dataURL) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
}

// Function to navigate to home
function navigateHome() {
  window.location.href = "/QR_Codes_Tool";
}

// Function to refresh the page
function refreshPage() {
  location.reload();
}
