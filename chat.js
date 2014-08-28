window.onload = function() {

    var messages = []; // tous les messages recus sont stocké pour être affiché dans la fenetre
    var socket = io.connect('http://10.0.0.6:3700'); // À remplaer par l'IP/addresse du serveur
    var siofu = new SocketIOFileUpload(socket); // librairie pour les trnasferts de fichier
    //on recupère ensuite les ID des différents éléments interactifs de la page
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var changeButton = document.getElementById("changeName");
    var nameButton = document.getElementById("validateName");
    var $modal2 = jQuery('#modal');
    var content = document.getElementById("content");
    var name = document.getElementById("name");
     
     // les propiété de modal qui lui permette de couvrir la page
    $modal2.dialog({ height: 350,
                        width: 400,
                        modal: true,
                        position: 'center',
                        autoOpen:true,
                        title:'Bienvenue sur le Chat',
                        dialogClass: 'no-close'
                        //overlay: { opacity: 0.5, background: 'black'}
                        });
     
     // la fonction qui fait apparaitre modal
    jQuery("#changeName").click(function(e) {
    		showDialog();
    		e.preventDefault();
    });

    	//gere la réception de message
    	//À chaque nouveau message l'array est mis à jour
    	//puis son contenu est traduit en code html qui est ensuite intégré à la page
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
            content.scrollTop = content.scrollHeight; // permet de toujour voir le dernier message
        } else {
            console.log("There is a problem:", data);
        }
    });
    
    // Controle l'envoi de message
    sendButton.onclick = function() {
        //normalement on ne peut pas choisir "" comme nom, mais cela sert de sécurité
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            //le message est envoyé par le socket
            socket.emit('send', { message: text, username: name.value });
            //on vide le champ de saisie du texte
            field.value = ""
        }
    };

    // Permet de choisir et valider
    validateName.onclick = function() {
    	   //le nom "" est interdit
    	   if(name.value == "") {
            alert("Please type your name!");
         }
         else {
         	//ce controle pemrt de vérifier que les seuls nom choisi sont pas utilisé
         	console.log('sending name');
         	//on envoie au serveur un message contenant le nom choisi
         	socket.emit('sendname', name.value,function(nameresult){
         	 // la fonction défini içi sera éxecuté en local avec un argument choisi par le serveur
         		console.log("function appelé");
         		console.log(nameresult)
         		//l'arguemnt est un booléen renseignant l'accesibilité du nom
         		if(nameresult){
         			$modal2.dialog("close");
         			}
         		else {
         			alert("nom déja choisi");
         			}
         		});
    	   }
    	}
   
    //Cela active la fenetre de changement de nom c'est appelé losqu'on clique sur validatename
    var showDialog = function() {
    		$modal2.show();
    		$modal2.dialog("open");
    	};
    	
   

    //à chaqque fichier sélectionné, un upload au serveur est lancé
    siofu.listenOnInput(document.getElementById("files"));
 
}
