// SE2840 Winter 2021 - Lab 3 JS Coin Flipper DOM
// Name: Stuart Harley
// Class Section: 021

// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

window.onload = () => {
	const goButton = document.getElementById("go");
	goButton.onclick = run;
};

// Runs the simulation once and displays the appropriate results
const run = () => {
	const numCoins = validateNumCoins();
	const numFlips = validateNumFlips();
	const trs = document.getElementsByTagName("tr");
	const elapsedTime = document.getElementById("elapsedTime");
	Array.from(trs).forEach((element) => {
		element.style.visibility = "hidden";
	});
	elapsedTime.style.visibility = "hidden";
	if(numCoins === 0 || numFlips === 0) {
		return false;
	}
	const flipper = new CoinFlipper(numCoins, numFlips);
	const executionTime = flipper.runSimulation();
	setFrequencyLabels(flipper);
	setHistogramBarsPercentages(flipper);
	elapsedTime.innerHTML = "Elapsed Time: " + executionTime + "ms";
	for(let i=0; i<numCoins+1; i++) {
		trs[i].style.visibility = "visible";
	}
	elapsedTime.style.visibility = "visible";
}

// Sets the frequency labels in the histogram
const setFrequencyLabels = (flipper) => {
	const frequency = flipper.getFrequency();
	const countLabels = document.getElementsByClassName("count");
	for(let i=0; i<frequency.length; i++) {
		countLabels[i].innerHTML = frequency[i];
	}
}

// Sets the progress bars that represent the histogram to the appropriate amounts.
const setHistogramBarsPercentages = (flipper) => {
	const progressBars = document.getElementsByTagName("progress");
	const percentages = flipper.getPercentages();
	for(let i=0; i<percentages.length; i++) {
		progressBars[i].value = percentages[i];
	}
}

// Validation method for the value in the number of coins field.
// Handles displaying the error messages if the value of the coins field is not valid.
// Returns 0 if the value is not valid or the value if it is.
const validateNumCoins = () => {
	const numCoinsError = document.getElementById("numCoinsError");
	const numCoinsInput = document.getElementById("numCoins");
	const numCoinsText = numCoinsInput.value;
	if(numCoinsText.length === 0) {
		numCoinsError.innerHTML = "Number of Coins must not be blank"
		return 0;
	}
	let isValid = isInputAnInteger(numCoinsText);
	if(!isValid) {
		numCoinsError.innerHTML = "Number of Coins must be an integer"
		return 0;
	}
	const numCoinsNumber = parseInt(numCoinsText);
	isValid = isNumValid(numCoinsNumber, 1, 10);
	if(!isValid) {
		numCoinsError.innerHTML = "Number of Coins must be within 1 and 10"
		return 0;
	}
	numCoinsError.innerHTML = ""
	return numCoinsNumber;
};

// Validation method for the value in the number of flips field.
// Handles displaying the error messages if the value of the flips field is not valid.
// Returns 0 if the value is not valid or the value if it is.
const validateNumFlips = () => {
	const numFlipsError = document.getElementById("numFlipsError");
	const numFlipsInput = document.getElementById("numFlips");
	const numFlipsText = numFlipsInput.value;
	if(numFlipsText.length === 0) {
		numFlipsError.innerHTML = "Number of Flips must not be blank"
		return 0;
	}
	let isValid = isInputAnInteger(numFlipsText);
	if(!isValid) {
		numFlipsError.innerHTML = "Number of Flips must be an integer"
		return 0;
	}
	const numFlipsNumber = parseInt(numFlipsText);
	isValid = isNumValid(numFlipsNumber, 1, 1000000);
	if(!isValid) {
		numFlipsError.innerHTML = "Number of Flips must be within 1 and 1,000,000"
		return 0;
	}
	numFlipsError.innerHTML = ""
	return numFlipsNumber;
};

// Returns true if value is an integer.
const isInputAnInteger = (value) => {
	if(isNaN(value)) {
		return false;
	}
	return Number.isInteger(parseFloat(value));
};

// Returns true if value is between the left and right bounds (inclusive).
// This method assumes that value is a valid number.
const isNumValid = (value, lbound, rbound) => {
	return (value >= lbound && value <= rbound);
};

class CoinFlipper {
	constructor(numCoins, numFlips) {
		//Private Attributes
		let numberOfCoins = numCoins;
		let numberOfRepetitions = numFlips;
		let frequency;
		let percentages;

		// This method flips a specified number of coins a specified number of times,
		// and gathers the number of times a certain number of heads occurred in each flip into the frequency[] array.
		const flipCoins = () => {
			for(let rep=0; rep<numberOfRepetitions; rep++) {
				let heads = doSingleFlip();
				frequency[heads]++;
			}
		};

		// This method flips a specified number of coins and returns the number heads that occurred in the flip.
		// It makes use of a random number generator to randomly generate heads or tails for each coin flipped.
		// Returns the number of heads that occurred in the flip
		const doSingleFlip = () => {
			let heads = 0;
			for(let i=0; i<numberOfCoins; i++) {
				heads += Math.floor(Math.random() * 2);
			}
			return heads;
		};

		// This method calculates the percentage of the histogram bar that should be filled.
		// The bar with the most flips should be filled 100% and the rest of the bars scaled appropriately.
		// The values are placed in the percentages array attribute.
		const calculateHistogramPercentages = () => {
			percentages = new Array(frequency.length);
			let max = 0;
			for(let i=0; i<frequency.length; i++) {
				if(frequency[i] > max) {
					max = frequency[i];
				}
			}
			for(let i=0; i<percentages.length; i++) {
				percentages[i] = frequency[i]/max * 100;
			}
		}

		// This method simulates the flips and stores the values in the frequency array attribute.
		// Returns the total execution time of the flips.
		this.runSimulation = () => {
			frequency = new Array(numberOfCoins+1).fill(0);
			const startTime = performance.now();
			flipCoins();
			const executionTime = performance.now() - startTime;
			calculateHistogramPercentages();
			return executionTime;
		}

		this.getFrequency = () => {
			return frequency;
		}

		this.getPercentages = () => {
			return percentages;
		}
	}
}