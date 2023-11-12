// ==UserScript==
// @name         FitgirlScrape
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       k3rielit
// @match        *://fitgirl-repacks.site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fitgirl-repacks.site
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function parseRepacks() {
        let repackNodes = document.querySelectorAll('article.type-post:not(.category-uncategorized)');
        let repackList = [];
        repackNodes.forEach((article) => {
            let repackData = {
                post: {},
                repack: {
                    categories: [],
                    downloads: [],
                    features: [],
                },
                game: {},
            };
            // Post information
            repackData.post.id = article.getAttribute('id');
            repackData.post.title = article.querySelector('header.entry-header h1.entry-title a').innerText;
            repackData.post.page = article.querySelector('header.entry-header h1.entry-title a').href;
            // Repack information
            repackData.repack.id = article.querySelector('div.entry-content h3 span').innerText.replace('#', '');
            article.querySelectorAll('div.entry-content ul').forEach((listNode, index) => {
                switch(index) {
                    case 0:
                        // Download links
                        listNode.querySelectorAll('a').forEach((downloadNode) => {
                            repackData.repack.downloads.push({
                                name: downloadNode.innerText,
                                url: downloadNode.href,
                            });
                        })
                        break;
                    case 1:
                        // Repack features
                        listNode.querySelectorAll('li').forEach((repackFeatureNode) => {
                            repackData.repack.features.push(repackFeatureNode.innerText);
                        });
                        break;
                }
            });
            article.querySelectorAll('header.entry-header div.entry-meta span.cat-links a').forEach((categoryNode) => {
                repackData.repack.categories.push({
                    name: categoryNode.innerText,
                    url: categoryNode.href
                });
            });
            // Game information
            repackData.game.title = article.querySelector('div.entry-content h3 strong').innerText;
            repackData.game.url = article.querySelector('div.entry-content p a').href;
            repackData.game.metadata = article.querySelector('div.entry-content p').innerText.split('\n').filter(metadata => metadata);
            repackData.game.description = article.querySelector('div.su-spoiler-content').innerText;
            // Push the completed repack to the container
            repackList.push(repackData);
        });
        return repackList;
    }

    // Observe and parse repack data
    const observer = new MutationObserver(() => {
        const repacks = parseRepacks();
        console.log(repacks);
    });
    // Start the observer
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
})();