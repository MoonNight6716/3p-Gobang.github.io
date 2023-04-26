const canvasRef = document.querySelector('#my-canvas')
const ctx = canvasRef.getContext('2d')

const tipsRef = document.querySelector('.gobangTips')
const rcs = 14 //格子数
const gap = 42 //格子大小
const radius = 20 //棋子大小
const padding = 25 //棋盘边距
let gameOver = false //游戏结束
let current = 3 //？？？

let langs = navigator.language || navigator.userLanguage
let lang = langs.substr(0, 2)
let gameModel = 1

let data = new Array(rcs + 1).fill(0).map(() => new Array(rcs + 1))
const restart = () => {
    buttonAudio()
    data = new Array(rcs + 1).fill(0).map(() => new Array(rcs + 1))
    cacheIndex = 0
    cacheData.length = 1
    if (gameModel == 3) current = 3
    else if (gameModel == 2) current = 2
    gameOver = false
    init ()
}

const canvasClick = (e) => {
    if (gameOver) {
        return
    }
    clickAudio()
    const { offsetX, offsetY } = e
    const posi = getPostions(offsetX, offsetY, gap, padding, radius)
    if (posi && !data[posi[0]][posi[1]]) {
        data[posi[0]][posi[1]] = current
        init ()
        pushStack(data)
        const res = isOver(data, posi)
        if (res) {
            gameOver = true
            winAudio()
            setTimeout(() => {
              if (gameModel == 3) {
                if (lang == 'zh') {
                    msg = (current == 1) ? "黄棋胜利！" : (current == 2) ? "红棋胜利！" : (current == 3) ? "蓝棋胜利！"  : "平局！"
                    if (confirm ('游戏结束：' + msg + '\n是否重新开始？') == true) {
                        restart()
                    }
                } else {
                    msg = (current == 1) ? "Yellow Pieces is winner!" : (current == 2) ? "Red Pieces is winner!" : (current == 3) ? "Blue Pieces is winner!"  : "Drawn game!"
                    if (confirm ('Game over: ' + msg + '\nDo you want to play again?') == true) {
                        restart()
                    }
                }
              } else if (gameModel == 2) {
                if (lang == 'zh') {
                  msg = (current == 1) ? "白棋胜利！" : (current == 2) ? "黑棋胜利！"  : "平局！"
                  if (confirm ('游戏结束：' + msg + '\n是否重新开始？') == true) {
                      restart()
                  }
                } else {
                  msg = (current == 1) ? "White Pieces is winner!" : (current == 2) ? "Black Pieces is winner!"  : "Drawn game!"
                  if (confirm ('Game over: ' + msg + '\nDo you want to play again?') == true) {
                      restart()
                  }
              }
              }
            }, 50)
        }
    }
}

const ds = [
    [
        [-1, 1], [1, -1]
    ], [
        [0, 1], [0, -1]
    ], [
        [1, 1], [-1, -1]
    ], [
        [1, 0], [-1, 0]
    ]
]

function getPostionResult(data, x, y, m, n) {
    const val = data[x][y]

    for (let i = 0; i < ds.length; i++) {
        const [[lx, ly], [rx, ry]] = ds[i]
        let nx = x, ny = y, cnt = 1
        for (let j = 0; j < 4; j++) {
            nx += lx
            ny += ly
            if (!(nx >= 0 && nx < m && ny >= 0 && ny < n) || data[nx][ny] !==val) {
                break
            }
            cnt++
        }

        nx = x
        ny = y
        for (let j = 0; j < 4; j++) {
            nx += rx
            ny += ry
            if (!(nx >= 0 && nx < m && ny < n) || data[nx][ny] !==val) {
                break
            }
            cnt++
        }
        if (cnt >= 5) {
            return true
        }
    }
    return false
}

const isOver = (data, posi) => {
    const m = data.length, n = data[0].length
    let nullCnt = m * n

    if (getPostionResult(data, posi[0], posi[1], m, n)) {
        return posi
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (data[i][j] !== undefined) {
                nullCnt--
            }
        }
    }

    return !nullCnt
}

const drawChessboard = (ctx, rcs, gap, padding) => {
    ctx.beginPath()
    ctx.lineWidth = 1
    // 竖排线条 从上到下
    for (let i = 0; i <= rcs; i++) {
        ctx.moveTo(padding + gap * i, padding)
        ctx.lineTo(padding + gap * i, padding + gap * rcs)
    }
    // 横排线条 从左到右
    for (let i = 0; i <= rcs; i++) {
        ctx.moveTo(padding, padding + gap * i)
        ctx.lineTo(padding + gap * rcs, padding + gap * i)
    }
    ctx.strokeStyle = "#fff" //线条颜色
    ctx.stroke()
    ctx.closePath()

    const pgra = padding + gap * rcs / 2 //通过边距+格子数*格子大小/2 获取中心点
    const gap4 = gap * 4 //乘几就几格

    //中心点
    ctx.beginPath()
    ctx.arc(pgra, pgra, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    //左上角
    ctx.beginPath()
    ctx.arc(pgra - gap4, pgra - gap4, 5, 0, 2 * Math.PI)
    ctx.fill()
    //左下角
    ctx.beginPath()
    ctx.arc(pgra - gap4, pgra + gap4, 5, 0, 2 * Math.PI)
    ctx.fill()
    //右上角
    ctx.beginPath()
    ctx.arc(pgra + gap4, pgra - gap4, 5, 0, 2 * Math.PI)
    ctx.fill()
    //右下角
    ctx.beginPath()
    ctx.arc(pgra + gap4, pgra + gap4, 5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

function drawBluePieces(ctx, ci, cj, si, sj, radius = 20) {
    ctx.beginPath()
    const lg2 = ctx.createRadialGradient(ci, cj, 5, ci, cj, 20)
    lg2.addColorStop(0.1, '#FFFFFF')
    lg2.addColorStop(0.9, '#99FFFF')
    ctx.fillStyle = lg2
    ctx.arc(si, sj, radius, 0, 2 * Math.PI)
    ctx.fill()
}

function drawRedPieces(ctx, ci, cj, si, sj, radius = 20) {
    ctx.beginPath()
    const lg2 = ctx.createRadialGradient(ci, cj, 5, ci, cj, 20)
    lg2.addColorStop(0.1, '#FF6633')
    lg2.addColorStop(0.9, '#ff3333')
    ctx.fillStyle = lg2
    ctx.arc(si, sj, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

function drawYellowPieces(ctx, ci, cj, si, sj, radius = 20) {
    ctx.beginPath()
    const lg2 = ctx.createRadialGradient(ci, cj, 5, ci, cj, 20)
    lg2.addColorStop(0.1, '#ffff66')
    lg2.addColorStop(0.9, '#ffff33')
    ctx.fillStyle = lg2
    ctx.arc(si, sj, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

function drawWhitePieces(ctx, ci, cj, si, sj, radius = 12) {
  ctx.beginPath()
  const lg2 = ctx.createRadialGradient(
    ci, cj, 5, ci, cj, 20
  )
  lg2.addColorStop(0.1, '#fff')
  lg2.addColorStop(0.9, '#ddd')
  ctx.fillStyle = lg2
  ctx.arc(
    si, sj, radius, 0, 2 * Math.PI
  )
  ctx.fill()
  ctx.closePath()
}

function drawBlackPieces(ctx, ci, cj, si, sj, radius = 12) {
  ctx.beginPath()
  const lg2 = ctx.createRadialGradient(
    ci, cj, 5, ci, cj, 20
  )
  lg2.addColorStop(0.1, '#666')
  lg2.addColorStop(0.9, '#000')
  ctx.fillStyle = lg2
  ctx.arc(
    si, sj, radius, 0, 2 * Math.PI
  )
  ctx.fill()
  ctx.closePath()
}

const drawPieces = (ctx, data, gap, padding, radius = 20) => {
    const m = data.length, n = data[0].length
    for (let i = 0; i < m; i++) {
        const cj = i * gap + padding + 6 - padding
        const sj = padding + i * gap
        for (let j = 0; j < n; j++) {
            if (data[i][j] === undefined) {
                continue
            }
            const ci = j * gap + padding + 6 - padding
            const si = padding + j * gap
            if (gameModel == 3) {
              if (data[i][j] == 1) {
                  drawRedPieces(ctx, ci, cj, si, sj, radius)
              } else if (data[i][j] == 2){
                  drawBluePieces(ctx, ci, cj, si, sj, radius)
              } else {
                  drawYellowPieces(ctx, ci, cj, si, sj, radius)
              }
            } else if (gameModel == 2) {
              if (data[i][j] == 1) {
                  drawBlackPieces(ctx, ci, cj, si, sj, radius)
              } else if (data[i][j] == 2){
                  drawWhitePieces(ctx, ci, cj, si, sj, radius)
              }
            }
        }
    }
}

const getPostions = (offsetX, offsetY, gap, padding, r = 20) => {
    const x = Math.round((offsetY - padding) / gap)
    const y = Math.round((offsetX - padding) / gap)
    const x1 = x * gap + padding, y1 = y * gap + padding
    const nr = Math.pow(Math.pow(x1 - offsetY, 2) + Math.pow(y1 - offsetX, 2), 0.5)
    if (nr <= r) {
        return [x, y]
    }
    return false
}

const cloneDeep = (data) => {
    const m = data.length, n = data[0].length
    const res = new Array(m).fill(0).map(() => new Array(n))

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (data[i][j] !== undefined) {
                res[i][j] = data[i][j]
            }
        }
    }
    return res
}

const cacheData = [cloneDeep(data)]
let cacheIndex = 0

const pushStack = (data) => {
    cacheData.push(cloneDeep(data))
    cacheIndex++
}
const popStack = () => {
    buttonAudio()
    if (cacheIndex && !gameOver) {
        data = cloneDeep(cacheData[--cacheIndex])
        cacheData.length = cacheIndex + 1
        if (gameModel == 3) {
          if(current == 1) current = 2
          else current -= 2
        } else if (gameModel == 2) {
          if(current == 1) current = 1
          else current = 0
        }
        init()
    }
}

function init() {
    canvasRef.width = 640
    drawChessboard(ctx, rcs, gap, padding)
    drawPieces(ctx, data, gap, padding, radius)
    if (gameModel == 3) {
      if(current <= 2) current += 1
      else if(current >= 3) current = 1
    } else if (gameModel == 2) {
      if(current >= 2) current -= 1
      else if(current <= 1) current += 1
    }

    setTimeout (() => {
      if (gameModel == 3) {
        if (lang == 'zh') {
            tipsRef.innerHTML = (current == 1) ? '当前：红子' : (current == 2) ? '当前：蓝子' : '当前：黄子'
        } else {
            tipsRef.innerHTML = (current == 1) ? 'Current: Red Pieces' : (current == 2) ? 'Current: Blue Pieces' : 'Current: Yellow Pieces'
        }
      } else if (gameModel == 2) {
        if (lang == 'zh') {
            tipsRef.innerHTML = (current == 1) ? '当前：黑子' : '当前：白子'
        } else {
            tipsRef.innerHTML = (current == 1) ? 'Current: Black Pieces' : 'Current: White Pieces'
        }
      }
    }, 100)
}

function gameModel2p() {
  gameModel = 2
  current = 1
  showLanguage()
}

function gameModel3p() {
  gameModel = 3
  current = 1
  showLanguage()
}

function ZhEn() {
    buttonAudio()
    if (lang == 'zh') {
        lang = 'en'
    }
    else if (lang == 'en') {
        lang = 'zh'
    }
    showLanguage()
}

function showLanguage() {
    if (lang == 'zh') {
        document.getElementById('zhen').innerHTML = '<strong>中</strong>/<small>En</small>'
        document.getElementById('btnhome').innerHTML = '首页'
        document.getElementById("btnrestart").innerHTML = '重新开始'
        document.getElementById("btnpop").innerHTML = '悔棋'
        if (gameModel == 3) {
          tipsRef.innerHTML = (current == 1) ? '当前：红子' : (current == 2) ? '当前：蓝子' : '当前：黄子'
          document.getElementById('gobangTitle').innerHTML = ' · 三人五子棋 · '
        } else if (gameModel == 2) {
          tipsRef.innerHTML = (current == 1) ? '当前：黑子' : '当前：白子'
          document.getElementById('gobangTitle').innerHTML = ' · 双人五子棋 · '
        }
    } else {
        document.getElementById('zhen').innerHTML = '<small>中</small>/<strong>En</strong>'
        document.getElementById('btnhome').innerHTML = 'Home'
        document.getElementById("btnrestart").innerHTML = 'Restart'
        document.getElementById("btnpop").innerHTML = 'Stack'
        if (gameModel == 3) {
          tipsRef.innerHTML = (current == 1) ? 'Current: Red Pieces' : (current == 2) ? 'Current: Blue Pieces' : 'Current: Yellow Pieces'
          document.getElementById('gobangTitle').innerHTML = ' · 3p Gobang · '
        } else if (gameModel == 2) {
          tipsRef.innerHTML = (current == 1) ? 'Current: Black Pieces' : 'Current: White Pieces'
          document.getElementById('gobangTitle').innerHTML = ' · 2p Gobang · '
        }
    }
}