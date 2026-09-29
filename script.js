// Yahan Step 2 wala copied Web App URL paste karein
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxnpU-kYiWbVWkf4dDYNwCsitwypqQMcHO5ZVBMKGCD0nwnjkykhR61MTiVFC1Xeo_c/exec";

document.addEventListener("DOMContentLoaded", () => {
  const cellInput = document.getElementById("cellNo");
  const empIdInput = document.getElementById("empId");
  const bioForm = document.getElementById("bioForm");

  // 1. Phone number formatting (03XX-XXXXXXX)
  if (cellInput) {
    cellInput.addEventListener("input", (e) => {
      let digits = e.target.value.replace(/\D/g, "");
      if (digits.length > 11) digits = digits.substring(0, 11);
      if (digits.length > 4) {
        e.target.value = `${digits.substring(0, 4)}-${digits.substring(4)}`;
      } else {
        e.target.value = digits;
      }
    });
  }

  // 2. Employee ID restrict to numbers only
  if (empIdInput) {
    empIdInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }

  // 3. Form Submit Handler
  if (bioForm) {
    bioForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Collect Spouses
      const spouses = [];
      document.querySelectorAll(".spouse-row").forEach(row => {
        const name = row.querySelector(".spouse-name")?.value.trim() || "";
        const cnic = row.querySelector(".spouse-cnic")?.value.trim() || "";
        const dob = row.querySelector(".spouse-dob")?.value || "";
        if (name || cnic) spouses.push({ name, cnic, dob });
      });

      // Collect Kids
      const kids = [];
      document.querySelectorAll(".kid-row").forEach(row => {
        const name = row.querySelector(".child-name")?.value.trim() || "";
        const bform = row.querySelector(".child-bform")?.value.trim() || "";
        const dob = row.querySelector(".child-dob")?.value || "";
        if (name || bform) kids.push({ name, bform, dob });
      });

      const formData = {
        unitName: document.getElementById("unitName")?.value || "",
        empId: document.getElementById("empId")?.value || "",
        fullName: document.getElementById("fullName")?.value || "",
        cellNo: document.getElementById("cellNo")?.value || "",
        dob: document.getElementById("dob")?.value || "",
        cnic: document.getElementById("cnic")?.value || "",
        maritalStatus: document.querySelector('input[name="maritalStatus"]:checked')?.value || "Single",
        dependents: {
          spouses: spouses,
          kids: kids
        }
      };

      const submitBtn = bioForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";
      }

      // Send data to Apps Script
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(() => {
        alert("Data successfully Google Sheet me save ho gaya hai!");
        bioForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit & Save";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Data save hone me masla hua. Console check karein.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit & Save";
        }
      });
    });
  }
});
