function concatData(id, data) {
	return id + ": " + data + "<br>";
}

var handString = "";
var hand;
var canJump = true;
var debug = false;
var frameString = "";
var maxHeight = 200;
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
    if(height > maxHeight || height < minHeight){
        //$("#indicator-border").css("border-left-width", 4);
        //$("#indicator-border").css("border-right-width", 4);
        //console.log("maxed out");
    } else {
        var range = maxHeight - minHeight;
        var actualHeight = height - minHeight;
        var percent = (1 - (actualHeight / range))*gameHeight / 2;
        $("#indicator").css("height", percent);
        //$("#indicator-border").css("border-left-width", 2);
        //$("#indicator-border").css("border-right-width", 2);
        console.log(percent);
    }
}

function verify (color, message){
    $("#position").css("background-color",color).text(message);
};

function tryJump (palmPosition){
    var palmY = palmPosition[1];
    
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
    if(palmY < minHeight){
        canJump = true;
    }
}