/**
 * Created by Akshay on 4/20/2017.
 */
$('#updateWidgetBtn').hide();

function validateInput(event) {
    if ($.trim($('#upload').val()).length) {
        event.submit();
    }
    else {
        event.preventDefault();
        window.alert("Please choose a file");
    }
}

$('li > a').click(function() {
    $('li').removeClass();
    $(this).parent().addClass('active');
});

$(init);
function init() {
    $('#tab2Content').hide();
    $('#tab3Content').hide();
    $('#tab1').parent().addClass('active');
}

$('#tab1').click(activateTab1);
$('#tab2').click(activateTab2);
$('#tab3').click(activateTab3);

function activateTab1() {
    $('#tab2Content').hide();
    $('#tab3Content').hide();
    $('#tab1Content').show();
}

function activateTab2() {
    $('#tab1Content').hide();
    $('#tab3Content').hide();
    $('#tab2Content').show();
}

function activateTab3() {
    $('#tab1Content').hide();
    $('#tab2Content').hide();
    $('#tab3Content').show();
}
