function concatData(id, data) {
	return id + ": " + data + "<br>";
}

var handString = "";
var hand;
var canJump = true;
var debug = false;
var frameString = "";
// Leap.loop uses browsers requestAnimationFrame
var options = { enableGestures: true };

// Main Leap loop
Leap.loop(options, function(frame) {
	
    if(debug){
        frameString = concatData("frame_id", frame.id);
        frameString += concatData("num_hands", frame.hands.length);
        frameString += "<br>";    
    }
	
	for (var i = 0; i < frame.hands.length; i++) {
		hand = frame.hands[i];
        if(debug){
            handString = concatData("hand_type", hand.type);
            handString += concatData("confidence", hand.confidence);
            handString += concatData("palm position", hand.palmPosition);
            handString += concatData("pinch_strength", hand.pinchStrength);
            handString += concatData("grab_strength", hand.grabStrength);
            handString += '<br>';
            frameString += handString;
        }
        tryJump(hand.palmPosition);
	}
	
	document.getElementById("leap").innerHTML = frameString;
});

function verify (color, message){
    $("#position").css("background-color",color).text(message);
};

function tryJump (palmPosition){
    var palmY = palmPosition[1];
    
    if(palmY > 200 && canJump){
        try {
            if(game.state.getCurrentState() !== mainState)
                game.state.start("Game");
            mainState.jump();
            canJump = false;
            verify("red", "Move hand down");
        } 
        catch(e) {
            
        }
    }
    if(100 < palmY && palmY < 200){
        verify("yellow", "Neutral Zone Hand up to start flapping");
    }
    if(palmY < 100){
        canJump = true;
        verify("green", "Move hand up");
    }
}