// ---------------------------------------------
// Elements
// ---------------------------------------------
const expressionEl = document.getElementById("expression");
const historyEl = document.getElementById("history");
const keys = document.querySelectorAll(".key");

// ---------------------------------------------
// State
// ---------------------------------------------
let currentExpression = "";
let historyExpression = "";
let justEvaluated = false;

// ---------------------------------------------
// Rendering
// ---------------------------------------------
function render() {
  expressionEl.classList.remove("is-error");
  expressionEl.textContent = currentExpression || "0";
  historyEl.textContent = historyExpression;
  
  // Auto-scroll to the right as expression gets longer
  expressionEl.scrollLeft = expressionEl.scrollWidth;
}

function renderError(message = "Error") {
  expressionEl.classList.add("is-error");
  expressionEl.textContent = message;
}

// ---------------------------------------------
// Input Handlers
// ---------------------------------------------
function handleInput(val) {
  const operators = ["+", "−", "×", "÷"];

  if (justEvaluated) {
    if (operators.includes(val)) {
      currentExpression = (currentExpression === "Error" || currentExpression === "NaN") ? "0" : currentExpression;
    } else {
      currentExpression = "";
    }
    historyExpression = "";
    justEvaluated = false;
  }
  
  // Prevent consecutive operators by replacing the last one
  if (operators.includes(val)) {
    const lastChar = currentExpression.slice(-1);
    if (operators.includes(lastChar)) {
      currentExpression = currentExpression.slice(0, -1) + val;
      render();
      return; 
    }
  }

  // Prevent leading multiple zeros
  if (currentExpression === "0" && val !== "." && !operators.includes(val)) {
    currentExpression = val;
  } else {
    currentExpression += val;
  }
  render();
}

function clearAll() {
  currentExpression = "";
  historyExpression = "";
  justEvaluated = false;
  render();
}

function backspace() {
  if (justEvaluated) {
    historyExpression = "";
    justEvaluated = false;
  }
  
  if (currentExpression === "Error" || currentExpression === "NaN" || currentExpression === "Infinity") {
    currentExpression = "";
  } else {
    currentExpression = currentExpression.toString().slice(0, -1);
  }
  render();
}

function calculate() {
  if (!currentExpression) return;

  historyExpression = currentExpression + " =";
  
  // Sanitize and format for JS evaluation
  let toEval = currentExpression
    .replace(/×/g, '*')
    .replace(/−/g, '-')
    .replace(/÷/g, '/');

  // Handle implicit multiplication: 2(3) -> 2*(3), (2)(3) -> (2)*(3)
  toEval = toEval.replace(/(\d)\(/g, '$1*(');
  toEval = toEval.replace(/\)(\d)/g, ')*$1');
  toEval = toEval.replace(/\)\(/g, ')*(');

  try {
    if (/[^0-9+\-*/().\s]/.test(toEval)) throw new Error("Invalid format");
    
    const result = new Function('return ' + toEval)();
    
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      if (toEval.includes('/0')) {
        currentExpression = "Error";
        renderError("Div by zero");
      } else {
        currentExpression = "Error";
        renderError();
      }
    } else {
      currentExpression = String(Math.round((result + Number.EPSILON) * 1e10) / 1e10);
      render();
    }
  } catch (e) {
    currentExpression = "Error";
    renderError("Bad format");
  }
  
  justEvaluated = true;
}

// ---------------------------------------------
// Event Listeners (Mouse & Touch)
// ---------------------------------------------
keys.forEach((key) => {
  key.addEventListener("click", () => {
    flashKey(key);

    const { val, action } = key.dataset;

    if (val !== undefined) return handleInput(val);

    switch (action) {
      case "clear": return clearAll();
      case "backspace": return backspace();
      case "equals": return calculate();
    }
  });
});

function flashKey(key) {
  key.classList.add("is-pressed");
  setTimeout(() => key.classList.remove("is-pressed"), 150);
}

// ---------------------------------------------
// Keyboard Support
// ---------------------------------------------
const keyMap = { 
  "*": "×", 
  "/": "÷", 
  "-": "−" 
};

document.addEventListener("keydown", (e) => {
  const { key } = e;

  if (/^[0-9()\.]$/.test(key)) return handleInput(key);
  if (["+", "-", "*", "/"].includes(key)) return handleInput(keyMap[key] || key);
  if (key === "Enter" || key === "=") { e.preventDefault(); return calculate(); }
  if (key === "Backspace") return backspace();
  if (key === "Escape") return clearAll();
});

// Initialize Display
render();