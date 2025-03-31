function updateFileName() {
  const fileInput = document.getElementById("csvFile");
  const fileButton = document.getElementById("fileButton");
  const file = fileInput.files[0];
  const uploadIcon = document.getElementById("uploadIcon");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const csvData = event.target.result.trim();
      const items = csvData.split(",");
      const codeCount = items.length;

      
      fileButton.innerHTML = `<i class="fa-solid fa-file-csv" style="margin: 0 10px;"></i> ${file.name} (${codeCount} codes)`;

      if (fileButton.classList.contains("uploaded")) {
        return; // Skip update if a file is already uploaded
      }
      else {
        // Remove the cloud upload icon and add the file icon
      uploadIcon.classList.remove("fa-cloud-upload-alt");
      uploadIcon.classList.add("fa-file");

      // Change the button background and text to show the file name with code count
      fileButton.classList.add("uploaded");
      }
    };
    reader.readAsText(file);
  } else {
    // Reset the button appearance if no file is uploaded
    uploadIcon.classList.remove("fa-file");
    uploadIcon.classList.add("fa-cloud-upload-alt");
    fileButton.classList.remove("uploaded");
    fileButton.innerHTML = `<i class="fas fa-cloud-upload-alt" style="margin-right: 10px;"></i> Upload CSV File`;
  }
}


function splitCSV() {
  const fileInput = document.getElementById("csvFile");
  const splitInput = document.getElementById("splitCount").value.trim();

  if (!fileInput.files.length) {
    alert("Please select a CSV file first.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const csvData = event.target.result.trim();
    const items = csvData.split(",");

    if (items.length < 2) {
      alert("CSV file must have at least two items to split.");
      return;
    }

    let splitIndex;
    if (splitInput.endsWith("%")) {
      let percentage = parseFloat(splitInput);
      if (isNaN(percentage) || percentage <= 0 || percentage >= 100) {
        alert("Invalid percentage value. Please enter a percentage greater than 0% and lower than 100%.");
        return;
      }
      splitIndex = Math.floor((percentage / 100) * items.length);
    } else {
      splitIndex = parseInt(splitInput, 10);
      if (isNaN(splitIndex) || splitIndex <= 0 || splitIndex >= items.length) {
        alert("Invalid split count. Please enter a valid number. (Greater than 0 and lower than codes' total count.)");
        return;
      }
    }

    // Check if the split results in empty files
    const part1 = items.slice(0, splitIndex).join(",");
    const part2 = items.slice(splitIndex).join(",");

    if (!part1 || !part2) {
      alert("Invalid split percentage/count. Please adjust your split percentage/count.");
      return;
    }

    const baseFileName = file.name.replace(/\.[^/.]+$/, "");
    downloadCSV(part1, `${baseFileName}_part1.csv`);
    downloadCSV(part2, `${baseFileName}_part2.csv`);
  };

  reader.readAsText(file);
}

function findDuplicates() {
  const fileInput = document.getElementById("csvFile");
  if (!fileInput.files.length) {
    alert("Please upload a CSV file first.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const csvData = event.target.result.trim();
    const items = csvData.split(",");

    if (items.length < 2) {
      alert("CSV file must have at least two items to check for duplicates.");
      return;
    }

    const seen = new Set();
    const duplicates = new Set();

    items.forEach((item) => {
      if (seen.has(item)) {
        duplicates.add(item);
      } else {
        seen.add(item);
      }
    });

    const duplicateListDiv = document.getElementById("duplicateList");
    duplicateListDiv.innerHTML = "";

    if (duplicates.size === 0) {
      duplicateListDiv.innerHTML = "<p>No duplicates found.</p>";
      duplicateListDiv.style.display = "block";
      return;
    }

    duplicateListDiv.innerHTML =
      "<h3>Duplicate Entries:</h3><p>" +
      Array.from(duplicates).join(", ") +
      "</p>";
    duplicateListDiv.style.display = "block";
  };

  reader.readAsText(file);
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to navigate to home
function navigateHome() {
  window.location.href = "/QR_Codes_Tool";
}

// Function to navigate to qr
function navigateQR() {
  window.location.href = "/QR_Codes_Tool/qrgen.html";
}

// Function to refresh the page
function refreshPage() {
  location.reload();
}
