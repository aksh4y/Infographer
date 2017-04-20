/**
 * Created by Akshay on 4/13/2017.
 */

// Print the canvas
function printCanvas() {
    console.log("print canvas");
    var pdf = new jsPDF('p', 'mm', 'a4');
    var options = {
        background: '#fff'
    };
    pdf.addHTML($('#page-content-wrapper')[0], options, function () {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
    });
}

// Download the canvas
function downloadInfographic() {
    var pdf = new jsPDF('p', 'mm', 'a4');
    var options = {
        background: '#fff'
    };
    pdf.addHTML($('#page-content-wrapper')[0], options, function () {
        pdf.save('Infograph.pdf');
    });
}

function generateImage() {
    window.html2canvas([$('#page-content-wrapper')[0]], {
        onrendered: function(canvas) {
            var extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width',2480);
            extra_canvas.setAttribute('height',3508);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,2480,3508);
            var dataURL = extra_canvas.toDataURL();
            var img = $(document.createElement('img'));
            img.attr('src', dataURL);
            var base64image = extra_canvas.toDataURL("image/png");
            $(img).addClass('img-responsive');
            // Open the image in a new window
            $('#page-content-wrapper').css('background-image', 'url('+img+')');
            //window.open(base64image , "_blank");
            // insert the thumbnail at the top of the page
           // $('body').prepend(img);
        }
    });
}