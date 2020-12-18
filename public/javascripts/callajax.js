let players = (data)=>{
  // Maybe clean 'data' here
  console.log('data', data);
  return data;
}

$('#savePlayer').submit(function(e){
  e.preventDefault();
  $.ajax({
      url: '/saveplayer',
      type: 'post',
      data:$('#savePlayer').serialize(),
      cache:true,
      success:players
  });
});