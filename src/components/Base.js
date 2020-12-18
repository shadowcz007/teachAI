//创建div
export function createPannel(className, id) {
    let div = document.createElement("div");
    className ? div.className = className : null;
    id ? div.id = id : null;
    return div;
}

export function createInput(t = "file", multiple = false, alt = null) {
    const input = document.createElement("input");
    input.type = t;
    multiple ? input.setAttribute("multiple", true) : null;
    alt ? input.setAttribute("alt", alt) : null;
    return input
}

export function createTitle(text = "", className = "title") {
    const t = document.createElement('div')
    t.innerText = text;
    className ? t.className = className : null;
    t.style = `font-size: 18px;
    display: block;
    /* background-color: rgb(255 255 255); */
    padding: 24px 0;
    font-weight: 300;`;
    return t
};

//创建button
export function createButton(text) {
    const button = document.createElement('button')
    button.innerText = text;
    return button
};

export function createInfo(text) {
    const infoText = document.createElement('span')
    infoText.innerText = text;
    infoText.className = `info`;
    return infoText
};




//创建图片
export async function createImage(src, w) {
    const img = new Image;
    img.width = w;
    return new Promise((resolve, reject) => {
        img.onload = function() {
            img.height = img.naturalHeight * w / img.naturalWidth;
            img.style = `
      width:${w}px;
      height:${img.naturalHeight*w/img.naturalWidth}px;
      `;

            resolve(img);
        };
        img.src = src;

    });
}

export function createCanvas(w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
}

export async function file2Img(file) {
    //创建一个object URL，并不是你的本地路径
    let url = window.URL.createObjectURL(file);
    let img = await createImage(url, 200);
    // img.className = 'img-data';
    //window.URL.revokeObjectURL(url); //图片加载后，释放object URL
    return img;
}

//在元素后方插入
export function insertAfter(newElement, targentElement) {
    var parent = targentElement.parentNode;
    // console.log(targentElement)
    if (parent) {
        if (parent.lastChild == targentElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targentElement.nextSibling)
        }
    };
};



