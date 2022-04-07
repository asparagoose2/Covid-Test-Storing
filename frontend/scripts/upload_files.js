$("#form").submit(function(e) {
    e.preventDefault();    
    var formData = new FormData(this);
    $.ajax({
        url: API_URL+"/photos/upload",
        type: 'POST',
        data: formData,
        success: function (data) {
            if(data.status) {
                alert("Upload success!");
            } else {
                alert("Upload failed!");
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
});