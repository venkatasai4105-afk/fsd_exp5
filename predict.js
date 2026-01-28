// ===============================
// Example datasets
// ===============================
const examples = {
    1: { // Setosa
        sepal_length: 5.1,
        sepal_width: 3.5,
        petal_length: 1.4,
        petal_width: 0.2
    },
    2: { // Versicolor
        sepal_length: 5.7,
        sepal_width: 2.8,
        petal_length: 4.1,
        petal_width: 1.3
    },
    3: { // Virginica
        sepal_length: 6.7,
        sepal_width: 3.0,
        petal_length: 5.2,
        petal_width: 2.3
    }
};

// ===============================
// Fill form with example data
// ===============================
function fillExample(exampleNum) {
    const example = examples[exampleNum];

    document.getElementById('sepal_length').value = example.sepal_length;
    document.getElementById('sepal_width').value = example.sepal_width;
    document.getElementById('petal_length').value = example.petal_length;
    document.getElementById('petal_width').value = example.petal_width;
}

// ===============================
// Handle form submission
// ===============================
document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Hide previous results/errors
    document.getElementById('result').style.display = 'none';
    document.getElementById('error').style.display = 'none';

    // Show loading state
    const predictBtn = document.getElementById('predictBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    predictBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    // Get form values
    const features = [
        parseFloat(document.getElementById('sepal_length').value),
        parseFloat(document.getElementById('sepal_width').value),
        parseFloat(document.getElementById('petal_length').value),
        parseFloat(document.getElementById('petal_width').value)
    ];

    try {
        // Make API request
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ features: features })
        });

        const data = await response.json();

        if (response.ok) {
            displayResult(data);
        } else {
            displayError(data.error || 'An error occurred');
        }

    } catch (error) {
        displayError('Failed to connect to server: ' + error.message);
    } finally {
        // Reset button state
        predictBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// ===============================
// Display prediction result
// ===============================
function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';

    // Predicted class
    document.getElementById('predictedClass').textContent = data.prediction;

    // Display probabilities
    if (data.probabilities) {
        const probBars = document.getElementById('probBars');
        probBars.innerHTML = '';

        for (const [className, probability] of Object.entries(data.probabilities)) {
            const percentage = (probability * 100).toFixed(2);

            const probBar = document.createElement('div');
            probBar.className = 'prob-bar';

            probBar.innerHTML = `
                <div class="prob-label">
                    <span class="prob-name">${className}</span>
                    <span class="prob-value">${percentage}%</span>
                </div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
            `;

            probBars.appendChild(probBar);
        }
    }

    // Display input values
    const inputValues = document.getElementById('inputValues');
    inputValues.innerHTML = '';

    for (const [featureName, value] of Object.entries(data.input_features)) {
        const inputItem = document.createElement('div');
        inputItem.className = 'input-item';

        inputItem.innerHTML = `
            <span>${featureName}:</span>
            <strong>${value} cm</strong>
        `;

        inputValues.appendChild(inputItem);
    }

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===============================
// Display error message
// ===============================
function displayError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = 'Error: ' + message;
    errorDiv.style.display = 'block';

    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}