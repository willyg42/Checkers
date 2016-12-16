function Piece(color,xPos,yPos) {
  this.color = color;
  this.xPos = xPos;
  this.yPos = yPos;
}

var board = [
  [0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [2,0,2,0,2,0,2,0],
  [0,2,0,2,0,2,0,2],
  [2,0,2,0,2,0,2,0]
]
var pieces = []

function initializePieces() {
  for(y=0;y<board.length;y++){
    for(x=0;x<board[0].length;x++){
      if(board[y][x] == 1) {
        var bluePiece = new Piece("blue", 50+(x*100),50+(y*100))
        pieces.push(bluePiece)
      }
      else if(board[y][x] == 2) {
        redPiece = new Piece("red", 50+(x*100),50+(y*100))
        pieces.push(redPiece)
      }
    }
  }
}

function drawBoard() {
  var c=document.getElementById("myCanvas");
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
  for(i=0; i<pieces.length; i++) {
    drawPiece(context,pieces[i])
  }
}

function drawPiece(context, newPiece) {
  context.fillStyle = newPiece.color;
  context.beginPath();
  context.arc(newPiece.xPos,newPiece.yPos,40,0,2*Math.PI);
  context.stroke();
  context.fill();
}

function grabPiece(e) {
  console.log(mouseDown);
  if(mouseDown) {
    piece = pieces[0]
    piece.xPos = e.x
    piece.yPos = e.y
  }
}

function mainLoop() {
  drawBoard()  
  requestAnimationFrame(mainLoop)
}

var c=document.getElementById("myCanvas");
c.addEventListener('mousemove', grabPiece)
var mouseDown = 0;
document.body.onmousedown = function() { 
  ++mouseDown;
}
document.body.onmouseup = function() {
  --mouseDown;
}
initializePieces()
requestAnimationFrame(mainLoop)
