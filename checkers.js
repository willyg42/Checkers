var board = newBoard();
var c=document.getElementById("myCanvas");
//var justJumped=null
var turn="red"
var heldPiece=null
var heldX = -1
var heldY = -1
initializePieces()
c.addEventListener('mousemove', holdingPiece)
c.addEventListener('mousedown', grabPiece)
c.addEventListener('mouseout', leaveBoard)
c.addEventListener('mouseup', placePiece)
requestAnimationFrame(mainLoop)

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

function holdingPiece(e) {
  if(heldPiece!=null){
    heldPiece.xPos = e.x
    heldPiece.yPos = e.y
  }
}

function grabPiece(e) {
  if(heldPiece == null) {
    for(y=0; y<board.length; y++){
      for(x=0; x<board.length; x++){
        if(board[y][x]!=null && board[y][x].color == turn && e.x>board[y][x].xPos-40 && e.x<board[y][x].xPos+40 && e.y>board[y][x].yPos-40 && e.y<board[y][x].yPos+40) {
          heldPiece = board[y][x]
          heldX = x 
          heldY = y
        }
      }
    }
  }
}

function leaveBoard(e) {
  heldPiece = null
  heldX = -1
  heldY = -1
  initializePieces()
}

function mainLoop() {
  drawBoard()
  drawPieces()
  requestAnimationFrame(mainLoop)
}

function placePiece(e) {
  if (heldPiece != null) {
    var dropX = Math.floor(e.x/100)
    var dropY = Math.floor(e.y/100)
    var validMoves = getValidMoves(turn, board)
    var move = null
    for(x = 0; x < validMoves.length; x++) {
      if(heldPiece == validMoves[x].piece && dropX == validMoves[x].newX && dropY == validMoves[x].newY) {
        move = validMoves[x]
      }
    }
    if(move != null) {
      board[dropY][dropX] = board[heldY][heldX]
      board[heldY][heldX] = null
      if(move.jumpX != -1) {
        board[move.jumpY][move.jumpX] = null
      }
      if(!heldPiece.king && heldPiece.color=="red" && dropY==0){
        heldPiece.king=true
       // turn = turn == "red" ? "blue" : "red"
      } 
      else if(!heldPiece.king && heldPiece.color=="blue" && dropY==board.length-1){
        heldPiece.king=true
        //turn = turn == "red" ? "blue" : "red"
      }
      turn = turn == "red" ? "blue" : "red"
    }
    heldPiece=null
    heldX = -1
    heldY = -1
    initializePieces()
  }
}
