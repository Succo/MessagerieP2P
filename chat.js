window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://10.0.0.6:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var changeButton = document.getElementById("changeName");
    var nameButton = document.getElementById("validateName");
    var $modal2 = jQuery('#modal');
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    
    $modal2.dialog({ height: 350,
                        width: 400,
                        modal: true,
                        position: 'center',
                        autoOpen:true,
                        title:'Bienvenue sur le Chat',
                        dialogClass: 'no-close'
                        //overlay: { opacity: 0.5, background: 'black'}
                        });
     
    jQuery("#changeName").click(function(e) {
    		showDialog();
    		e.preventDefault();
    });

    	
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight;
        } else {
            console.log("There is a problem:", data);
        }
    });
    
    // Controle l'envoi de message
    sendButton.onclick = function() {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            field.value = ""
        }
    };

    // Permet de valider son nom
    validateName.onclick = function() {
    	   if(name.value == "") {
            alert("Please type your name!");
         }
         else {
         	console.log('sending name');
         	socket.emit('sendname', name.value,function(nameresult){
         		console.log("function appelé");
         		console.log(nameresult)
         		if(nameresult){
         			$modal2.dialog("close");
         			}
         		else {
         			alert("nom déja choisi");
         			}
         		});
    	   }
    	}
   
    //Cela active la fenetre de changement de nom
    var showDialog = function() {
    		$modal2.show();
    		$modal2.dialog("open");
    	};
 
}
