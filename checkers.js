function Piece(color,xPos,yPos) {
  this.color = color
  this.xPos = xPos
  this.yPos = yPos
  this.king = false
}

var board = [
  [null,new Piece("blue",150,50),null,new Piece("blue",350,50),null,new Piece("blue",550,50),null,new Piece("blue",750,50)],
  [new Piece("blue",50,150),null,new Piece("blue",250,150),null,new Piece("blue",450,150),null,new Piece("blue",650,150),null],
  [null,new Piece("blue",150,250),null,new Piece("blue",350,250),null,new Piece("blue",550,250),null,new Piece("blue",750,250)],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [new Piece("red",50,550),null,new Piece("red",250,550),null,new Piece("red",450,550),null,new Piece("red",650,550),null],
  [null,new Piece("red",150,650),null,new Piece("red",350,650),null,new Piece("red",550,650),null,new Piece("red",750,650)],
  [new Piece("red",50,750),null,new Piece("red",250,750),null,new Piece("red",450,750),null,new Piece("red",650,750),null]
]

function initializePieces() {
  for(y = 0; y < board.length; y++) {
    for(x = 0; x < board[0].length; x++) {
      if(board[y][x] != null) {
        board[y][x].xPos = 50+(x*100)
        board[y][x].yPos = 50+(y*100)
      }
    }
  }
}

function drawBoard() {
  var context=c.getContext("2d");
  for (y = 0; y < board.length; y++) {
    for(x = 0; x < board[0].length; x++) {
      if(((x + y) % 2) == 0){
        context.fillStyle="#E6DD93";
      }
      else {
        context.fillStyle="#000000";
      }
      context.fillRect(x*100,y*100, 100,100);
    }
  }
}

function drawPieces(context) {
  var context=c.getContext("2d")
  for(y = 0; y < board.length; y++) {
    for(x=0; x<board.length; x++){
      if(board[y][x]!=null){
        drawPiece(context, board[y][x])
      }
    }
  }
}

function drawPiece(context, newPiece) {
  context.fillStyle = newPiece.color;
  context.beginPath();
  context.arc(newPiece.xPos,newPiece.yPos,40,0,2*Math.PI);
  context.stroke();
  context.fill();
  if(newPiece.king){
    context.fillStyle = "white"
    context.font="40px Impact";
    context.fillText("K",newPiece.xPos-10,newPiece.yPos+15)
  }
}

function grabPiece(e) {
  if(mouseDown) {
    if(heldPiece == null) {
      for(y=0; y<board.length; y++){
        for(x=0; x<board.length; x++){
          if(board[y][x]!=null && board[y][x].color == turn && e.x>board[y][x].xPos-40 && e.x<board[y][x].xPos+40 && e.y>board[y][x].yPos-40 && e.y<board[y][x].yPos+40) {
            heldPiece = board[y][x]
            heldY=y
            heldX=x
          }
        }
      }
    }
    else if(heldPiece!=null && e.y<800) {
      heldPiece.xPos = e.x
      heldPiece.yPos = e.y
    }
  }
  else if(!mouseDown) {
    var dropX = Math.floor(e.x/100)
    var dropY = Math.floor(e.y/100)
    if (heldPiece!=null && dropY<8 && dropY >= 0 && dropX>=0 && dropX < 8 && isValidMove(heldPiece,heldX,heldY,dropX,dropY)){
      board[dropY][dropX] = board[heldY][heldX]
      board[heldY][heldX] = null
      if(heldPiece.color=="red" && dropY==0){
        heldPiece.king=true
      } else if(heldPiece.color=="blue" && dropY==board.length-1){
        heldPiece.king=true
      }
      turn = turn == "red" ? "blue" : "red"
    }
    heldPiece=null
    heldX = -1
    heldY = -1
    initializePieces()
  }
}

function isValidMove(piece,srcX,srcY,newX,newY) {
  if(board[newY][newX] != null){
    return false
  }
  //normal non-king piece movement
  else if((board[srcY][srcX].color=="red" && board[srcY][srcX].king == false) && (newY == srcY-1 && (newX==srcX-1 || newX==srcX+1)) ) {
    return true
  }
  else if((board[srcY][srcX].color=="blue" && board[srcY][srcX].king == false) && (newY == srcY+1 && (newX==srcX-1 || newX==srcX+1)) ) {
    return true
  }
  //non-king jump logic
  else if((board[srcY][srcX].color=="red" && board[srcY][srcX].king == false) && (newY == srcY-2 && (newX==srcX-2 || newX==srcX+2))) {
    if((newX==srcX+2) && board[srcY-1][srcX+1].color=="blue") {
      board[srcY-1][srcX+1] = null
      return true
    }
    else if((newX==srcX-2) && board[srcY-1][srcX-1].color=="blue"){
      board[srcY-1][srcX-1] = null
      return true
    }
  }
  else if((board[srcY][srcX].color=="blue" && board[srcY][srcX].king == false) && (newY == srcY+2 && (newX==srcX-2 || newX==srcX+2))) {
    if((newX==srcX+2) && board[srcY+1][srcX+1].color=="red") {
      board[srcY+1][srcX+1] = null
      return true
    }
    else if((newX==srcX-2) && board[srcY+1][srcX-1].color=="red"){
      board[srcY+1][srcX-1] = null
      return true
    }
  }
}

function mainLoop() {
  drawBoard()
  drawPieces()
  requestAnimationFrame(mainLoop)
}

var c=document.getElementById("myCanvas");
c.addEventListener('mousemove', grabPiece)
var mouseDown = 0;
var turn="red"
var heldPiece=null
heldX = -1
heldY = -1
document.body.onmousedown = function() {
  mouseDown=1
}
document.body.onmouseup = function() {
  mouseDown=0
}
c.addEventListener("mouseout", function(){
  mouseDown=0
}, false)
requestAnimationFrame(mainLoop)
