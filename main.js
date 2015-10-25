//initialize Phaser
var game = new Phaser.Game(800, 500, Phaser.AUTO, 'main');

var mainState = {
    // PHASER: called before starting game to load assets
    preload: function () {
        game.load.image('bird', 'assets/bird.png');
        game.load.image('block', 'assets/pipe.png');
        
        game.stage.backgroundColor = '#115577'; 
    },
    
    //PHASER: called to set up the game
    create: function () {
        //create objects
        this.bird = this.game.add.sprite(100, 250, 'bird');
        this.blocks = game.add.group();
        this.blocks.enableBody = true;
        this.blocks.createMultiple(50, 'block'); 
        
        // setup physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        
        //controls
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        // Timer to draw new column periodically
        this.timer = this.game.time.events.loop(1500, this.addBlockColumn, this);           

        // score
        this.score = 0;
        this.labelScore = this.game.add.text(15, 15, "0", { font: "35px Helvetica", fill: "#eeeeee" });
    },
    
    //PHASER: main loop
    update: function () {
        if (!this.bird.inWorld) {
            this.restart();
        }
        game.physics.arcade.overlap(this.bird, this.blocks, this.restart, null, this);
        
        this.labelScore.text = this.score;  
    },
    
    jump: function() {
        this.bird.body.velocity.y = -300;
    },
    
    restart: function () {
        game.state.start('main');
    },
    
    addBlock: function(x, y) {
        // retrieve block from dead group
        var block = this.blocks.getFirstDead();

        block.reset(x, y);

        block.body.velocity.x = -200; 
               
        block.checkWorldBounds = true;
        block.outOfBoundsKill = true;
    },

    addBlockColumn: function() {
        var gap = Math.floor(Math.random()*7)+1;
        
        for (var i = 0; i < 10; i++)
            if (i != gap && i != gap +1) 
                this.addBlock(800, i*50);  
    },
};

game.state.add('main', mainState);
game.state.start('main');