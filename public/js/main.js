/**
 * Created by Akshay on 4/14/2017.
 */
var options = {
    files: [
        // You can specify up to 100 files.
        {'url': 'http://sadarangani-akshay-webdev.herokuapp.com/uploads/b2dea34514ec5f1ba2c8d31fa1081779',
            'filename': 'Infographic.jpg'}
    ],

    success: function () {
        // Indicate to the user that the files have been saved.
        alert("Success! Files saved to your Dropbox.");
    },

    progress: function (progress) {},

    // Cancel is called if the user presses the Cancel button or closes the Saver.
    cancel: function () {},

    // Error is called in the event of an unexpected response from the AServer
    // hosting the files, such as not being able to find a file. This callback is
    // also called if there is an error on Dropbox or if the user is over quota.
    error: function (errorMessage) {}
};
var button = Dropbox.createSaveButton(options);
$(button).css('color', 'black');
document.getElementById("dbSaver").appendChild(button);



$('#account').on('click', function () {
    var element = document.getElementById('account');
    if(element.classList.contains('open'))
        $('#account').removeClass('open'); // Closes the dropdown
    else
        $('#account').addClass('open'); // Opens the dropdown
});


function toggleSidepanel(ele) {
    $(this).addClass('active');
    $("#spy2 > div").hide();
    $(ele).show();
}

$(".widget").on('mousedown', function () {
    console.log("should highlgh");
    $("#canvas > div").removeClass('highlight');
    $(this).addClass('highlight');
});

function hideAll() {
    //$('#sidebar-wrapper2').hide();
    var element = document.getElementById('account');
    if(element.classList.contains('open'))
        $('#account').removeClass('open'); // Opens the dropdown
}

function removeHighlights() {
    $("#canvas > div").removeClass('highlight');
}

$( function() {
    /*        $("#canvas > div").draggable();*/
    $(".as-img").on('click', function() {
        $(this).clone().appendTo('#canvas').draggable();
    });
} );

$('#canvas').on('keydown', function(e) {
    //Prevent insertion of a return
    if (e.which == 13 && e.shiftKey == false) {
        return false;
    }
});

$("body").on('click', function (evt) {
    if(evt.target.id == "menu")
        return;
    hideAll();
});

$("#canvas > div").draggable();
$("#canvas")
    .on('click', '.row', function(){
        if ( $(this).is('.ui-draggable-dragging') ) {
            return;
        }
        $(this).draggable( "option", "disabled", true );
        $(this).attr('contenteditable','true');
    })
    .on('blur', '.row', function(){
        $(this).draggable( 'option', 'disabled', false);
        $(this).attr('contenteditable','false');
    });

/*$( "#canvas > div" ).on('click', function() {
 $('#sidebar-wrapper2').show();
 });*/

$('#canvas > div').on('drag', function() {
    $('#x-pos').val($(this).offset().top);
    $('#y-pos').val($(this).offset().left);
    $('#width').val($(this).width());
    $('#height').val($(this).height());
    $('#element').val($(this).attr('id'));
});


$(function() {
    $('#cp4').colorpicker().on('changeColor', function(e) {
        $('#page-content-wrapper').css('background-color', e.color.toString(
            'rgba'));
    });
});