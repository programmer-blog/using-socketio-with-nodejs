/* @description: using socketio with nodejs
 *  This script contains cleitn side functions for socket io chat and emits data to server and receive events and data from
    server
 */
var socket = io.connect('http://localhost:3000');

    var username = Math.random().toString(36).substr(2,8); 
    socket.emit('join', { username: username });
    
    socket.on('user joined', function (data) {
        $(".js-userjoined").html(data.username + ' Joined chat room');
        console.log(data.users);
         $.each(data.users, function(index, user) { 
              console.log(user);
             $(".js-usersinchat").append('<span id ='+user+'>&nbsp;&nbsp;<strong>'+user+'</strong></span>');
         });
     });
     
     socket.on('user disconnected', function (data) {
        $("#"+data.username).remove();
     });
     
    //an event emitted from server
    socket.on('chat message', function (data) {
        var string = '<div class="row message-bubble"><p class="text-muted">' + data.username+'</p><p>'+data.message+'</p></div>';
      $('#messages').append(string);
    });

 

    $(function () {
        var timeout;

        function timeoutFunction() {
            typing = false;
            socket.emit("typing", { message: '', username: '' });
        }
       $("#sendmessage").on('click', function () {
         var message = $("#txtmessage").val();
         $("#txtmessage").val('');
         $('.typing').html("");
         socket.emit('new_message', { message: message, username: username });
       }); 

       $('#txtmessage').keyup(function () {
           console.log('happening');
           typing = true;
           socket.emit('typing', { message: 'typing...', username: username});
           clearTimeout(timeout);
           timeout = setTimeout(timeoutFunction, 2000);
       });
   });

    socket.on('typing', function (data) {
        if (data.username && data.message) {
            $('.typing').html("User: " + data.username + ' ' + data.message);
        } else {
            $('.typing').html("");
        }
    });

var typing = false;
var timeout = undefined;

function timeoutFunction(){
  typing = false;
  socket.emit(noLongerTypingMessage);
}