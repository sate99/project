$(document).ready(function() {

  var hodors = ["hodor", "hodor!", "HODOR!!", "HODOR!", "HoOoDoOr!"];

function addReply(input) {

  $(".chatbox").append(
	$("<div class='chat-msg-container-hodor'><div class='chat-msg-right'>" + input + "</div></div>")
  );  
  
  var myPanel = $(".chatbox");
  myPanel.scrollTop(myPanel[0].scrollHeight - myPanel.height());    
}

function addMessage(msg) {
  $(".chatbox").append(
  	$("<div class='chat-msg-container'><div class='chat-msg-left'>" + msg + "</div></div>")
  );
  
}
  
  $(".chat-input").keydown(function( event ) {
    if ( event.which == 13 ) {
      event.preventDefault();
      
      var message = $(".chat-input").val();    
      if( message.length > 0 ) {
				addMessage(message);
        $(".chat-input").val('');
		$.ajax({
			url: "https://www.personalityforge.com/api/chat/?apiKey=6nt5d1nJHkqbkphe&message="+message+"&chatBotID=63906&externalID=chirag1",
			type: 'GET',
			dataType: 'json',
			success: function(res) {
				addReply(res.message.message);
			}
		});
      }
    }
  });
  $(".send").click(function() {
	  var message = $(".chat-input").val();    
      if( message.length > 0 ) {
				addMessage(message);
        $(".chat-input").val('');
		$.ajax({
			url: "https://www.personalityforge.com/api/chat/?apiKey=6nt5d1nJHkqbkphe&message="+message+"&chatBotID=63906&externalID=chirag1",
			type: 'GET',
			dataType: 'json',
			success: function(res) {
				addReply(res.message.message);
			}
		});
	  }
  });
});