const API_URL = "http://34.246.55.129";
console.log(API_URL);
$(document).ready(function(e) {
    $.ajax({
        type: "GET",
        url: API_URL+"/publicKey",
        success:  function(data){
            console.log("upload_files.js");
            let publicKey = data.publicKey;
            publicKey = `-----BEGIN PUBLIC KEY-----
            MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
            FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
            xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
            gwQco1KRMDSmXSMkDwIDAQAB
            -----END PUBLIC KEY-----`;
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
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey($('#publicKey').val());
    // encrypt the formData
    let i = 0;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileHash = CryptoJS.SHA256(e.target.result).toString();
        console.log(fileHash);
        encrypted = encrypt.encrypt(fileHash);
        console.log(encrypted);
        formData.set('file'+i, encrypted);
        i++;
        if(i < $('#filesInput')[0].files.length) {
            reader.readAsText($('#filesInput')[0].files[i]);
        } else {
            $.ajax({
                type: "POST",
                url: API_URL+"/covidTestReport",
                data: formData,
                processData: false,
                contentType: false,
                success:  function(data){
                    console.log(data);
                    alert("Files uploaded successfully");
                },
                error: function (request, status, error) {
                    alert("Could not connect to server");
                    console.log(request);
                    console.log(status);
                    console.log(error);
                }
            });
        }
    }
    reader.readAsText($('#filesInput')[0].files[i]);
});
    /*
    for (var pair of formData.entries()) {
        if (pair[0] == "reports") {
            var file = pair[1];
            console.log(file);
            FileReader.readAsText(file);
            var fileHash = CryptoJS.SHA256(file).toString();
            console.log(fileHash);
            var encryptedFile = encrypt.encrypt(fileHash);
            formData.set(pair[0] + '[' + i++ + ']', encryptedFile);
        } 
    }
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