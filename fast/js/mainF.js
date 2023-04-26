// 手机屏幕自适应
var phoneWidth =  parseInt(window.screen.width);
var phoneScale = phoneWidth/640;
var ua = navigator.userAgent;
if (/Android (\d+\.\d+)/.test(ua)){
    var version = parseFloat(RegExp.$1);
    if(version>2.3){
        document.write('<meta name="viewport" content="width=640, minimum-scale = '+phoneScale+', maximum-scale = '+phoneScale+', target-densitydpi=device-dpi">');
    }else{
        document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
    }
} else {
    document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
}

function home() {
    setTimeout(function() {
        window.location.href='./fastindex.html'
    }, 150)
}
function IIpGobang() {
    setTimeout(() => {
        window.location.href='./fast-2p-gobang.html' 
    }, 200);
}
function IIIpGobang() {
    setTimeout(() => {
        window.location.href='./fast-3p-gobang.html' 
    }, 200);
}