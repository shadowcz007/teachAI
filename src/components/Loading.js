
export function startLoading(text) {
    let div = document.createElement('div');
    div.id = "loading";
    div.setAttribute("data-time", (new Date()).getTime());
    let loading = document.createElement('div');
    loading.className = "info";
    div.appendChild(loading);
    document.body.appendChild(div);
    setLoadingInfo(text);
};

export function setLoadingInfo(text=null){
    if(!text) return;
    let div = document.body.querySelector("#loading");
    if (!div) return;
    div.querySelector(".info").innerText=text;
}

export function removeLoading() {
    let div = document.body.querySelector("#loading");
    if (!div) return;
    let preTime = parseInt(div.getAttribute("data-time") || 0);
    if ((new Date()).getTime() - preTime > 3000) {
        div.remove();
    } else {
        setTimeout(() => {
            div.remove();
        }, 1000);
    }
};