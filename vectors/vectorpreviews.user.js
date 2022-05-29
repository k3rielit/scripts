// ==UserScript==
// @name         VectorPreviews
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Loads other images on the preview pages and provide mirror links.
// @author       k3rielit
// @match        *://*.vector-templates.com/*
// @match        *://*.the-blueprints.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vector-templates.com
// @grant        none
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/vectors/vectorpreviews.user.js
// ==/UserScript==

(function() {
    'use strict';
    // Constants
    const _nums = '0123456789';
    const _year = new Date().getFullYear();
    const _previewTemplate = `
    <div style="box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3); margin: 10px;">
        <a href="%src%" target="_blank" style="text-decoration:none; color:black;" download>
            <p style="position:absolute; background-color:rgba(220,220,220,0.5); backdrop-filter:blur(3px); padding:3px;">%title% [Download]</p>
        </a>
        <a href="%src%" target="_blank">
            <img src="%src%" style="max-width:100%; cursor:pointer;" onerror="null;this.parentNode.parentNode.remove();">
        </a>
    </div>`;
    // Utils
    const VUtils = {
        extractNum(str,autoStop = true) {
            let result = '';
            for(let c of str) {
                if(result.length>0 && autoStop && !_nums.includes(c)) return result;
                result += _nums.includes(c) ? c : '';
            }
            return result;
        },
        getVectorData({id,name,years}) {
            let data = {
                id,
                name,
                years,
                previews: [
                    {path:`https://www.vector-templates.com/modules/templates/preview-wm/${id}-wm.jpg`,               htmltext:`Sharp ~1055x716`},
                    {path:`https://www.the-blueprints.com/modules/vectordrawings/preview-wm/${name}.jpg`,             htmltext:`Blurry ~1280x866`},
                    {path:`https://www.the-blueprints.com/modules/vectordrawings/preview-wm/${name}_${years[0]}.jpg`, htmltext:`Blurry ~1280x866`},
                    {path:`https://www.the-blueprints.com/modules/vectordrawings/preview-wm/${name}_${years[1]}.jpg`, htmltext:`Blurry ~1280x866`},
                    {path:`https://www.vector-templates.com/modules/templates/preview/${id}-mid-wm.jpg`,              htmltext:`~500x338`},
                    {path:`https://www.the-blueprints.com/modules/vectordrawings/preview/${id}-mid.jpg`,              htmltext:`~400x271`},
                    {path:`https://www.vector-templates.com/modules/templates/preview/${id}-thmb.jpg`,                htmltext:`~255x159`},
                ],
                previews_backup: [],
                pages: [
                    `https://www.the-blueprints.com/vectordrawings/show/${id}/${name}/`,
                    `https://www.the-blueprints.com/vectordrawings/show/${id}`,
                    `https://www.vector-templates.com/templates/show/${name}/${id}/`,
                ],
            };
            for(let tempYear = years[0]+1; tempYear < years[1]; tempYear++) {
                data.previews_backup.push({path:`https://www.the-blueprints.com/modules/vectordrawings/preview-wm/${name}_${tempYear}.jpg`, htmltext:'Blurry ~1280x866'});
            }
            data.previews.map(pre => pre.htmltext = _previewTemplate.replaceAll('%title%',pre.htmltext).replaceAll('%src%',pre.path));
            data.previews_backup.map(pre => pre.htmltext = _previewTemplate.replaceAll('%title%',pre.htmltext).replaceAll('%src%',pre.path));
            return data;
        },
        genElem(tag,attrs,classList,id,innerHTML) {              // tag:string   attrs:object                 classList:[]    id:string   innerHTML:string
            let elem = document.createElement(tag);              // 'div'        [['attr','val'],['a','v']]   ['col','row']   'frame'     '<p>kekw</p>'
            attrs.forEach(attr => {
                if(attr.length==2 && !elem.hasAttribute(attr[0])) elem.setAttribute(attr[0],attr[1]);
            });
            classList.forEach(className => {
                if(className.length>0 && !elem.classList.contains(className)) elem.classList.add(className);
            });
            if(!elem.id && id && id.length>0) elem.id = id;
            elem.innerHTML = innerHTML;
            return elem;
        },
    }
    // Logic
    const pages = {

        "vector-templates.com/templates/show/": () => {
            const path = location.pathname.split('/').filter(f => f.length>0);
            const metadata = {
                id: path[3],
                name: path.length>2 ? path[2] : document.querySelector('.VectorShowTitle').innerText.toLowerCase().replaceAll(' ','_'),
                years: document.querySelector('.VectorShowInfo > table > tbody > tr > td:nth-child(2)').innerText.replaceAll('present',_year).split('-').map(m => m.trim()).concat([_year,_year]).slice(0,2).map(m2 => parseInt(m2)),
            };
            const data = VUtils.getVectorData(metadata);
            console.log(data);
            const previewContainer = document.querySelector('.VectorShowPreview');
            previewContainer.innerHTML = '<p style="text-align:center;">Clicking the image opens it on a new tab.</p>'+data.previews.map(p => p.htmltext).join('\n');
            document.querySelector('.VectorShowInfo > table > tbody').insertBefore(VUtils.genElem('tr',[],[],null,`<td><strong>Mirror(s)</strong></td><td><a href="${data.pages[0]}" target="_blank">the-blueprints.com</a><br><a href="${data.pages[1]}" target="_blank">the-blueprints.com (2)</a></td>`), document.querySelectorAll('.VectorShowInfo > table > tbody > tr')[2]);
        },

        "the-blueprints.com/vectordrawings/show/": () => {
            const path = location.pathname.split('/').filter(f => f.length>0);
            const metadata = {
                id: path[2],
                name: path.length>3 ? path[3] : document.querySelector('.MainContainer > h1').innerText.toLowerCase().replaceAll(' ','_'),
                years: document.querySelector('.VectorInfo > tbody > tr > td:nth-child(2)').innerText.replaceAll('present',_year).split('-').map(m => m.trim()).concat([_year,_year]).slice(0,2).map(m2 => parseInt(m2)),
            };
            const data = VUtils.getVectorData(metadata);
            console.log(data);
            const previewContainer = document.querySelector('#PreviewContainer');
            previewContainer.innerHTML = '<p style="text-align:center;">Clicking the image opens it on a new tab.</p>'+data.previews.map(p => p.htmltext).join('\n');
            document.querySelector('.VectorInfo > tbody').insertBefore(VUtils.genElem('tr',[],[],null,`<td><strong>Mirror(s)</strong></td><td><a href="${data.pages[2]}" target="_blank">vector-templates.com</a></td>`), document.querySelectorAll('.VectorInfo > tbody > tr')[1]);
        },

    }
    Object.keys(pages).forEach(key => {
        if(location.href.includes(key)) {
            pages[key]();
            return;
        }
    });
})();