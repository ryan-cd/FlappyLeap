function concatData(id, data) {
	return id + ": " + data + "<br>";
}

var handString = "";
var hand;
var canJump = true;
var debug = false;
var frameString = "";
var maxHeight = 130;
var minHeight = 100;
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
        indicator(hand.palmPosition[1]);
	}
	
	document.getElementById("leap").innerHTML = frameString;
});

function indicator(height){
    if(height < minHeight){
        $("#indicator-border").css("border-left-width", 10);
        $("#indicator-border").css("border-right-width", 10);
        $("#indicator-border").css("border-left-color", "lightgreen");
        $("#indicator-border").css("border-right-color", "lightgreen");
    } else if (height > maxHeight) {
        $("#indicator-border").css("border-left-width", 2);
        $("#indicator-border").css("border-right-width", 2);
        $("#indicator-border").css("border-left-color", "black");
        $("#indicator-border").css("border-right-color", "black");
    }
    var range = maxHeight - minHeight;
    var actualHeight = height - minHeight + 20;
    var offset = (1 - (actualHeight / range))*gameHeight / 2;
    if(offset > gameHeight/2)
        offset = gameHeight/2;
    $("#indicator").css("height", offset);
}

function tryJump (palmPosition){
    var palmY = palmPosition[1];
    
    //flap range
    if(palmY > maxHeight && canJump){
        try {
            if(game.state.getCurrentState() !== mainState)
                game.state.start("Game");
            mainState.jump();
            canJump = false;
        } 
        catch(e) {
            
        }
    }
    //wing down range
    if(palmY < minHeight && canJump == false){
        canJump = true;
        try {
            mainState.setWings('down');
        } catch(e) {
            //you tried to load a sprite when mainState was not active
        }
    }
}