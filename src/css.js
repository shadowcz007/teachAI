/*
 * 动态添加 CSS 样式
 * @param selector {string} 选择器
 * @param rules    {string} CSS样式规则
 * @param index    {number} 插入规则的位置, 靠后的规则会覆盖靠前的，默认在后面插入
 */
const addCssRule = function() {
    // 创建一个 style， 返回其 stylesheet 对象
    function createStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        return style.sheet;
    }

    // 创建 stylesheet 对象
    var sheet = createStyleSheet();

    // 返回接口函数
    return function(selector, rules, index) {
        index = index || 0;
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
}();

// exports.addCssRule = addCssRule;

function init() {
    addCssRule("input", `height: 32px;
        background: #ececec;
        line-height: 32px;
        margin: 4px;
        margin-right:24px;
        padding: 8px;
        outline:none;
        `);

    addCssRule("input:hover", `
    border-color:#03A9F4;
    box-shadow: inset rgb(158, 158, 158) 2px 2px 8px;
        `);

    addCssRule("input:focus", `
        border-color:#03A9F4;
            `);

    addCssRule("button", `
    cursor: pointer;
    margin-right: 24px;
    height: 36px;
    padding: 0 12px;
    outline:none;
    border-radius: 18px;
        `);

    addCssRule(".button-div",`
    width:100%;
    display: flex;`)

    addCssRule(".hover-btn", `
    width: 100%;
    opacity: 0.3;
    margin: 0px;
    background: black;
    color: white;
    border:none;
    heigth:32px;
    `);

    addCssRule(".hover-btn:hover", `
    box-shadow:none;
    opacity: 1;
    background: black;
    color: white;
    border:none;
    `);

    addCssRule(".on", `
    background: black;
    outline: none;
    color: white`);

    addCssRule(".on:hover", `
    background: black;
    outline: none;
    color: white`)

    addCssRule("button:hover", `
    background: white;
    border-color:#03A9F4;;
    box-shadow: 2px 2px 8px #9E9E9E;
            `);
    addCssRule("button:active", `
    border-color:#03A9F4;;
                    `);

    addCssRule(".pannel", `
        margin: 56px;
        `);

    addCssRule(".upload-image-preview", `
        cursor: pointer;
        width: 120px;
        height: 120px;
        display: flex;
        margin: 18px 0;
        padding: 12px;
        background: gray;
        justify-content: center;
        align-items: flex-end;
        background: center center / contain no-repeat gray;`);

    addCssRule(".upload-image-preview:after", `
    font-size: 12px;
    content: attr(alt);
    background-color: #0505058a;
    padding: 0 12px;
    font-weight: 800;
    color: yellow;`);

    addCssRule('.vis-container', `
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #eee;
    margin: 24px 0;
    flex-direction: row-reverse;`);

    addCssRule(".vis", `
        margin: 44px 0;
        height: 320px;
        width: 50%;
        max-height: 400px;
        overflow: scroll;`);

    addCssRule(".hidden", `
    display:none`);

    addCssRule('.disabled:hover',`
        box-shadow:none
    `);

    addCssRule(".images", `
        margin: 44px;
        height: 50vh;
        overflow-x: scroll;
        display: flex;
        flex-wrap: wrap;`);

    addCssRule('#global-video', `
    position: fixed;
    top: 0;
    right: 0;
    z-index: 99;
    display: flex;
    flex-direction: column;
    background-color: black;`);

    addCssRule('#global-video span', `
    color:white`);


    addCssRule("#loading", `
    position: fixed;
    overflow: hidden;
    top: 0px;
    left: 0;
    display: flex;
    z-index: 99999;
    width: 100%;
    height: 100vh;
    background-color: rgb(19 19 24 / 85%);
    justify-content: center;
    align-items: center;`);

    addCssRule("#loading .info", `
    width: 188px;
    height: 188px;
    min-width: 44px !important;
    background: rgb(63, 81, 181);
    border-radius: 50%;
    min-height: 44px !important;
    text-align: center;
    padding: 0!important;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #c2e9ff;`);

    addCssRule('.info', `
    font-size: 14px;
    display: block;
    padding: 24px;
    min-width:120px;
    max-height: 400px;
    overflow: scroll;`);

    addCssRule(".data-set-all", `
    padding: 18px;
    background: #eee;
    margin: 24px 0;
    `);

    addCssRule('.img', `
    width: 200px;
    height: 200px;
    margin: 4px;
    display: flex;
    overflow: hidden;
    flex-direction: column-reverse;
    background: black;
    justify-content: flex-end;
    align-items: center;`);

    addCssRule('.img-data',`
    width:100%;
    height: 100%;`);


    addCssRule('.flow', `
    position: fixed;
    height: 100vh;
    width: 100%;
    overflow:scroll;
    background: #eee;
    top: 0;
    left:0;
    z-index: 24;
    `);

    addCssRule('.scroll-false', `
        overflow:hidden;
        height:100vh;
    `);

    addCssRule('.upload-image',`display: flex;
    justify-content: space-between;
    align-items: center;`);

    addCssRule('.ai-button',`width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #3F51B5;
    z-index: 9999;
    top: 12px;
    left: 94%;
    position: fixed;`);

    addCssRule('.menu-bar',`
    position: fixed;
    z-index: 9999 !important;
    height: 44px;
    border: 1px solid rgb(255, 255, 255);
    background-color: rgb(103 224 227 / 80%);
    color: white;
    border-radius: 32px !important;
    line-height: 44px !important;
    outline: none;
    padding: 4px 12px !important;
    user-select: none;
    font-size: 12px !important;
    font-weight: 800 !important;
    `);

    addCssRule('#global-info',`
    position: fixed;
    z-index: 9999 !important;
    left: 12px !important;
    top: 8px !important;
    `);

    addCssRule('.data-set-class',`
        border:1px solid gray;
        background: white;
        border-radius: 4px;
        padding: 24px;
    `);

    addCssRule('.message',`
    display: flex;
    background: rgb(238, 238, 238);
    width: 300px;
    justify-content: space-around;
    border-radius: 12px;
    margin-top: 24px;
    box-shadow: rgba(96, 125, 139, 0.38) 4px 4px 13px 0px;
    align-items: center;`);

    addCssRule('.message img',`
    height: 44px;
    width: auto;`);

    addCssRule('.message div',`
    color: #597676;
    margin: 4px;
    font-size: 12px;
    font-weight: 400;`);

};

// module.exports = {
//         init
//     }
exports.init = init;