var config = {
  name: '',
  topic: 'test1',
  conn: ''
};

$(document).ready(function(){
  $('.pantaila').hide();
  $('#pIzena').show();
  addConnection();

  $('#setName').on("click", function() {
    var name = $('#name').val();
    config.name = name;

    wsSend(name);

    $('#pIzena').hide();
    $('#pTopik').show();
  });

  $('#setTopic').on("click", function() {
    var item = $('#topic').val();
    config.topic = item;
    console.log(config);

    $('#pTopik').hide();
    $('#pZai').show();
  });
})

function wsSend(info) {
  config.conn.send(info);
}

function addConnection() {
  console.log('addConnection');
  config.conn = new WebSocket('ws://localhost:8080');
  config.conn.onopen = function(e) {
      console.log("Connection established!");
  };

  config.conn.onmessage = function(e) {
      console.log(e.data);
  };

}
