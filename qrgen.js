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
  const printLogoInputField = document.getElementById("qrPrintLogoUrl");
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
  digitsCountField.value = "";
  totalCountField.value = "";
  prefixField.value = "";

  digitsCountField.setAttribute("readonly", true); // Disable typing
  digitsCountField.style.display = "none";
  totalCountField.setAttribute("readonly", true); // Disable typing
  totalCountField.style.display = "none";
  prefixField.setAttribute("readonly", true); // Disable typing
  prefixField.style.display = "none";
  manualCodesInputField.setAttribute("readonly", true); // Disable typing
  manualCodesInputField.style.opacity = "1";
  manualCodesInputField.style.backgroundColor = "lightgray";
  generateListButton.style.display = "none";
  document.getElementById("export-csv-button").disabled = false;
  printLogoInputField.style.display = "none";
  printColorInputField.style.display = "none";

  // Clear the QR container
  const qrContainer = document.getElementById("qr-container");
  const qrPrintLogoUrl = document.getElementById("qrPrintLogoUrl");
  qrContainer.innerHTML = "";

  const qrSize = 200;

  manualCodes.forEach((csvCode, index) => {
    QRCode.toDataURL(
      csvCode,
      { width: qrSize, margin: 1 },
      function (err, url) {
        if (err) {
          console.error(err);
          alert("Error generating QR code!");
          return;
        }

        const qrCodeDiv = document.createElement("div");
        qrCodeDiv.classList.add("qr-code-item");
        qrCodeDiv.id = `qr_print_${index + 1}`;

        const qrImage = new Image();
        qrImage.src = url;
        qrImage.classList.add("qr-code");
        qrImage.style.maxWidth = "100%";
        qrImage.width = qrSize;

        qrCodeDiv.appendChild(qrImage);

        if (qrPrintLogoUrl.value) {
          const qrLogo = new Image();
          qrLogo.classList.add("qr-logo");
          qrLogo.src = qrPrintLogoUrl.value;

          qrCodeDiv.appendChild(qrLogo);
        } else {
          const demoWrapper = document.createElement("div");
          demoWrapper.classList.add("qr-demo-wrapper");

          const qrText = document.createElement("div");
          qrText.classList.add("qr-text-content");
          qrText.innerText = csvCode;

          const serialNumberDiv = document.createElement("div");
          serialNumberDiv.classList.add("qr-serial-number");
          serialNumberDiv.innerText = index + 1;

          // Append qr-text and serial-number to the wrapper div
          demoWrapper.appendChild(qrText);
          demoWrapper.appendChild(serialNumberDiv);

          // Append the wrapper div to the QR code container
          qrCodeDiv.appendChild(demoWrapper);
        }

        qrContainer.appendChild(qrCodeDiv);
      }
    );
  });

  document.getElementById("export-button").disabled = false;
  document.getElementById("copy-button").disabled = false;
  changeColor();
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

function exportQRCodeAsCSV() {
  const manualCodesInputField = document.getElementById("manual-codes");

  if (!manualCodesInputField.value.trim()) {
    alert("No QR codes available to export!");
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

function exportQRCodeAsImage() {
  const qrContainer = document.getElementById("qr-container");

  if (!qrContainer.hasChildNodes()) {
    alert("Please generate QR codes first!");
    return;
  }

  html2canvas(qrContainer, {
    backgroundColor: null,
  })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png"); // Convert canvas to image
      const downloadLink = document.createElement("a"); // Create a download link
      downloadLink.href = imgData;
      downloadLink.download = "qr-codes.png";
      downloadLink.click();
    })
    .catch((error) => {
      console.error("Error exporting QR codes as image:", error);
      alert("Failed to export QR codes as an image.");
    });
}

function copyQRCodeToClipboard() {
  const qrContainer = document.getElementById("qr-container");

  if (!qrContainer.hasChildNodes()) {
    alert("Please generate QR codes first!");
    return;
  }

  html2canvas(qrContainer, {
    backgroundColor: null,
  })
    .then((canvas) => {
      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => {
            alert("QR codes copied to clipboard!");
          })
          .catch((err) => {
            console.error("Clipboard error:", err);
            alert("Failed to copy QR codes to clipboard.");
          });
      });
    })
    .catch((error) => {
      console.error("Error copying QR codes to clipboard:", error);
      alert("Failed to copy QR codes to clipboard.");
    });
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

document.addEventListener("DOMContentLoaded", () => {
  const savedColor = localStorage.getItem("qrPrintColor");
  const colorPicker = document.getElementById("color-picker");
  const qrContainer = document.getElementById("qr-container");

  const savedLogo = localStorage.getItem("qrPrintLogo");
  const qrLogo = document.getElementById("qrPrintLogoUrl");

  if (savedColor) {
    colorPicker.value = savedColor;
  }

  if (savedLogo) {
    qrPrintLogoUrl.value = savedLogo;
  }

  qrPrintLogoUrl?.addEventListener("input", () => {
    if (qrPrintLogoUrl.value.trim()) {
      localStorage.setItem("qrPrintLogo", qrPrintLogoUrl.value);
    }
  });
});

function changeColor() {
  const colorPicker = document.getElementById("color-picker");

  const selectedColor = colorPicker.value;

  // Select all elements with id starting with 'qr_print_'
  const qrPrintElements = document.querySelectorAll("[id^='qr_print_']");

  const luminance = getLuminance(selectedColor);
  const newTextColor = luminance < 0.5 ? "white" : "#1a1a1a";

  // Loop through all elements with id starting with 'qr_print_'
  qrPrintElements.forEach((element) => {
    // Change background color of qr_print_ elements
    element.style.backgroundColor = selectedColor;

    // Change text color for child elements
    const qrTextElements = element.querySelectorAll(".qr-text");
    const serialNumberElements = element.querySelectorAll(".serial-number");

    qrTextElements.forEach((textElement) => {
      textElement.style.color = newTextColor;
    });

    serialNumberElements.forEach((serialElement) => {
      serialElement.style.color = newTextColor;
    });
  });

  localStorage.setItem("qrPrintColor", selectedColor);
}

function getLuminance(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = r / 255;
  g = g / 255;
  b = b / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Function to navigate to home
function navigateSplit() {
  window.location.href = "/QR_Codes_Tool/csvsplit.html";
}

// Function to refresh the page
function refreshPage() {
  location.reload();
}
