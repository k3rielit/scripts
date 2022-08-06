const uid = 'k3rielit';
let starred = [];
let lists = {};
let listCount = 0;
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

getStarredRepos(`https://github.com/${uid}?tab=stars`);
function getStarredRepos(url) {
    fetch(url).then(raw => raw.text()).then(data => {
        const page = new DOMParser().parseFromString(data, 'text/html');
        starred = starred.concat([...page.querySelectorAll('#user-starred-repos > div > div > div > div.d-inline-block.mb-1 > h3 > a')].map(m => m.href));
        const nextPage = page.querySelector("#user-starred-repos > div > div > div.paginate-container > div > :nth-child(2)");
        if(nextPage && nextPage.href) getStarredRepos(nextPage.href);
        else {
            [...page.querySelectorAll("#profile-lists-container > * a")].map(m => m.href).forEach(e => {
                lists[e.split('/').last()] = [];
                getReposFromList(e);
            });
            if(Object.keys(lists).length==0) finalize();
        }
    });
}

function getReposFromList(url) {
    fetch(url).then(raw => raw.text()).then(data => {
        const page = new DOMParser().parseFromString(data, 'text/html');
        [...page.querySelectorAll("#user-list-repositories > div > div.d-inline-block.mb-1 > h3 > a")].map(m => m.href).forEach(item => {
            lists[url.split('/').last()].push(item);
            starred.splice(starred.indexOf(item),1);
        });
        listCount++;
        if(listCount==Object.keys(lists).length) finalize();
    });
}

function finalize() {
    console.log('Done');
    const container = document.querySelector("body > div.application-main");
    container.style.textAlign = 'center';
    let content = '';
    for (const key in lists) {
        content += `<h2>${key} (${lists[key].length})</h2><table style="margin:auto;">`;
        for (let i = 0; i < lists[key].length; i += 5) {
            content += `<tr>${lists[key].slice(i, i + 5).map(m => `<td style="padding:5px;"><a href="${m}">${m.split('/').last()}</a></td>`).join()}</tr>`;
        }
        content += '</table><br>';
    }
    content += `<h2>unlisted (${starred.length})</h2><table style="margin:auto;">`;
    for (let i = 0; i < starred.length; i += 5) {
        content += `<tr>${starred.slice(i, i + 5).map(m => `<td style="padding:5px;"><a href="${m}">${m.split('/').last()}</a></td>`).join('&nbsp;'.repeat(5))}</tr>`;
    }
    container.innerHTML = content+'</table>';
}

// Commands
function isItemOnList(item, list) {
    return lists[list].filter(f => f==item || f==item.split('/').last() || f.split('/').last()==item || f.split('/').last()==item.split('/').last()).length>0;
}
function IsItemUnlisted(item) {
    return starred.filter(f => f==item || f==item.split('/').last() || f.split('/').last()==item || f.split('/').last()==item.split('/').last()).length>0;
}
function IsItemListed(item) {
    for (const key in lists) {
        if(lists[key].filter(f => f==item || f==item.split('/').last() || f.split('/').last()==item || f.split('/').last()==item.split('/').last()).length>0) return true;
    }
    return false;
}
function ItemsOnList(list) {
    return lists[list];
}
function ItemsNotOnList(list) {
    let result = [...starred];
    for (const key in lists) {
        result = result.concat(lists[key].filter(f => !lists[list].includes(f)));
    }
    return result;
}
