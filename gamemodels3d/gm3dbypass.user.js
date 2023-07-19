// ==UserScript==
// @name         gamemodels3d bypass
// @namespace    k3rielit.freerobux
// @version      0.2
// @description  try to take over the world!
// @author       k3rielit
// @match        *://*.gamemodels3d.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamemodels3d.com
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/k3rielit/scripts/raw/main/gamemodels3d/gm3dbypass.user.js
// @downloadURL  https://github.com/k3rielit/scripts/raw/main/gamemodels3d/gm3dbypass.user.js
// ==/UserScript==

(function() {
    'use strict';

    function loadScript(type, src, stringContent) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.onload = function () {
                console.log(`[loadScript] Success: ${this.type} @ ${this.src}`);
                resolve();
            };
            script.onerror = function () {
                console.error(`[loadScript] Error: ${this.type} @ ${this.src}`);
                reject();
            };
            if(type) script.type = type;
            if(src) script.src = src;
            if(stringContent) script.text = stringContent;
            document.body.appendChild(script);
            console.log(script);
        });
    }

    function injectExporter() {
        window.VIEWER3D.Exporter = class Exporter {
            constructor() {}
            parse(model, format, name) {
                console.log(`[VIEWER3D.Exporter] ${name}.${format}`);
                console.log(model);
                let exporter;
                const stlOptions = { binary: true };
                switch(format) {

                    case 'drc':
                        exporter = new window.DRACOExporter(); // never used, here for future updates
                        saveFile(`${name}.${format}`, exporter.parse(model), 'application/octet-stream');
                        break;

                    case 'gltf':
                        exporter = new window.GLTFExporter();
                        exporter.parse(
                            model,
                            (parsedModel) => {console.log(parsedModel); saveFile(`${name}.${format}`, JSON.stringify(parsedModel), 'application/json')},
                            exportErrorHandler
                        );
                        break;

                    case 'obj':
                        exporter = new window.OBJExporter();
                        saveFile(`${name}.${format}`, exporter.parse(model), 'application/octet-stream');
                        break;

                    case 'ply':
                        exporter = new window.PLYExporter(); // never used, here for future updates
                        saveFile(`${name}.${format}`, exporter.parse(model), 'application/octet-stream');
                        break;

                    case 'stl':
                        exporter = new window.STLExporter();
                        saveFile(`${name}.${format}`, exporter.parse(model, stlOptions), 'application/octet-stream');
                        break;

                    default:
                        console.warn(`[Exporter] Unknown format: ${format}`);
                        break;
                }

            }
        }
    }

    function exportErrorHandler(error) {
        console.error(`[Exporter] Error: ${error}`);
    }

    function saveFile (filename, content, mimeType) {
        console.log('saving xd');
        const blob = new Blob([content], {type: mimeType});
        if(window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else{
            const elem = window.document.createElement('a');
            elem.style.display = "none";
            elem.href = window.URL.createObjectURL(blob, { oneTimeOnly: true });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    function downloadGltf(modelObject, fileName) {
        var dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(modelObject));
        var downloadNode = document.createElement('a');
        downloadNode.setAttribute('href', dataString);
        downloadNode.setAttribute('download', fileName);
        document.body.appendChild(downloadNode);
        downloadNode.click();
        downloadNode.remove();
    }

    // Inject three.js importmap and exporter addons
    loadScript('importmap',null,`
    {
        "imports": {
            "three": "https://unpkg.com/three@0.154.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.154.0/examples/jsm/"
        }
    }
    `);

    loadScript('module',null,`
    import { DRACOExporter } from 'three/addons/exporters/DRACOExporter.js';
    import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
    import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
    import { PLYExporter } from 'three/addons/exporters/PLYExporter.js';
    import { STLExporter } from 'three/addons/exporters/STLExporter.js';
    window.DRACOExporter = DRACOExporter;
    window.GLTFExporter = GLTFExporter;
    window.OBJExporter = OBJExporter;
    window.PLYExporter = PLYExporter;
    window.STLExporter = STLExporter;
    `);

    // The 3d viewer only appears after navigating to its tab, wait for that, and inject the exporter
    const downloadSelector = '#viewer3dContainer > div.viewer3d_controlPanel > div.right > img:nth-child(2)';
    if (document.querySelector(downloadSelector)) {
        console.log(document.querySelector(downloadSelector));
        injectExporter();
    }
    const observer = new MutationObserver((mutationList, observer) => {
        if (document.querySelector(downloadSelector)) {
            console.log(document.querySelector(downloadSelector));
            observer.disconnect();
            injectExporter();
        }
    });
    observer.observe(document.body, {
        attributes: true, childList: true, subtree: true
    });

})();