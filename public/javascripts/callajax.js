$('#savePlayer').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: '/saveplayer',
    type: 'post',
    data: $('#savePlayer').serialize(),
    cache: true,
    success: function (players) {
      console.log('Call Ajax ok');
      console.log(players);
    },
  });
});
$('#player1win').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: '/playerwin1',
    type: 'post',
    data: $('#savePlayer').serialize(),
    cache: true,
    success: function (players) {
      console.log('player 1 win');
    },
  });
});
$('#player2win').submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: '/playerwin2',
    type: 'post',
    data: $('#savePlayer').serialize(),
    cache: true,
    success: function (players) {
      console.log('player 2 win');
    },
  });
});
