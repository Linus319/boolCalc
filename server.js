const express = require('express');
const path = require('path');

const PORT=8080;

app = express();
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('index');
})

app.post('/', (req, res) => {
    const exp = req.body.expression;
    const varList = parseVariables(exp);
    console.log(varList);
    const truthTable = generateTruthTable(varList, exp);
    res.render('result', {truthTable, varList});
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

function parseVariables(exp) {
    result = exp.split(/[^A-Za-z]/);
    return result;
}



function generateTruthTable(varList, expression) {
    const table = [];
    const numRows = Math.pow(2, varList.length); // Number of rows in the truth table

    // Generate all possible combinations of truth values for variables
    for (let i = 0; i < numRows; i++) {
        const row = {};
        for (let j = 0; j < varList.length; j++) {
            row[varList[j]] = (i >> j) & 1 ? true : false;
        }
        row['Result'] = evaluateExpression(expression, row); // Evaluate the expression for the current row
        table.push(row);
    }

    return table;
}

function evaluateExpression(expression, row) {
    // Replace variables in the expression with their truth values from the current row
    const evaluatedExpression = expression.replace(/[a-zA-Z]+/g, match => row[match]);

    // Evaluate the expression using JavaScript's eval() function
    return eval(evaluatedExpression) ? 1 : 0; // Convert boolean result to 1 or 0
}