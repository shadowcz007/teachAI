import * as Base from './Base';
import * as DC from './Define-class';

let NUM_CLASSES=1;
let pannel=init();

//调整数据
export function init() {
    const modifyDataPannel = Base.createPannel("pannel");
    
    //标题
    (() => {
        modifyDataPannel.appendChild(
            Base.createTitle("调整数据")
        );
    })();

    //数据增强
    // let agButton = createButton("数据增强");
    // modifyDataPannel.appendChild(agButton);
    // agButton.addEventListener("click", async e => {
    //     e.preventDefault();
    //     let targetImages = [];
    //     let ims = document.querySelectorAll('.images');
    //     for (let index = 0; index < ims.length; index++) {
    //         const im = ims[index];
    //         let className = im.parentElement.querySelector(".input-class-name").value.trim();
    //         Array.from(
    //             im.querySelectorAll(".img-data"),
    //             c => targetImages.push([c, className]));
    //     };
    //     await augmentOne(targetImages);
    // });

    

    //增加一个类别
    let addClassButton = Base.createButton("增加类别");
    modifyDataPannel.appendChild(addClassButton);
    
    addClassButton.addEventListener('click', () => {
        DC.createClassDiv(NUM_CLASSES);
        NUM_CLASSES++;
    });

    //类别容器，放数据集的
    let dataSetDiv = Base.createPannel("data-set-all", 'data-set-all');
    modifyDataPannel.appendChild(dataSetDiv);

    return modifyDataPannel
    // document.body.appendChild(modifyDataPannel);
    // PANNELS.CLASS = modifyDataPannel;
};


export function get(){return pannel;}
