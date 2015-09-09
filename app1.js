var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/////////////////////////////////////////////
var path = require("path");
var clients = {};
var ChromeCounter = 0;
var FirefoxCounter = 0;
var OperaCounter = 0;
var SafariCounter = 0;
var BrowserName;
var readline = require('readline');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('ascii');
var emitter = new (require('events').EventEmitter);
emitter.setMaxListeners(0);
var socet_id = "abc";
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

    console.log('message received from teller browser: tokenno='+query.tokenno+' uid='+query.uid+'                  socketid='+query.socketid+'windowno='+query.windowno);

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


io.sockets.on('connection', function (socket) {

  
  socket.on('add-user', function(data){
      
    var ClientName = CreateBrowserName(data.username);
    clients[ClientName] = {
      "socket": socket.id
    };
      
      socet_id = socket.id;
    
    console.log("New client connected with name: "+ClientName+"  with socket ID: "+socket.id+"\n");
    //console.log('Enter browser name to send to particular client\n');
    io.sockets.connected[clients[ClientName].socket].emit("add header message", "Connected to Socket " + "socket_id is: "+socket.id);
  });
    
   
process.stdin.setEncoding('ascii');

process.stdin.on('readable', function(input) {

var Input = process.stdin.read();
        
if (Input !== null) {
    
    var S = require('string');
    var mystring = S(Input);
    mystring = mystring.replace(/\n|\r\n|\r/g, '');

    var Splitstring = mystring.split(" ");
    var ClientBrwName = Splitstring[0];
    var WindowNo = Splitstring[1];
    var TokenNo = Splitstring[2];

    console.log("Client Name: "+ClientBrwName+"\n");
    console.log("WinNo:  "+WindowNo+"\n");
    console.log("TokenNo: "+TokenNo+"\n");
    
    
    for(var name in clients) {
                
        if(name === ClientBrwName) 
        {
            
            io.sockets.connected[clients[name].socket].emit("add-message","WinNo: "+ WindowNo + " "+"TokenNo: "+TokenNo);
            console.log("Sending to "+ClientBrwName+"\n");
            console.log('Enter browser name to send to particular client\n');
        }
    }
}
});

process.stdin.on('end', function() {
    process.stdout.write('end');
});
///////////////////////////////////////

   

//Removing the socket on disconnect
socket.on('disconnect', function() {
    for(var name in clients) {
        if(clients[name].socket === socket.id) {
            delete clients[name];
             console.log(name+' browser disconnected \n');
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