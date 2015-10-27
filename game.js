// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
var score = 0;
var boot = function(game) {};
boot.prototype = {
	preload: function(){
          this.game.load.image("loading","assets/bird.png"); 
	},
  	create: function(){

		this.game.state.start("Preload");
	}
};

var preload = function(game){};
 
preload.prototype = {
    preload: function() { 
        var loadingBar = this.add.sprite(160,240,"loading");
        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);
        // Change the background color of the game
        game.stage.backgroundColor = '#fff';

        // Load the bird sprite
        game.load.image('bird', 'assets/bird.png');  

        // Load the pipe sprite
        game.load.image('pipe', 'assets/pipe.png');
        
    },
  	create: function(){
		this.game.state.start("GameTitle");
	}
};

//adds the game title
var gameTitle = function(game){}
 
gameTitle.prototype = {
  	create: function(){
        this.labelScore = this.game.add.text(90, 200, "FlappyLeap", { font: "30px Arial", fill: "#000" });
		var playButton = this.game.add.button(160,320,"bird",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("Game");
	}
};

// Creates a new 'main' state that will contain the game
var mainState = {
    // Fuction called after 'preload' to setup the game 
    create: function() { 
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
        
        // Add gravity to the bird to make it fall
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 

        // Create a group of 20 pipes
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  

        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        // Add a score label on the top left of the screen
        score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000" });  
    },

    // This function is called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.bird.inWorld == false)
            this.restartGame(); 

        // If the bird overlap any pipes, call 'restartGame'
        game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);      
    },

    // Make the bird jump 
    jump: function() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('GameOver');
    },

    // Add a pipe on the screen
    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(400, i*60+10);   
    
        score += 1;
        this.labelScore.text = score;  
    },
};

var gameOver = function(game){}
 
gameOver.prototype = {
  	create: function(){
		this.labelScore = this.game.add.text(90, 200, "Game Over. Score: " + score, { font: "30px Arial", fill: "#000" });
		var playButton = this.game.add.button(160,320,"bird",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("Game");
	}
}

game.state.add('Boot', boot);
game.state.add('Preload', preload);
game.state.add('GameTitle', gameTitle);
game.state.add('Game', mainState); 
game.state.add('GameOver', gameOver);
game.state.start('Boot'); 