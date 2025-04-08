document.addEventListener("DOMContentLoaded", function () {
    // Initialize month and year dropdowns
    let monthDropdown = document.getElementById("month");
    let yearDropdown = document.getElementById("year");

    // Add months
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        monthDropdown.appendChild(option);
    }

    // Add years
    for (let i = 2026; i <= 2050; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearDropdown.appendChild(option);
    }
});

function showCopyNotification() {
    const notification = document.getElementById("copyNotification");
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 2000);
}

function toggleDropdown(header) {
    const card = header.parentElement;
    const details = card.querySelector('.bin-dropdown-details');
    const arrow = card.querySelector('.bin-dropdown-arrow');
    
    details.classList.toggle('show');
    arrow.classList.toggle('down');
}

// ORIGINAL CARD GENERATION FUNCTIONS ====================
function luhnCheck(num) {
    let arr = (num + '')
        .split('')
        .reverse()
        .map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
}

function generateLuhnNumber(bin) {
    let cardNumber = bin;
    while (cardNumber.length < 15) {
        cardNumber += Math.floor(Math.random() * 10);
    }

    let checkDigit = 0;
    while (true) {
        let fullCardNumber = cardNumber + checkDigit;
        if (luhnCheck(fullCardNumber)) {
            return fullCardNumber;
        }
        checkDigit++;
    }
}

function generateCards() {
    let bin = document.getElementById("bin").value.replace(/x/gi, '').slice(0, 16);
    let quantity = parseInt(document.getElementById("quantity").value) || 10;
    let ccv = document.getElementById("ccv").value;
    let result = "";

    for (let i = 0; i < quantity; i++) {
        let cardNumber = generateLuhnNumber(bin);
        let ccvValue = ccv === "" ? Math.floor(100 + Math.random() * 900) : ccv;
        let expiryMonth = document.getElementById("month").value === "Random" ? 
            String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') : 
            document.getElementById("month").value;
        let expiryYear = document.getElementById("year").value === "Random" ? 
            String(Math.floor(Math.random() * 25) + 2026) : 
            document.getElementById("year").value;

        result += `${cardNumber}|${expiryMonth}|${expiryYear}|${ccvValue}\n`;
    }

    document.getElementById("output").value = result;
}

function copyOutput() {
    let outputField = document.getElementById("output");
    outputField.select();
    document.execCommand("copy");
    showCopyNotification();
}

// Initialize click-to-copy for all copyable elements
document.querySelectorAll('.copyable, .bin-item code, .bin-detail code, .bin-dropdown-value').forEach(code => {
    code.addEventListener('click', function() {
        navigator.clipboard.writeText(this.textContent)
            .then(() => {
                showCopyNotification();
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                // Fallback for browsers that don't support navigator.clipboard
                const textarea = document.createElement('textarea');
                textarea.value = this.textContent;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showCopyNotification();
            });
    });
});
