'use strict';

const MAX_HISTORY_ITEMS = 20;
const DECIMAL_PRECISION = 4;
const ERROR_CLASS_NAME = 'input-error';
const SHOW_ERROR_CLASS_NAME = 'show';

let historyList = [];

let inputNum1;
let inputNum2;
let selectOperation;
let buttonCalculate;
let divResult;
let divError;

function initCalculator() {
    inputNum1 = document.getElementById('num1');
    inputNum2 = document.getElementById('num2');
    selectOperation = document.getElementById('operation');
    buttonCalculate = document.getElementById('calculate');
    divResult = document.getElementById('result');
    divError = document.getElementById('error');
    
    if (!inputNum1 || !inputNum2 || !selectOperation || !buttonCalculate || !divResult || !divError) {
        console.error('Ошибка: не все элементы найдены в DOM');
        return;
    }
    
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
    
    historyList.forEach((item, index) => {
        const line = document.createElement('div');
        
        if (!line) {
            console.error('Ошибка: не удалось создать элемент истории');
            return;
        }
        
        line.className = 'history-item';
        line.innerHTML = item;
        
        const checkLength = index === historyList.length - 1;
        line.classList.add(checkLength ? 'latest' : 'old');
        
        divResult.appendChild(line);
    });
    
    divResult.scrollTop = divResult.scrollHeight;
}

function calculateOperation(a, b, op) {
    let result = null;
    let error = null;
    
    switch (op) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b === 0) {
                error = 'Деление на ноль запрещено';
            } else {
                result = a / b;
            }
            break;
        default:
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
    
    const raw1 = inputNum1.value;
    const raw2 = inputNum2.value;
    const operator = selectOperation.value;
    
    const val1 = cleanInput(raw1);
    const val2 = cleanInput(raw2);
    
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
    
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    
    if (isNaN(num1) || isNaN(num2)) {
        if (isNaN(num1)) {
            inputNum1.classList.add(ERROR_CLASS_NAME);
        }
        if (isNaN(num2)) {
            inputNum2.classList.add(ERROR_CLASS_NAME);
        }
        showError('Введите корректные числа');
        return;
    }
    
    const calcResult = calculateOperation(num1, num2, operator);
    
    if (calcResult.error !== null) {
        if (operator === '/' && num2 === 0) {
            inputNum2.classList.add(ERROR_CLASS_NAME);
        }
        showError(calcResult.error);
        return;
    }
    
    const formatted = formatNumber(calcResult.result);
    const expression = num1 + ' ' + operator + ' ' + num2 + ' = ' + formatted;
    
    addHistoryEntry(expression);
}

document.addEventListener('DOMContentLoaded', initCalculator);
