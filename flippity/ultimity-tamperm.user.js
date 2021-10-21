// ==UserScript==
// @name         ultimity.js
// @namespace    ultimity.js
// @version      1.0
// @author       k3rielit
// @description  yeeeet
// @iconURL      https://www.flippity.net/images/favicon-32.png
// @match        *://*.flippity.net/sh.php*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

// adding tailwind (in the discouraged way), because why not
$('head').append('<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">');

// create elements, listeners, and a timer that shows time (look at this junk)
$('body').prepend('<div style="padding: 3px;"> Seconds: <span id="spanSeconds"></span> <button style="border: 1px solid black;" id="resetSecs"> Reset </button> <input type="number" id="nn1" value="0"> <button style="border: 1px solid black;" id="setSec"> Set seconds </button> <button style="border: 1px solid black;" id="fillansw"> Fill answers </button> </div>')
document.getElementById('resetSecs').addEventListener("click",() => secs=0 ,false);
document.getElementById('setSec').addEventListener("click",() => secs=document.getElementById('nn1').value ,false);
document.getElementById('fillansw').addEventListener("click",function() { for(let i in data) document.getElementById('a'+i).value=data[i][2]} ,false);
setInterval(() => $('#spanSeconds').text(`${Math.floor(secs/3600)}:${Math.floor((secs-Math.floor(secs/3600)*3600)/60)}:${secs%60}`),100);

// deleting, making visible, and styling elements (yes after tailwind I still do these)
$('#instructions').remove();
$('tr.noPrint').remove();
$('#doneScreen').attr('style','');
$('#done').remove();
$('#emailForm').append('<input type="submit" id="sssubmit">');

$('#formSubmitEmail').attr('placeholder','SubmitEmail (recipient)');
$('#formSubmitEmail').attr('type','text');

$('#formStudentName').attr('placeholder','StudentName (in title after "EmailSubj: ")');
$('#formStudentName').attr('type','text');

$('#formEmailText').attr('placeholder','EmailText (does nothing)');   // it actually does, it shows you this text after the test is submitted on the test page
$('#formEmailText').attr('type','text');

$('#formEmailSubj').attr('placeholder','EmailSubj (in title before ": StudentName")');
$('#formEmailSubj').attr('type','text');

$('#formHuntResults').attr('placeholder','HuntResults (actual email content)');
$('#formHuntResults').attr('type','text');

$('input').attr('style','width: 400px; text-align: center; border: 1px solid black;');
$('#sssubmit').css('cursor','pointer');

/* DETAILS:

You can use the generateTable() to get the results in a nice HTML presentation, or generateResults() to get the stock test result.

$.get( "<HTML LINK>", function( data ) {
    document.getElementById("formHuntResults").value = data;            // set email content with external HTML (with jquery xd)
});

document.getElementById("formSubmitEmail").value = "<EMAIL>";
document.getElementById("formEmailText").value = "";
document.getElementById("formEmailSubj").value = "<EMAIL SUBJECT>";    // manually set other important email fields
document.getElementById("emailForm").submit();

   email (1 minute delay after submit):
   email title:   "EmailSubj: StudentName"                             // email "preview"
   email content: "HuntResults"

*/
