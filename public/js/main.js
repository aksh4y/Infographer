/**
 * Created by Akshay on 4/14/2017.
 */

/* $('#account').on('click', function () {
 var element = document.getElementById('account');
 if(element.classList.contains('open'))
 $('#account').removeClass('open'); // Closes the dropdown
 else
 $('#account').addClass('open'); // Opens the dropdown
 });*/

function toggleSidepanel(ele) {
    $("#sidebar-wrapper2").show();
    $("#spy > ul > li").removeClass('active');
    $(this).addClass('active');
    $("#spy2 > div").hide();
    $(ele).show();
}

// Highlight widget
$('#page-content-wrapper').on('mousedown', '.widget', function() {
    $(".widget").removeClass('highlight');
    $(this).addClass('highlight');

});

// Remove highlights
function removeHighlights() {
    $("#canvas").find(".highlight").removeClass("highlight");
}


/*$( function() {
 $(".as-img").on('click', function() {
 $(this)
 .clone()
 .addClass('widget')
 .appendTo('#canvas')
 .draggable();
 });
 });*/

// Prevent enter key
$('#canvas').on('keydown', function(e) {
    //Prevent insertion of a return
    if (e.which === 13 && e.shiftKey === false) {
        alert("Try pressing Shift + Enter");
        return false;
    }
    if (e.which === 46)
    {}
});

// Prevent enter key
$('#infoTitle').on('keydown', function(e) {
    //Prevent insertion of a return
    if (e.which == 13 && e.shiftKey == false) {
        return false;
    }
});

// Remove highlights when clicked outside of canvas
$("body").on('click', function (evt) {
    var container = $("#canvas");
    if (!container.is(evt.target) // if the target of the click isn't the container...
        && container.has(evt.target).length === 0) { // ... nor a descendant of the container
        removeHighlights();
    }
});

// Make all components draggable
$("#canvas").on("mouseover", ".draggable", function() {
    if(!$(this).is(":ui-draggable"))
        $(this).draggable({
            cursor: "move"
        });
});

// Drag and edit operations
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


$(function() {
    $('#cp4').colorpicker().on('changeColor', function(e) {
        $('#page-content-wrapper').css('background-color', e.color.toString(
            'rgba'));
    });
});