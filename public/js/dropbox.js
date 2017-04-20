/**
 * Created by Akshay on 4/14/2017.
 */

var html = $('#page-content-wrapper').html();
var download = new Blob([html], {
    "type": "text/html"
});

var downloadUrl = window.URL.createObjectURL(download);

var options = {
    files: [
        // You can specify up to 100 files.
        {'url': downloadUrl}
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
$(button).attr('disabled', 'true');
$(button).on('click', function (e) {
    window.alert("Dropbox API is currently under maintenance.\nThis feature might be removed permanently");
});
$(button).css('cursor', 'not-allowed');
document.getElementById("dbSaver").appendChild(button);