import * as Base from './Base';

//菜单栏
export function displayMenu(menus,actions){
    // let menus=["来自数据集","从定义分类开始"];
    let dom=document.createDocumentFragment();
    menus.forEach((m,i)=>{
        let div=Base.createPannel("menu-bar");
        div.classList.add("more-menu");
        div.innerText=m;
        div.style=`top:12px;
        right:${24+120*i}px`;
        // console.log(div);
        dom.appendChild(div);
        div.addEventListener("click",actions[i]);
    });
    
    document.body.appendChild(dom);
}