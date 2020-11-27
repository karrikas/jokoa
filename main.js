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
  let ws = new Promise((resolve) => {
    config.conn = new WebSocket('ws://localhost:8080');
    config.conn.onopen = function(e) {
        console.log("Connection established!");
        resolve(true);
    };

    config.conn.onmessage = function(e) {
        console.log(e.data);
    };
  });

  ws.then(() => {
    var js = {action: 'SetName', data: {name: 'my name'}};
    wsSend(JSON.stringify(js));

    var js = {action: 'RoonCreate', data: {room: 'XYUZ'}};
    wsSend(JSON.stringify(js));
  })
}
