document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('.buttons button');
    let expressionString = '';
    let isResultDisplayed = false; // New state variable

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = button.textContent;

            if (button.classList.contains('equals')) {
                if (expressionString && expressionString !== 'Error') {
                    try {
                        // Security concern: eval can be dangerous if the input string is not controlled.
                        // For a simple calculator, where input is only from buttons, it's generally acceptable.
                        // Sanitize expressionString to prevent issues with sequences like '2++3' if eval doesn't handle it well.
                        // However, standard eval should handle basic arithmetic. Let's assume valid inputs from buttons.
                        const result = eval(expressionString);
                        if (result === Infinity || result === -Infinity || isNaN(result)) {
                            expressionString = 'Error';
                        } else {
                            expressionString = result.toString();
                        }
                        isResultDisplayed = true;
                    } catch (error) {
                        expressionString = 'Error';
                        isResultDisplayed = true;
                    }
                }
            } else if (value === 'C') {
                expressionString = '';
                isResultDisplayed = false;
            } else { // Numbers, Decimal, or Operators
                if (isResultDisplayed) {
                    if (['+', '-', '*', '/'].includes(value)) {
                        // User wants to use the result in a new calculation
                        // If the current expression is "Error", and an operator is clicked,
                        // we should not append to "Error".
                        if (expressionString === 'Error') {
                            expressionString = ''; // Start fresh if previous was error
                        }
                        isResultDisplayed = false; // Continue with the current result as first operand
                    } else {
                        // User starts typing a new number after a result, so start fresh
                        expressionString = '';
                        isResultDisplayed = false;
                    }
                } else if (expressionString === 'Error') {
                    // If current expression is "Error" and it's not an operator that might clear it (handled above)
                    // or a new number input, clear it.
                    expressionString = '';
                }

                // Prevent multiple operators in a row e.g. "5++" or "5+*"
                // Or leading operators
                if (['+', '-', '*', '/'].includes(value)) {
                    if (expressionString === '' || ['+', '-', '*', '/'].includes(expressionString.slice(-1))) {
                        // Do not add operator if expression is empty or last char is already an operator
                        // Allow for negative numbers at start, e.g. "-5"
                        if (value !== '-' || expressionString !== '') {
                             // Don't append if it's not a valid start or sequence
                        } else {
                           expressionString += value;
                        }
                    } else {
                        expressionString += value;
                    }
                } else { // Numbers or decimal point
                    expressionString += value;
                }
            }
            display.value = expressionString;
        });
    });
});
