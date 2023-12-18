window.addEventListener("DOMContentLoaded", () => {
  const stateSelect = document.getElementById("items"); // Updated ID for the select element

  if (stateSelect) {
    const selectedState = localStorage.getItem("selectedState");
    if (selectedState) {
      stateSelect.value = selectedState;
    }

    const stateForm = document.getElementById("stateForm");
    if (stateForm) {
      stateForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedValue = stateSelect.value;
        localStorage.setItem("selectedState", selectedValue);
        stateForm.submit();
      });
    }
  }
});
