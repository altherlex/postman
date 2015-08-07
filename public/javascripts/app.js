$(function() {
    $('.icon-panel').click(function(){ panel_control(this); });
});

function panel_control(elem){
    var panel_body = $(elem).closest('.panel').children('.panel-body')
    if (panel_body.is(":visible")){
        panel_body.hide('fade');
        $(elem).children('span').removeClass('glyphicon-minus').addClass('glyphicon-plus');
    }else{
        panel_body.removeClass('hidden').show('fade');
        $(elem).children('span').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
};