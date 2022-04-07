const API_URL = "http://127.0.0.1:3000";
console.log(API_URL);
$(document).ready(function(e) {
    $.ajax({
        type: "GET",
        url: API_URL+"/publicKey",
        success:  function(data){
            console.log("upload_files.js");
            const publicKey = data.publicKey;
            $("input[name='publicKey']").val(publicKey);
            $("#filesInput").prop('disabled', false); 
        },
        error: function (request, status, error) {
            alert("Could not connect to server");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });
        
});
$("#form").submit(function(e) {
    e.preventDefault();    
    const formData = new FormData(this);
    // const encrypt = new JSEncrypt();
    // encrypt.setPublicKey($('#publicKey').val());
    // encrypt the formData
    // for (var pair of formData.entries()) {
    //     if (pair[0] == "files") {
    //         var files = pair[1];
    //         for (var i = 0; i < files.length; i++) {
    //             var file = files[i];
    //             var fileHash = CryptoJS.SHA256(file).toString();
    //             var encryptedFile = encrypt.encrypt(fileHash);
    //             formData.set(pair[0] + '[' + i + ']', encryptedFile);
    //         }
    //     } 
    // }
    console.log(formData.getAll('reports'));
    $.ajax({
        type: "POST",
        url: API_URL+"/covidTestReport",
        data: formData,
        processData: false,
        contentType: false,
        success:  function(data){
            alert("Files uploaded successfully");
            console.log(data);
        },
        error: function(data){
            alert("Could not connect to server");
            console.log(data);
        }
    });
});
/*
    const file = $('#filesInput')[0].files[0];
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const fileHash = CryptoJS.SHA256(e.target.result).toString();
        formData.append('fileHash', fileHash);
        formData.append('file', file);
        $.ajax({
            type: "POST",
            url: API_URL+"/api/events/" + eventId + "/files",
            data: formData,
            processData: false,
            contentType: false,
            success:  function(data){
                console.log(data);
                alert("File uploaded successfully");
                window.location.href = "index.html";
            },
            error: function(data){
                alert("Could not connect to server");
                console.log(data);
            }
        });
    };
    fileReader.readAsArrayBuffer(file);
});

//     var encrypted = encrypt.encrypt($('#input').val());
//     $.ajax({
//         url: API_URL+"/photos/upload",
//         type: 'POST',
//         data: formData,
//         success: function (data) {
//             if(data.status) {
//                 alert("Upload success!");
//             } else {
//                 alert("Upload failed!");
//             }
//         },
//         cache: false,
//         contentType: false,
//         processData: false
//     });
// });

*/