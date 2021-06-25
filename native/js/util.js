var deviceHeight = window.innerHeight;      //height
var deviceWidth = window.innerWidth;        //width

/**
 * find elem by id
 */
function $(id){
    return document.getElementById(id);
}

/**
 * create elem by type 
 */
function $c(type){
    return document.createElement(type);
}

/**
 * sind Nodelist by css_selector 
 */
function $all(css_selector){
    return document.querySelectorAll(css_selector);
}

/**
 * set css for obj
 */
function setStyle(obj, css){
    for(let atr in css){
        obj.style[atr] = css[atr];
    }
}