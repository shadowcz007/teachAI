//工作流
import * as Base from './components/Base';
import * as ui from './ui';

import * as model from './model';

//默认
export function init() {

    //面板隐藏
    for (const key in ui.PANNELS) {
        const p = ui.PANNELS[key];
        p.classList.add("hidden");
    };

    //重设菜单
    Array.from(document.querySelectorAll(".more-menu"), m => {
        m.remove();
    });

    if (model.loadLocalModel()) {
        // console.log("===")
        //console.log(model.knn.classExampleCount);
        ui.setModelInfo();

        ui.initClassDiv();
        // for (const key in model.knn.classExampleCount) {
        //     ui.createClassDiv(null,key);
        // };

        ui.setGlobalInfo("助手模式");
        ui.setGlobalAction("设置", () => {

            defineModify('设置');

            ui.setGlobalAction("返回", () => {
                init();
            });
            ui.displayMenu(
                ["来自数据集", "从定义概念开始"], [() => {
                        defineFromDataset("来自数据集");
                        ui.initClassDiv();
                        model.reset();
                        ui.setModelInfo("");
                        ui.isCanTrain(true);
                    },
                    () => {
                        defineClass("从定义概念开始");
                        ui.initClassDiv();
                        model.reset();
                        ui.setModelInfo("");
                        ui.isCanTrain(true);
                    }
                ]);
        });
    } else {
        defineFromDataset("训练模式-数据集");
    }

}

function baseDefine(title, titles, flow) {
    if (document.querySelector(".flow")) document.querySelector(".flow").remove();
    ui.setGlobalInfo(title);
    document.body.classList.add("scroll-false");

    Array.from(flow, (f, i) => {
        f.querySelector('.title').innerText = titles[i];
        f.classList.remove("hidden");
    });

    let div = Base.createPannel("flow");
    Array.from(flow, f => div.appendChild(f));
    document.body.appendChild(div);
}

//来自数据集
export function defineFromDataset(title) {
    baseDefine(title, ["导入数据集", "数据集情况", "训练模型", "验证集"], [ui.PANNELS.DATA, ui.PANNELS.INFO, ui.PANNELS.MODEL, ui.PANNELS.VAL_FROM_DATASET, ]);
    ui.isCanTrain(true);
}

//设定类别
export function defineClass(title) {
    baseDefine(title, ["定义概念", "模型", "验证模型，通过摄像头", "验证模型，通过图片"], [ui.PANNELS.CLASS, ui.PANNELS.MODEL, ui.PANNELS.VAL_FROM_VIDEO, ui.PANNELS.VAL_FROM_IMAGE]);
}

//调整模型
export function defineModify(title) {
    baseDefine(title, [
        "模型", "从图片验证", "从摄像头验证"
    ], [ui.PANNELS.MODEL, ui.PANNELS.VAL_FROM_IMAGE, ui.PANNELS.VAL_FROM_VIDEO]);
    ui.isCanTrain(false);
}