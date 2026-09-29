document.addEventListener("DOMContentLoaded", () => {
  const maritalRadios = document.querySelectorAll('input[name="maritalStatus"]');
  const dependentsCard = document.getElementById("dependentsCard");
  
  const addSpouseBtn = document.getElementById("addSpouseBtn");
  const spouseContainer = document.getElementById("spouseContainer");
  
  const addChildBtn = document.getElementById("addChildBtn");
  const kidsContainer = document.getElementById("kidsContainer");
  const noKidsText = document.getElementById("noKidsText");
  
  const bioForm = document.getElementById("bioForm");

  // --- CNIC / B-Form Auto Format & Numeric Validation (XXXXX-XXXXXXX-X) ---
  function applyCnicValidation(inputElement) {
    if (!inputElement) return;

    inputElement.addEventListener("input", (e) => {
      // 1. Non-digits ko remove karein (Sirf 0-9 allowed)
      let value = e.target.value.replace(/\D/g, "");
      
      // 2. Maximum 13 numeric digits tak limit karein
      if (value.length > 13) {
        value = value.slice(0, 13);
      }
      
      // 3. XXXXX-XXXXXXX-X format me auto-hyphens add karein
      let formattedValue = "";
      if (value.length > 0) {
        if (value.length <= 5) {
          formattedValue = value;
        } else if (value.length <= 12) {
          formattedValue = value.slice(0, 5) + "-" + value.slice(5);
        } else {
          formattedValue = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12);
        }
      }

      e.target.value = formattedValue;
    });
  }

  // Primary Employee CNIC Input par validation apply karna
  const primaryCnicInput = document.getElementById("cnic");
  applyCnicValidation(primaryCnicInput);

  // Toggle Dependents Visibility
  function updateDependentsVisibility() {
    const selectedStatus = document.querySelector('input[name="maritalStatus"]:checked').value;
    if (selectedStatus === "Married") {
      dependentsCard.classList.remove("hidden");
    } else {
      dependentsCard.classList.add("hidden");
    }
  }

  maritalRadios.forEach((radio) => {
    radio.addEventListener("change", updateDependentsVisibility);
  });

  // Create Spouse Row
  function createSpouseRow() {
    const row = document.createElement("div");
    row.className = "row-flex spouse-row";

    row.innerHTML = `
      <div class="form-group flex-1">
        <label>Spouse Name</label>
        <input type="text" class="spouse-name" placeholder="Full name of spouse">
      </div>
      <div class="form-group flex-1">
        <label>Spouse CNIC</label>
        <input type="text" class="spouse-cnic" placeholder="XXXXX-XXXXXXX-X">
      </div>
      <div class="form-group flex-1">
        <label>Spouse DOB</label>
        <input type="date" class="spouse-dob">
      </div>
      <div class="action-col">
        <button type="button" class="btn-delete" title="Remove Spouse">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    // Dynamic Spouse CNIC par validation attach karna
    const spouseCnicInput = row.querySelector(".spouse-cnic");
    applyCnicValidation(spouseCnicInput);

    return row;
  }

  // Create Child Row
  function createKidRow() {
    const row = document.createElement("div");
    row.className = "row-flex kid-row";

    row.innerHTML = `
      <div class="form-group flex-1">
        <label>Child Name</label>
        <input type="text" class="child-name" placeholder="Full name">
      </div>
      <div class="form-group flex-1">
        <label>B-Form Number</label>
        <input type="text" class="child-bform" placeholder="XXXXX-XXXXXXX-X">
      </div>
      <div class="form-group flex-1">
        <label>DOB</label>
        <input type="date" class="child-dob">
      </div>
      <div class="action-col">
        <button type="button" class="btn-delete" title="Remove Child">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    // Dynamic Child B-Form (CNIC) par validation attach karna
    const childBformInput = row.querySelector(".child-bform");
    applyCnicValidation(childBformInput);

    return row;
  }

  // Check and update empty state for kids
  function updateKidsEmptyState() {
    const kidRows = kidsContainer.querySelectorAll(".kid-row");
    if (kidRows.length === 0) {
      noKidsText.classList.remove("hidden");
    } else {
      noKidsText.classList.add("hidden");
    }
  }

  // Initial Existing Rows par validation apply karna
  document.querySelectorAll(".spouse-cnic").forEach(applyCnicValidation);
  document.querySelectorAll(".child-bform").forEach(applyCnicValidation);

  // Add Spouse
  addSpouseBtn.addEventListener("click", () => {
    spouseContainer.appendChild(createSpouseRow());
  });

  // Remove Spouse
  spouseContainer.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".btn-delete");
    if (deleteBtn) {
      const rowToDelete = deleteBtn.closest(".spouse-row");
      if (spouseContainer.querySelectorAll(".spouse-row").length > 1) {
        rowToDelete.remove();
      } else {
        alert("At least one spouse row must remain.");
      }
    }
  });

  // Add Child
  addChildBtn.addEventListener("click", () => {
    kidsContainer.appendChild(createKidRow());
    updateKidsEmptyState();
  });

  // Remove Child
  kidsContainer.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".btn-delete");
    if (deleteBtn) {
      const rowToDelete = deleteBtn.closest(".kid-row");
      rowToDelete.remove();
      updateKidsEmptyState();
    }
  });

  // Form Reset
  bioForm.addEventListener("reset", () => {
    setTimeout(() => {
      updateDependentsVisibility();
      updateKidsEmptyState();
    }, 10);
  });

  // Form Submit
  bioForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Employee Bio Details Saved Successfully!");
  });

  // Initial Checks
  updateDependentsVisibility();
  updateKidsEmptyState();
});

document.addEventListener("DOMContentLoaded", () => {
  const cellInput = document.getElementById("cellNo");
  const empIdInput = document.getElementById("empId");

  // 1. Contact Number Auto-formatting (03XX-XXXXXXX)
  cellInput.addEventListener("input", (e) => {
    // Only extract digits
    let digits = e.target.value.replace(/\D/g, "");

    // Limit to 11 digits max (Pakistan phone format)
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }

    // Auto format 03XX-XXXXXXX
    if (digits.length > 4) {
      e.target.value = `${digits.substring(0, 4)}-${digits.substring(4)}`;
    } else {
      e.target.value = digits;
    }
  });

  // 2. Employee ID Restriction (Forces 'EMP-' prefix + Numbers only)
document.addEventListener("DOMContentLoaded", () => {
  const empIdInput = document.getElementById("empId");

  if (empIdInput) {
    empIdInput.addEventListener("input", (e) => {
      // Numbers ke ilawa sab characters instantly remove kar dega
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }
});

    // Extract numeric part after EMP-
    const numberPart = value.substring(4).replace(/\D/g, "");

    e.target.value = "EMP-" + numberPart;
  });

  // Prevent user from deleting the 'EMP-' prefix easily via backspace
  empIdInput.addEventListener("keydown", (e) => {
    if (e.target.selectionStart <= 4 && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
    }
  });


document.addEventListener("DOMContentLoaded", () => {
  const cellInput = document.getElementById("cellNo");
  const empIdInput = document.getElementById("empId");

  // 1. Cell Number Auto-formatting (03XX-XXXXXXX) - Numbers Only
  cellInput.addEventListener("input", (e) => {
    // Sirf digits filter karein
    let digits = e.target.value.replace(/\D/g, "");

    // Max 11 digits restrict karein
    if (digits.length > 11) {
      digits = digits.substring(0, 11);
    }

    // Auto format 03XX-XXXXXXX
    if (digits.length > 4) {
      e.target.value = `${digits.substring(0, 4)}-${digits.substring(4)}`;
    } else {
      e.target.value = digits;
    }
  });

  // 2. Employee ID Restriction - Strictly Numbers Only
  empIdInput.addEventListener("input", (e) => {
    // Sirf digits filter karein (no alphabets or special characters)
    e.target.value = e.target.value.replace(/\D/g, "");
  });
});

// Apni Apps Script ka NAYA URL yahan paste karein
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGXW_VvCNJgU2xf0lezQXN-twv-8ctgp4tEUyIQu3kjpXjFV34BVNqt0Dw1t1fVYwwWQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  const cellInput = document.getElementById("cellNo");
  const empIdInput = document.getElementById("empId");
  const bioForm = document.getElementById("bioForm");

  // Phone number numeric formatting
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

  // Employee ID numeric constraint
  if (empIdInput) {
    empIdInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }

  // Submit Handler
  if (bioForm) {
    bioForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const spouses = [];
      document.querySelectorAll(".spouse-row").forEach(row => {
        const name = row.querySelector(".spouse-name")?.value.trim() || "";
        const cnic = row.querySelector(".spouse-cnic")?.value.trim() || "";
        const dob = row.querySelector(".spouse-dob")?.value || "";
        if (name || cnic) spouses.push({ name, cnic, dob });
      });

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
        submitBtn.innerText = "Saving Data...";
      }

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(() => {
        alert("Form successfully submit ho gaya hai!");
        bioForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit & Save";
        }
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert("Data save hone me masla hua.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit & Save";
        }
      });
    });
  }
});
