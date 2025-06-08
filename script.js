document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('.buttons button');
    let currentInput = '';
    let operator = '';
    let firstOperand = '';
    let shouldResetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = button.textContent;

            if (button.classList.contains('equals')) {
                if (operator && firstOperand !== '' && currentInput !== '') {
                    currentInput = calculate(firstOperand, currentInput, operator);
                    display.value = currentInput;
                    operator = '';
                    firstOperand = '';
                    shouldResetDisplay = true;
                }
            } else if (value === 'C') {
                currentInput = '';
                operator = '';
                firstOperand = '';
                display.value = '';
            } else if (['+', '-', '*', '/'].includes(value)) {
                if (currentInput !== '') {
                    if (firstOperand === '') {
                        firstOperand = currentInput;
                        operator = value;
                        shouldResetDisplay = true;
                    } else {
                        // Allow chaining operations
                        firstOperand = calculate(firstOperand, currentInput, operator);
                        display.value = firstOperand; // Show intermediate result
                        operator = value;
                        currentInput = ''; // Ready for next operand
                        shouldResetDisplay = true;
                    }
                }
            } else { // Number or decimal point
                if (shouldResetDisplay) {
                    currentInput = '';
                    shouldResetDisplay = false;
                }
                currentInput += value;
                display.value = currentInput;
            }
        });
    });

    function calculate(num1, num2, op) {
        const n1 = parseFloat(num1);
        const n2 = parseFloat(num2);
        let result;

        switch (op) {
            case '+':
                result = n1 + n2;
                break;
            case '-':
                result = n1 - n2;
                break;
            case '*':
                result = n1 * n2;
                break;
            case '/':
                if (n2 === 0) {
                    return 'Error'; // Handle division by zero
                }
                result = n1 / n2;
                break;
            default:
                return num2; // Should not happen
        }
        return result.toString();
    }
});
