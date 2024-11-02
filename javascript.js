const fs = require('fs');

function decodeValue(base, value) {
    return parseInt(value, base);
}

function readJson(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return data.testCases.map(testCase => {
        const n = testCase.keys.n;
        const k = testCase.keys.k;
        const points = [];

        for (let i = 1; i <= n; i++) {
            const point = testCase[i.toString()];
            if (point) {
                const base = parseInt(point.base, 10);
                const value = point.value;
                const y = decodeValue(base, value);
                points.push({ x: i, y: y });
            }
        }

        return { n, k, points };
    });
}

function lagrangeInterpolation(points, x = 0) {
    let total = 0;
    for (let i = 0; i < points.length; i++) {
        let { x: xi, y: yi } = points[i];
        let term = yi;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let { x: xj } = points[j];
                term *= (x - xj) / (xi - xj);
            }
        }

        total += term;
    }
    return Math.round(total);
}

function main(filename) {
    const testCases = readJson(filename);

    testCases.forEach((testCase, index) => {
        const { n, k, points } = testCase;
        
        // Ensure we have enough points to compute the constant term
        const selectedPoints = points.slice(0, k);
        
        // Calculate the constant term (secret)
        const constantTerm = lagrangeInterpolation(selectedPoints, 0);
        
        console.log(`Secret (constant term 'c') for Test Case ${index + 1}: ${constantTerm}`);
    });
}

const filename = 'data.json'; 
main(filename);
