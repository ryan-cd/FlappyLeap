//initialize Phaser with dimensions and name of div to use
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'main');

var mainState = {
    //called before starting game to load assets
    preload: function () {
        game.stage.backgroundColor = '#115577';
    },
    
    //called to set up the game
    create: function () {
        
    },
    
    //main loop
    update: function () {
        
    }
};

game.state.add('main', mainState);
game.state.start('main');