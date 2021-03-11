// SE2840 Winter 2021 - Lab 2 JS Coin Flipper
// Name: Stuart Harley
// Class Section: SE 2840-021

// In Webstorm: in File/Settings->Languages & Frameworks->Javascript, set language version to ECMAScript 6+
//              in File/Settings->Languages & Frameworks->Javascript->Code Quality Tools->JSHint, check Enable
// Tell the code inspection tool that we're writing ES6 compliant code:
// jshint esversion: 6
// Tell the code inspection tool that we're using "developer" classes (console, alert, etc)
// jshint devel:true
// See https://jshint.com/docs/ for more JSHint directives
// jshint unused:false

class CoinFlipper {
	constructor() {
		// Private Attributes
		let numberOfCoins = 0;
		let numberOfRepetitions = 0;
		let frequency;

		this.init = () => {
			console.clear();

			// Validating Coin Number Input
			numberOfCoins = prompt("Enter the number of coins to be flipped: ");
			let isValid = isInputAnInteger(numberOfCoins);
			if(!isValid) {
				alert("Invalid Input: input must be an integer");
				return false;
			}
			numberOfCoins = parseFloat(numberOfCoins);
			isValid = isNumValid(numberOfCoins, 1, 10);
			if(!isValid) {
				alert("Invalid Input: input must be within 1 and 10");
				return false;
			}

			//Validating Repetition Number Input
			numberOfRepetitions = prompt("Enter the number of flips: ");
			isValid = isInputAnInteger(numberOfRepetitions);
			if(!isValid) {
				alert("Invalid Input: input must be an integer");
				return false;
			}
			numberOfRepetitions = parseFloat(numberOfRepetitions);
			isValid = isNumValid(numberOfRepetitions, 1, 1000000);
			if(!isValid) {
				alert("Invalid Input: input must be within 1 and 1,000,000");
				return false;
			}

			// Performing the calculations and printing results
			frequency = new Array(numberOfCoins+1).fill(0);
			const startTime = performance.now();
			flipCoins();
			const executionTime = performance.now() - startTime;
			printHistogram();
			console.log("Coin Flipper Time: " + Math.round(executionTime) + "ms");
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

		// This method prints a histogram of the number of heads that occurred for a specified number of flips
		// Notes: The output generated for numCoins=5 and numReps=100000 may look something like this:
		//
		// Number of times each head count occurred in 100000 flips of 5 coins:
		// 0  3076  ***
		// 1  15792  ****************
		// 2  31348  *******************************
		// 3  31197  *******************************
		// 4  15552  ****************
		// 5  3035  ***
		const printHistogram = () => {
			console.log("Number of times each head count occurred in " + numberOfRepetitions +
				" flips of " + numberOfCoins + " coins:");
			for(let heads=0; heads<=numberOfCoins; heads++) {
				let line = " " + heads + "  " + frequency[heads] + "  ";
				let fractionOfReps = frequency[heads] / numberOfRepetitions;
				let numOfAsterisks = Math.round(fractionOfReps*100);
				for (let i=0; i<numOfAsterisks; i++) {
					line += "*";
				}
				console.log(line);
			}
		};
	}
}