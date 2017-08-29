$(".grid-item").click(function(){
    $(".photo-info").css("display", "flex").hide().fadeIn(150);
});
$(".close-info").click(function(){
    $(".photo-info").fadeOut(150);
});