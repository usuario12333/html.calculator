document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('.buttons button');
    let expressionString = '';
    let isResultDisplayed = false;

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const value = button.textContent;

            if (button.classList.contains('equals')) {
                if (expressionString && expressionString !== 'Error') {
                    try {
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
            } else if (value === '<') { // Updated from ⌫
                if (!isResultDisplayed && expressionString !== 'Error' && expressionString.length > 0) {
                    expressionString = expressionString.slice(0, -1);
                }
            } else { // For numbers, operators (including %), parentheses, and x⁰
                let actualValueToAppend = value;
                if (value === 'x⁰') { // Updated from X⁰
                    actualValueToAppend = '**';
                }
                // No special change needed for '%' for actualValueToAppend, as it's already '%'

                if (isResultDisplayed) {
                    // Check if it's an operator type, including '%' and '**'
                    if (['+', '-', '*', '/', '**', '%'].includes(actualValueToAppend)) {
                        // If previous was 'Error' and now an operator, clear 'Error' before proceeding
                        if (expressionString === 'Error') {
                            expressionString = '';
                        }
                        isResultDisplayed = false; // Continue with current result (or cleared error)
                    } else { // Number or Parenthesis
                        expressionString = ''; // Start a new expression
                        isResultDisplayed = false;
                    }
                }

                // If the expression was 'Error' (and not handled by isResultDisplayed logic above),
                // any valid input should clear it first.
                if (expressionString === 'Error') {
                    expressionString = '';
                }

                // Basic operator sequencing logic (optional, eval will catch errors anyway)
                // This is a simplified version of the previous attempts to prevent multiple operators.
                // Allows a leading minus. Prevents other operators if string is empty or last char is operator.
                // Allows '**' if last char is not an operator.
                if (['+', '*', '/', '**', '%'].includes(actualValueToAppend)) { // Operators that cannot be leading (except if part of a number like -5)
                    if (expressionString === '' || ['+', '-', '*', '/', '%', '('].includes(expressionString.slice(-1))) {
                        // Don't append if expression is empty (unless it's '-') or last char is an operator or open parenthesis.
                        // This prevents "++", "*+", "(+", etc. and leading non-minus operators.
                        // Allows appending after an open parenthesis e.g. (- or (*
                        if (actualValueToAppend === '-' && expressionString.endsWith('(')) {
                             expressionString += actualValueToAppend; // Allow expressions like (-5)
                        } else if (expressionString.endsWith('(') && ['+','*','/','**','%'].includes(actualValueToAppend)) {
                            // do nothing, e.g. prevent (* or (/ or (%
                        } else if (expressionString !== '' && !['+', '-', '*', '/', '%','('].includes(expressionString.slice(-1))) {
                             // If not empty and last char is not an operator or '(', allow.
                             expressionString += actualValueToAppend;
                        }

                    } else {
                        expressionString += actualValueToAppend;
                    }
                } else if (actualValueToAppend === '-') { // Special handling for minus
                     if (expressionString.endsWith('-')) {
                        // do nothing, prevent "--"
                     } else {
                        expressionString += actualValueToAppend;
                     }
                }
                else { // Numbers, parentheses '()', decimal '.'
                    expressionString += actualValueToAppend;
                }
            }
            display.value = expressionString;
        });
    });
});
