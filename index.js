var express = require("express");
var app = express();
var port = 3700;
var namesTaken = [] //servira à mémoriser les noms de tous les utilisateurs
 
app.set('view engine', "jade");
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
app.get("/test", function(req, res){
    res.render("intro");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function (socket) {
	console.log(socket.request.connection.remoteAddress);
	var nameOfUser = '' //utilisé pour mémoriser le nom de l'utilisateur
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
    socket.on('sendname', function(username,fn) {
    	if (namesTaken.indexOf(username)==-1){
    		fn(true)
    		if (namesTaken.indexOf(nameOfUser)!=-1){
    			namesTaken[namesTaken.indexOf(nameOfUser)]=username;
    			}
    		else {
    			namesTaken.push(username)
    			};
    		nameOfUser = username
 		}
 		else {
 			fn(false)
 		};
 		});
 		socket.on('disconnect',function(){
 			console.log('client quit');
 			if (nameOfUser!=''){
 				namesTaken.splice(namesTaken.indexOf(nameOfUser),1);
 				}
 			});

});

console.log("Listening on port " + port);
