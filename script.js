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



  // শুধুমাত্র আপনার সাইট থেকে অ্যাক্সেস পারমিট করবে
  const allowedDomains = [
    "https://bbinl.github.io/cc-gen/",
    "https://bbinl.github.io/cc-gen", // without trailing slash
    "http://localhost:3000" // লোকাল ডেভেলপমেন্টের জন্য (যদি প্রয়োজন হয়)
  ];

  const isAllowed = allowedDomains.some(domain => 
    window.location.href.startsWith(domain)
  );

  if (!isAllowed) {
    document.body.innerHTML = `
      <div style="text-align:center; padding:50px; font-family: Arial, sans-serif;">
        <h1 style="color:red;">⚠️ অননুমোদিত অ্যাক্সেস!</h1>
        <p>এই টুল শুধুমাত্র <a href="https://bbinl.github.io/cc-gen/" style="color:#3498db;">
        অফিসিয়াল GitHub পেজ</a> থেকে ব্যবহার করুন</p>
        
        <div style="margin-top:30px; padding:20px; background:#f8f9fa; border-radius:5px;">
          <p>⛔ URL: ${window.location.href}</p>
          <p>🕒 Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
    
    // লোডিং সম্পূর্ণ বন্ধ করে দেবে
    window.stop(); 
    
    // কনসোলে ওয়ার্নিং পাঠাবে
    console.error("%cস্টপ! অননুমোদিত অ্যাক্সেস", 
      "color:red;font-size:20px;font-weight:bold;");
    console.log("এই টুল শুধুমাত্র https://bbinl.github.io/cc-gen/ থেকে এক্সেস করা যাবে");
    
    // Google Analytics বা অন্যান্য ট্র্যাকিং সার্ভিসে রিপোর্ট করতে পারেন (যদি থাকে)
    if(typeof gtag !== 'undefined') {
      gtag('event', 'blocked_access', {
        'unauthorized_url': window.location.href
      });
    }
  }
