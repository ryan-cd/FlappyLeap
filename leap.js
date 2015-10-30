function concatData(id, data) {
	return id + ": " + data + "<br>";
}

var handString = "";
var hand;
var canJump = true;

// Leap.loop uses browsers requestAnimationFrame
var options = { enableGestures: true };

// Main Leap loop
Leap.loop(options, function(frame) {
	frameString = concatData("frame_id", frame.id);
	frameString += concatData("num_hands", frame.hands.length);
	frameString += "<br>";
	
	for (var i = 0; i < frame.hands.length; i++) {
		hand = frame.hands[i];
		handString = concatData("hand_type", hand.type);
		handString += concatData("confidence", hand.confidence);
        handString += concatData("palm position", hand.palmPosition);
        tryJump(hand.palmPosition);
		handString += concatData("pinch_strength", hand.pinchStrength);
		handString += concatData("grab_strength", hand.grabStrength);
		
		handString += '<br>';
        frameString += handString;
	}
	
	document.getElementById("leap").innerHTML = frameString;
});

function verify (color, message){
    $("#position").css("back-ground","red").text("move up");
};

function tryJump (palmPosition){
    var palmY = palmPosition[1];
    
    if(palmY > 200 && canJump){
        mainState.jump();
        canJump = false;
        verify("red", "Move hand down");
    }
    if(100 < palmY && plamY < 200){
        verify("yellow", "Move hand down to start");
    }
    if(palmY < 100){
         canJump = true;
        verify("green", "Move hand up");
    }      
}