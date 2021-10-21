// ==UserScript==
// @name         wizer.me gui
// @namespace    wizerme_gui
// @version      5.0
// @author       k3rielit
// @description  kekw like if anyone uses this site
// @iconURL      https://app.wizer.me/images/logo-loader.png
// @match        *://app.wizer.me/preview/*
// @match        *://app.wizer.me/learn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.0.js
// ==/UserScript==

var obj;
fetch("https://app.wizer.me/learn/worksheet/" + window.location.href.split("/")[4]).then(response => response.json()).then(data => obj = data);

$('body').append('<a id="magicb" style="text-decoration: none; position: fixed; z-index: 999; right: 1%; bottom: 0; font-size: 28px; cursor: pointer;">🔮</a>');
document.getElementById('magicb').addEventListener("click", parseData, false);

function parseData() {
    $('.that-magic-element').remove();
    for (var w = 0; w < obj.worksheet.widgets.length; w++) {
        var widget = obj.worksheet.widgets[w];
        switch (widget.name) {

            case "Multiple Choice":
                for (var o = 0; o < widget.data.options.length; o++) {
                    $('.worksheet-content').children().eq(w).find(`p:contains('${$(widget.data.options[o].text).text()}')`).attr("style", widget.data.options[o].hasOwnProperty('checked') && widget.data.options[o].checked ? "color: rgb(136,188,87)" : "");
                }
                break;

            case "Matching":
                var mContent = "";
                for (var o = 0; o < widget.data.pairs.length; o++) {
                    mContent += (`<tr><td style="font-family: Arial, Helvetica, Sans-Serif; text-align: right; width: 48%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${widget.data.pairs[o].target.hasOwnProperty('media') ? '<img src="' + widget.data.pairs[o].target.media.image + '" style="height: 40px; float:right">' : widget.data.pairs[o].target.value}</td><td style="width: 4%; text-align: center; color: black;">&nbsp;---&nbsp;</td><td style="font-family: Arial, Helvetica, Sans-Serif; text-align: left; width: 48%; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${widget.data.pairs[o].match.hasOwnProperty('media') ? '<img src="' + widget.data.pairs[o].match.media.image + '" style="height: 40px; float:left">' : widget.data.pairs[o].match.value}</td></tr>`);
                }
                $('.worksheet-content').children().eq(w).find(widget.data.title.length>0 ? '.question' : '.levelTwoColor-text').append(`<div><table class="that-magic-element" style="font-size: 17px; color: #88bc57; margin-left: auto; margin-right: auto; table-layout: fixed; width: 100%;">${mContent}</table></div>`);
                break;

            case "Sorting":
                var sContent = "<div class='that-magic-element' style='font-size: 17px; color: #88bc57; font-family: Arial, Helvetica, Sans-Serif;'>";
                for (var o = 0; o < widget.data.groups.length; o++) {
                    sContent += `<b>${$(widget.data.groups[o].header.text).text()}: </b>`;
                    for (var i = 0; i < widget.data.groups[o].items.length; i++) {
                        sContent += `${widget.data.groups[o].items[i].hasOwnProperty('media') ? '<img src="' + widget.data.groups[o].items[i].media.image + '" style="height: 50px;">, ' : $(widget.data.groups[o].items[i].text).text() + ', '}`;
                    }
                    sContent += "<br>";
                }
                $('.worksheet-content').children().eq(w).find(widget.data.title.length>0 ? '.question' : '.levelTwoColor-text').append(sContent + "</div>");
                break;

            case "Blanks":
                var element = document.createElement("div");
                element.innerHTML = widget.data.blankText;
                var x = element.getElementsByTagName("wmblank");
                for (var o = 0; o < x.length; o++) {
                    $('.worksheet-content').children().eq(w).find('input').eq(o).attr('placeholder', x[o].innerText);
                }
                break;

            case "Fill On An Image":
                for (var o = 0; o < widget.data.tags.length; o++) {
                    $('.worksheet-content').children().eq(w).find("img.tagging-image").after(`<p style='padding: 3px; border: 1px solid #88bc57; border-radius: 10px; position:absolute; background-color: white; ${widget.data.tags[o].left ? "left" : "right"}: ${widget.data.tags[o].positionX}; ${widget.data.tags[o].top ? "top" : "bottom"}: ${widget.data.tags[o].positionY};'>&nbsp;<br>${widget.data.tags[o].text}</p>`);
                }
                break;

            case "Table":
                for (var o = 0; o < widget.data.tablerows.length; o++) {
                    for (var r = 0; r < widget.data.tablerows[o].cols.length; r++) {
                        if (widget.data.tablerows[o].cols[r].isAnswer) {
                            $('.worksheet-content').children().eq(w).find('.table-cell').eq(o * widget.data.tablerows[o].cols.length + r).prepend(`<div class="that-magic-element" style="position: relative; top: 3%; left: 1%; font-size: 15px; color: #88bc57;">${widget.data.tablerows[o].cols[r].text}</div>`);
                        }
                    }
                }
                break;

            case "Word Search Puzzle":
                var height = widget.data.grid.height;
                var width = widget.data.grid.width;
                var cells = widget.data.grid.cells;
                for (var word of Object.values(widget.data.grid.words)) {
                    for (var row = 0; row < height; row++) {
                        for (var col = 0; col < width; col++) {
                            if (word[0] == cells[row][col].letter) {
                                function searchp(left, right, top, bottom) {
                                    var correctPoints = [];
                                    correctPoints.push([row, col]);
                                    correctPoints.push([(top ? row - 1 : (bottom ? row + 1 : row)), (left ? col - 1 : (right ? col + 1 : col))]);
                                    var allCorrect = true;
                                    for (var letterC = 2; letterC < word.length; letterC++) {
                                        if (col - (left ? letterC : 0) >= 0 && col + (right ? letterC : 0) < width && row - (top ? letterC : 0) >= 0 && row + (bottom ? letterC : 0) < height && cells[top ? row - letterC : (bottom ? row + letterC : row)][left ? col - letterC : (right ? col + letterC : col)].letter == word[letterC]) {
                                            correctPoints.push([(top ? row - letterC : (bottom ? row + letterC : row)), (left ? col - letterC : (right ? col + letterC : col))]);
                                        }
                                        else { allCorrect = false; }
                                    }
                                    if (allCorrect) {
                                        for (var index = 0; index < correctPoints.length; index++) {
                                            $('.worksheet-content').children().eq(w).find('.wordsearch-grid').children().children().eq(correctPoints[index][0] * width + correctPoints[index][1]).attr('style', 'background-color: rgb(136,188,87)');
                                        }
                                    }
                                }
                                if (col - 1 >= 0 && cells[row][col - 1].letter == word[1]) { searchp(true, false, false, false); } // left
                                if (row - 1 >= 0 && col - 1 >= 0 && cells[row - 1][col - 1].letter == word[1]) { searchp(true, false, true, false); } // top-left
                                if (row - 1 >= 0 && cells[row - 1][col].letter == word[1]) { searchp(false, false, true, false); } // top
                                if (row - 1 >= 0 && col + 1 < width && cells[row - 1][col + 1].letter == word[1]) { searchp(false, true, true, false); } // top-right
                                if (col + 1 < width && cells[row][col + 1].letter == word[1]) { searchp(false, true, false, false); } // right
                                if (col + 1 < width && row + 1 < height && cells[row + 1][col + 1].letter == word[1]) { searchp(false, true, false, true); } // bottom-right
                                if (row + 1 < height && cells[row + 1][col].letter == word[1]) { searchp(false, false, false, true); } // bottom
                                if (row + 1 < height && col - 1 >= 0 && cells[row + 1][col - 1].letter == word[1]) { searchp(true, false, false, true); } // bottom-left
                            }
                        }
                    }
                }
                break;
        }
    }
    $('#magicb').text('🔄');
}
