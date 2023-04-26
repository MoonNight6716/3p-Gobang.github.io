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

// 总声音
function buttonAudio() {
    const baudio = document.createElement('audio')
    baudio.src = './assets/button.ogg'
    baudio.play()
}
function winAudio() {
    const waudio = document.createElement('audio')
    waudio.src = './assets/win.ogg'
    waudio.play()
}
function clickAudio() {
    const caudio = document.createElement('audio')
    caudio.src = './assets/click.ogg'
    caudio.play()
}
// 跳转按钮
function home() {
    buttonAudio()
    setTimeout(function() {
        window.location.href='./index.html'
    }, 150)
}
function IIpGobang() {
    buttonAudio()
    setTimeout(() => {
        window.location.href='./2p-gobang.html' 
    }, 200);
}
function IIIpGobang() {
    buttonAudio()
    setTimeout(() => {
        window.location.href='./3p-gobang.html' 
    }, 200);
}