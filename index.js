var express = require("express");
var SocketIOFileUploadServer = require("socketio-file-upload");
var app = express();
var port = 3700;
var namesTaken = [] //servira à mémoriser les noms de tous les utilisateurs
 
 //configuration de l'app
app.set('view engine', "jade");
app.set('views', __dirname + '/tpl');
app.use(SocketIOFileUploadServer.router);
app.use(express.static(__dirname + "/public"))
app.engine('jade', require('jade').__express);

//test est la page principale
app.get("/test", function(req, res){
    res.render("intro");
});


//permet de récupèrer les connexion initié par les clients
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {
	console.log(socket.request.connection.remoteAddress);
	var nameOfUser = '' //utilisé pour mémoriser le nom de l'utilisateur permet de simplifier les changements de nom
    socket.emit('message', { message: 'welcome to the chat' }); // message de bienvenue diffusé à un seiul client
    //gere la reception de message en le transmettan à tous les clients
    socket.on('send', function (data) { 
        io.sockets.emit('message', data);
    });
    
    //gere le choix du nom pour empecher deux clients d'avoir le meme
    socket.on('sendname', function(username,fn) {
    	if (namesTaken.indexOf(username)==-1){
    		fn(true); // cette fonction est executé coté client (mais appelé içi)
    		// modification de la liste de nom de 2 façon différente selon le cas nouveau client/ancien client
    		if (namesTaken.indexOf(nameOfUser)!=-1){
    			namesTaken[namesTaken.indexOf(nameOfUser)]=username;
    			}
    		else {
    			namesTaken.push(username)
    			};
    		nameOfUser = username
 		}
 	else {
 		fn(false); // cette fonction est executé coté client (mais appelé içi)
 	     };
 	});
 	        //on libère le nom des clients déconecté
 		socket.on('disconnect',function(){
 			console.log('client quit');
 			if (nameOfUser!=''){
 				namesTaken.splice(namesTaken.indexOf(nameOfUser),1);
 				}
 			});
 			
 	        // cette partie là gère tous les upload de fichier
 		var uploader = new SocketIOFileUploadServer();
 		// ils sont sauvé dans un dossier public (à préciser)
 		uploader.dir = "/pathTo/public/upload";
 		uploader.listen(socket);
 		
 		uploader.on("saved", function(event){
        		 //à chaque enregistrement réussi un message est envoyé ç tous avec le lien du fichier
         		io.sockets.emit('message',{message:'new file <a target="_blank" href="http://10.0.0.6:3700/upload/'+event.file.name+'">here</a>'});
      });
      //reception d'erreur
      uploader.on("error",function(event){
      	console.log("error from uploader",event)
      	});
});

console.log("Listening on port " + port);
