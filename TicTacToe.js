// A tic tac toe AI playing against itself

// AI Stuff

const synaptic = require('synaptic');
const Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;
const clone = require('clone');

var hans = new Architect.Perceptron(9, 10, 10, 10, 9);
var myField = [0,0,0,0,0,0,0,0,0];
var validSet = []; // To explain what is valid
var correctSet = []; // What the network did right, collect to find out winning combinations
var winningSet = []; // Winning combinations

var trainer = new Trainer(hans);

const aiPlayer = function(myinput, tag) {
  var answer = hans.activate(myinput);
  var choice = 0, search = 0;
	var myoutput = [];
  for(var pos = 0; pos < 9; pos++) {
    if (answer[pos] > search) {
      search = answer[pos];
      choice = pos;
    }
  }

  if (myinput[choice] != 0) {
    // Invalid -> Generate all possible correct solutions and feed them in
		if (!myinput.includes(0)) {
			return myinput;
		}
    // Learn from current
    trainer.train(generateCorrect(myinput), {iterations: 1000});
		return aiPlayer(myinput, tag);
  } else {
    // Correct, save to generate a set of correct moves

    myoutput = myinput.slice();
    myoutput[choice] = tag;
    if(tag===1) {
			correctSet.push({input: myinput.slice(), output: myoutput.slice()});
		}
    if (haveIWon(myoutput, tag)) {
      correctSet.forEach(el => winningSet.push(clone(el)));
      correctSet = [];
      return [9,9,9,9,9,9,9,9,9];
    }
  }

  return myoutput;
}

const generateCorrect = myinput => {
  var correct = [];
  var explanation = [0,0,0,0,0,0,0,0,0];

  for(var i = 0; i < 9; i++) {
    if(myinput[i] == 0) {
      explanation[i] = 1;
      var result = {input: myinput.slice(), output: explanation.slice()};
      correct.push(result);
      explanation[i] = 0;
    }
  }

  return correct;
};

const haveIWon = function(field, id) {
  switch(id*id*id) {
    case (field[0] * field[1] * field[2]): return true; break;
    case (field[3] * field[4] * field[5]): return true; break;
    case (field[6] * field[7] * field[8]): return true; break;
    case (field[0] * field[3] * field[6]): return true; break;
    case (field[1] * field[4] * field[7]): return true; break;
    case (field[2] * field[5] * field[8]): return true; break;
    case (field[0] * field[4] * field[8]): return true; break;
    case (field[6] * field[4] * field[2]): return true; break;
    default: return false; break;
  }
};


const trainMe = max => {
	for(var iterations = 0; iterations < max/1000; iterations++) {
		myField = [0,0,0,0,0,0,0,0,0];
		correctSet = [];
		validSet = [];
		winningSet = [];
		setTimeout(function() {
				for(var block = 0; block<1000; block++) {
				  myField = aiPlayer(myField, 1).slice();
			    while(myField.includes(0)) {
						myField = aiPlayer(myField, 3).slice();
			      myField = aiPlayer(myField, 1).slice();
			    }
				}
		    myField = [0,0,0,0,0,0,0,0,0];
			}, 10);
			trainer.train(winningSet, {iterations: max});
			console.log(Math.floor(iterations/max*100000)+'%');
  }
	myField = [0,0,0,0,0,0,0,0,0];
	correctSet = [];
	validSet = [];
	winningSet = [];
}

// Interaction Stuff

const train_b = document.querySelector('#train');
const training_in = document.querySelector('#iterations');
const overlay = document.querySelector('.overlay');
const spinner = document.querySelector('.spinner');
const start_b = document.querySelector('#start');
const fields = Array.from(document.querySelectorAll(".field-box"));
var game_running = false;

train_b.addEventListener("click", function() {
	overlay.classList.add('is-visible');
	var iterations = parseInt(training_in.value);
	setTimeout(function () {
		trainMe(iterations ? iterations : 1000);
	}, 500);
  setTimeout(function () {
  	overlay.classList.remove('is-visible');
  }, 2000);
});

start_b.addEventListener("click", function() {
	game_running = true;
	fields.forEach (el => {
		el.innerHTML = "";
	})
	myField = [0,0,0,0,0,0,0,0,0];
	aiPlayer(myField);
});

fields.forEach(el => {
	el.addEventListener("click", function() {
		if(!game_running) {
			alert("Spiel noch nicht gestartet!");
			return;
		}
		var button_caption = el.innerHTML;
		if (button_caption === "") {
			el.innerHTML = "X";
			myField[parseInt(el.getAttribute("number"))] = 3;
			console.log(myField);
			if (haveIWon(myField, 3)) {
				alert("You won!");
				game_running = false;
				return;
			} else {
				myField = aiPlayer(myField, 1).slice();
				if(myField.includes(9)) {
					alert('Computer won!');
					game_running = false;
					trainer.train(winningSet, {iterations: 10000});
					return;
				}
				renderAI(myField, 1);
				console.log(myField);
			}
		}
	});
});

var renderAI = function(field, tag) {
	for(var i = 0; i<9; i++) {
		if(field[i] === tag) {
			document.querySelector('.field-box[number="' + i + '"]').innerHTML = 'O';
		}
	}
};
