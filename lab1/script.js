var MAX_HISTORY_ITEMS = 20;
var DECIMAL_PRECISION = 4;
var ERROR_CLASS_NAME = 'input-error';
var SHOW_ERROR_CLASS_NAME = 'show';

var historyList = [];

var inputNum1;
var inputNum2;
var selectOperation;
var buttonCalculate;
var divResult;
var divError;

function initCalculator() {
    inputNum1 = document.getElementById('num1');
    inputNum2 = document.getElementById('num2');
    selectOperation = document.getElementById('operation');
    buttonCalculate = document.getElementById('calculate');
    divResult = document.getElementById('result');
    divError = document.getElementById('error');
    
    setupEventListeners();
    
    console.log('Калькулятор готов к работе');
}

function setupEventListeners() {
    buttonCalculate.addEventListener('click', onCalculateClick);

    inputNum1.addEventListener('input', onInputChanged);
    inputNum2.addEventListener('input', onInputChanged);

    inputNum1.addEventListener('keypress', onKeyPress);
    inputNum2.addEventListener('keypress', onKeyPress);
}


function onCalculateClick() {
    calculateResult();
}

function onInputChanged(event) {
    if (event.target.classList.contains(ERROR_CLASS_NAME)) {
        event.target.classList.remove(ERROR_CLASS_NAME);
        hideErrorMessage();
    }
}

function onKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateResult();
    }
}


function isNumericString(value) {
    var cleaned = value.replace(',', '.').trim();
    
    if (cleaned === '') {
        return false;
    }
    
    var number = parseFloat(cleaned);
    return !isNaN(number) && isFinite(number);
}


function cleanInput(raw) {
    return raw.replace(',', '.').trim();
}


function showError(message) {
    divError.innerHTML = message;
    divError.classList.add(SHOW_ERROR_CLASS_NAME);
    divResult.innerHTML = '';
}


function hideErrorMessage() {
    divError.classList.remove(SHOW_ERROR_CLASS_NAME);
    divError.innerHTML = '';
}


function clearInputErrors() {
    inputNum1.classList.remove(ERROR_CLASS_NAME);
    inputNum2.classList.remove(ERROR_CLASS_NAME);
}


function addHistoryEntry(text) {
    historyList.push(text);
    
    if (historyList.length > MAX_HISTORY_ITEMS) {
        historyList.shift();
    }
    
    drawHistory();
}


function drawHistory() {
    divResult.innerHTML = '';
    
    for (var i = 0; i < historyList.length; i++) {
        var item = historyList[i];
        var line = document.createElement('div');
        
        line.className = 'history-item';
        line.innerHTML = item;
        
        if (i === historyList.length - 1) {
            line.classList.add('latest');
        } else {
            line.classList.add('old');
        }
        
        divResult.appendChild(line);
    }
    
    divResult.scrollTop = divResult.scrollHeight;
}


function doMath(a, b, op) {
    var result = null;
    var error = null;
    
    if (op === '+') {
        result = a + b;
    } else if (op === '-') {
        result = a - b;
    } else if (op === '*') {
        result = a * b;
    } else if (op === '/') {
        if (b === 0) {
            error = 'Деление на ноль запрещено';
        } else {
            result = a / b;
        }
    } else {
        error = 'Неизвестная операция';
    }
    
    return {
        result: result,
        error: error
    };
}


function formatNumber(value) {
    if (value === Math.floor(value)) {
        return value;
    }
    return parseFloat(value.toFixed(DECIMAL_PRECISION));
}


function calculateResult() {
    clearInputErrors();
    hideErrorMessage();
    
    var raw1 = inputNum1.value;
    var raw2 = inputNum2.value;
    var operator = selectOperation.value;
    
    var val1 = cleanInput(raw1);
    var val2 = cleanInput(raw2);
    
    if (val1 === '' || val2 === '') {
        if (val1 === '') {
            inputNum1.classList.add(ERROR_CLASS_NAME);
        }
        if (val2 === '') {
            inputNum2.classList.add(ERROR_CLASS_NAME);
        }
        showError('Заполните оба поля');
        return;
    }
    
    if (!isNumericString(raw1) || !isNumericString(raw2)) {
        if (!isNumericString(raw1)) {
            inputNum1.classList.add(ERROR_CLASS_NAME);
        }
        if (!isNumericString(raw2)) {
            inputNum2.classList.add(ERROR_CLASS_NAME);
        }
        showError('Введите корректные числа');
        return;
    }
    
    var num1 = parseFloat(val1);
    var num2 = parseFloat(val2);
    var calcResult = doMath(num1, num2, operator);
    
    if (calcResult.error !== null) {
        if (operator === '/' && num2 === 0) {
            inputNum2.classList.add(ERROR_CLASS_NAME);
        }
        showError(calcResult.error);
        return;
    }
    
    var formatted = formatNumber(calcResult.result);
    var expression = num1 + ' ' + operator + ' ' + num2 + ' = ' + formatted;
    
    addHistoryEntry(expression);
}

document.addEventListener('DOMContentLoaded', initCalculator);
