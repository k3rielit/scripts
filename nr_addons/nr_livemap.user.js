// ==UserScript==
// @name         NR Livemap Addons
// @namespace    NR_Addons
// @version      1.0
// @description  A search feature for the NR livemap.
// @author       k3rielit / hrzn
// @match        *://livemap.nightriderz.world/*
// @icon         https://cdn.nightriderz.world/images/website/favicon.png
// @grant        none
// @require      https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Thanks to BrockA https://gist.github.com/BrockA/2625891');
    waitForKeyElements("div.race", run);
    function run() {
        let newElem = $(".settings").clone();
        newElem.attr('style','right: 158px; width: 256px; background: url(https://i.kek.sh/B5fwbm4eZw2.png); ');
        newElem.attr('id','search-container');
        newElem.find('.options').text('SEARCH');
        newElem.children().eq(1).html(`<input type="text" style="width:239px; outline:none; font-family: 'NFSWSubHeadline';" class="showraces" id="search-tbx">`);
        newElem.appendTo(".move");
        $('#search-tbx').on('input', function() {
            $('.race').children().css('border-radius','5px');
            //console.log(this.value);
            for(let _i = 0; _i<$('.race').children().length; _i++) {
                if($('.race').children().eq(_i).attr('title').toLowerCase().startsWith(this.value.toLowerCase())) {
                    $('.race').children().eq(_i).css('display','block');
                    $('.race').children().eq(_i).css('box-shadow',this.value.length>0 ? 'inset 25px 0px 20px -16px #6BEA0E' : 'none');
                }
                else {
                    $('.race').children().eq(_i).css('display','none');
                    $('.race').children().eq(_i).css('box-shadow','none');
                }
            }
        });
    }
})();