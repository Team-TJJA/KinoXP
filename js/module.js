function fillDropdown(dropdownElement, optionsArray) {
    // Fjern eksisterende indhold i dropdown
    dropdownElement.innerHTML = '';

    // Iterer gennem optionsArray og tilføj hvert element som en option i dropdown
    optionsArray.forEach((optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.text = optionText;
        dropdownElement.appendChild(option);
    }))
}

export {fillDropdown}