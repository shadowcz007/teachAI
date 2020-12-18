import * as Base from './Base';

let pannel=createGlobalInfo();

//全局的消息
function createGlobalInfo() {
    let div=Base.createPannel("menu-bar");
    div.id='global-info';
    let globalInfoText = Base.createInfo("hello world!!");
    globalInfoText.style.display="inline";
    div.appendChild(globalInfoText);
    return div
}

export function init(){
    return pannel
}

export function setGlobalInfo(text){
    pannel.classList.remove("hidden");
    pannel.querySelector('.info').innerText=text;
};

export function setGlobalAction(text,fun){
    if(pannel.querySelector("button")) pannel.querySelector("button").remove();
    let action=Base.createButton(text);
    action.addEventListener("click",fun);
    pannel.appendChild(action);
};

export function setMessage(img,text){
    // console.log(img,text)
    let html=`<img src="${img.src}" />
    <div>${text}</div>`;
    let div=Base.createPannel('message');
    div.innerHTML=html;
    pannel.appendChild(div);
}
