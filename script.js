    document.addEventListener("DOMContentLoaded", function () {
    // Initialize month and year dropdowns (from original)
    let monthDropdown = document.getElementById("month");
    let yearDropdown = document.getElementById("year");

    // Add months
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i.toString().padStart(2, '0');
        option.textContent = i.toString().padStart(2, '0');
        monthDropdown.appendChild(option);
    }

    // Add years (updated range from original)
    for (let i = 2026; i <= 2050; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearDropdown.appendChild(option);
    }

    // Initialize BIN history system (from enhanced version)
    savedBins = JSON.parse(localStorage.getItem('binHistory')) || [];
    updateBinHistoryDropdown();
});

// BIN History System (from enhanced version) =============
let savedBins = [];
const binInput = document.getElementById('bin');
const binHistory = document.getElementById('binHistory');

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

function saveBinToHistory(bin) {
    if (!bin || bin.length < 6) return;
    
    savedBins = savedBins.filter(b => b !== bin);
    savedBins.push(bin);
    
    if (savedBins.length > 5) {
        savedBins = savedBins.slice(-5);
    }
    
    localStorage.setItem('binHistory', JSON.stringify(savedBins));
    updateBinHistoryDropdown();
}

function updateBinHistoryDropdown() {
    binHistory.innerHTML = '';
    
    if (savedBins.length === 0) return;
    
    savedBins.forEach(bin => {
        const item = document.createElement('div');
        item.className = 'bin-history-item';
        item.textContent = bin;
        item.addEventListener('mousedown', (e) => {
            e.preventDefault();
            binInput.value = bin;
            binHistory.style.display = 'none';
            binInput.focus();
        });
        binHistory.appendChild(item);
    });
}

// Event listeners for BIN input (from enhanced version)
binInput.addEventListener('change', () => {
    const bin = binInput.value.trim();
    if (bin.length >= 6) {
        saveBinToHistory(bin);
    }
});

binInput.addEventListener('focus', () => {
    if (savedBins.length > 0) {
        updateBinHistoryDropdown();
        binHistory.style.display = 'block';
    }
});

binInput.addEventListener('input', () => {
    if (binInput.value === '' && savedBins.length > 0) {
        updateBinHistoryDropdown();
        binHistory.style.display = 'block';
    }
});

binInput.addEventListener('blur', () => {
    setTimeout(() => {
        binHistory.style.display = 'none';
    }, 200);
});

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

// ENHANCED COPY FUNCTION (from enhanced version)
function copyOutput() {
    let outputField = document.getElementById("output");
    outputField.select();
    document.execCommand("copy");
    showCopyNotification(); // Uses the enhanced notification
}

// Initialize click-to-copy for BIN examples (from enhanced version)
document.querySelectorAll('.bin-item code, .bin-detail code, .bin-dropdown-value').forEach(code => {
    code.addEventListener('click', function() {
        navigator.clipboard.writeText(this.textContent)
            .then(() => {
                showCopyNotification();
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });
});
