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

function generateThumbnail() {
    window.html2canvas([$('#page-content-wrapper')[0]], {
        onrendered: function(canvas) {
            var extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width',300);
            extra_canvas.setAttribute('height',424);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,300,424);
            var dataURL = extra_canvas.toDataURL();
            var img = $(document.createElement('img'));
            img.attr('src', dataURL);
            // insert the thumbnail at the top of the page
           // $('body').prepend(img);
        }
    });
}