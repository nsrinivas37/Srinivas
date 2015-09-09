var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/////////////////////////////////////////////
var path = require("path");
var clients = {};
var ChromeCounter = 65;
var FirefoxCounter = 0;
var OperaCounter = 0;
var SafariCounter = 0;
var BrowserName;
var readline = require('readline');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('ascii');
var emitter = new (require('events').EventEmitter);
emitter.setMaxListeners(0);
var socketid = "";
////////////////////////////////////////////

/*
app.post('/phpcallback', function(req, res) {
    var content = req.body;
   // console.log('message received from php: ' + (content.msg));
    console.log('message received from php: ' + JSON.stringify(content));
    //to-do: forward the message to the connected nodes.
    res.end(content);
});
*/
app.get('/phpgetnew', function (req, res){
    /* res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*' // implementation of CORS
         
    });
    */ 
 //   url: 'http://ec2-52-26-124-153.us-west-2.compute.amazonaws.com:3000/phpgetnew?tokenno='+token+'&uid=284d80bd94437dc4&socketid=24cukLGNBYAns1rIAAAB&windowno='+windowno,
    var query = require('url').parse(req.url,true).query;
     var tokenno,windowno;
    tokenno=query.tokenno;
    windowno=query.windowno;
	socketid=query.socketid;
    console.log('message received from teller browser: tokenno='+query.tokenno+' uid='+query.uid+' socketid='+query.socketid+' windowno='+query.windowno);
    msg_send(tokenno,windowno); 
    res.end('1');
});


/*
http.listen(3000, function(){
  var addr = http.address();
  console.log('app listening on ' + addr.address + ':' + addr.port);
});
*/




////////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    res.sendFile(__dirname + '/testnode.html');
});

function sendHeartbeat(){
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat : 1 });
    //console.log("pinged");
    
}

io.sockets.on('connection', function (socket) {

      socket.on('pong', function(data){
        //console.log("Pong received from client");
    });

  socket.on('add-user', function(data){
      
    //var ClientName = CreateBrowserName(data.username);
      var ClientName = "";
    clients[ClientName] = {
      "socket": socket.id
    };
      
      socet_id = socket.id;
    
    console.log("New client connected"+ClientName+"  with socket ID: "+socket.id+"\n");
    //console.log('Enter browser name to send to particular client\n');
    io.sockets.connected[clients[ClientName].socket].emit("add header message",socket.id);
  });
    




setTimeout(sendHeartbeat, 8000);
///////////////////////////////////////

   

//Removing the socket on disconnect
socket.on('disconnect', function(reason) {
    for(var name in clients) {
        if(clients[name].socket === socket.id) {
            delete clients[name];
             console.log(' browser with socset id :'+socket.id+'  disconnected bcoz of ' +reason+ '\n');
            break;
        }
    }	
});

});


http.listen(3000, function(){
    console.log('listening on *:3000');
    
});


function CreateBrowserName(BrwName) {
    
    if(BrwName === "Chrome")
    {
        var chromex = new Buffer([ChromeCounter]);
        BrowserName = "Chrome"+ chromex;
        ChromeCounter++;
    }
    else if(BrwName === "Firefox")
    {
        var Firefoxx = new Buffer([FirefoxCounter]);
        BrowserName = "Chrome"+ Firefoxx;        
        FirefoxCounter++;
    }
    else if(BrwName === "Opera")
    {
        var Operax = new Buffer([OperaCounter]);
        BrowserName = "Opera"+OperaCounter;
        OperaCounter++;
    }
    else if(BrwName === "Safari")
    {
        var Operax = new Buffer([SafariCounter]);
        BrowserName = "Safari"+Operax;
        SafariCounter++;
    }
    
    return BrowserName;
}
   


///////////////////////////////////////////////////////////////////

    function msg_send(tokenno,windowno){
     // console.log("Client Name: "+ClientBrwName+"\n");
     console.log("TokenNo:  "+tokenno+"\n");
     console.log("WinNo: "+windowno+"\n");
     io.sockets.connected[socketid].emit("add-message","WinNo:"+ windowno + "<::>"+"TokenNo:"+tokenno);
     console.log("sent to socket: "+socketid);
        var i=0,arr=[];
	/*	for(var name in clients) {
            arr[i]=clients[name].socket;
			if(clients[name].socket==socketid){
				//io.sockets.connected[clients[name].socket].emit("add-message","WinNo:"+ windowno + "<::>"+"TokenNo:"+tokenno);
                console.log("sent to socket: "+socketid);
		
            }
            	i++;
         
		}*/
           
           // console.log("current soc :" +arr);
        
    }























