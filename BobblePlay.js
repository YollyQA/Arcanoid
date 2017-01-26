/*** Created by YuliyaS on 24.01.2017.*/
var canvas, ctx,w,h, game = true;

var ball, platforma,blocks;
var bg = new Image;
var rowHeight,row,col;
var toLeft = true,toRight = true;



var BALL = function(x,y){
    this.x = x;
    this.y = y;

    this.color = "red";
    this.radius = 5;
    this.vx = 3;
    this.vy = -4;

};
var PLATFORMA = function (x,y) {
    this.x = x;
    this.y = y;

    this.color = "black";
    this.width = 140;
    this.height = 10;
    this.vx = 10;
};
var BLOCKS= function (width, height, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    this.padding = 2;
    this.obj;
};
window.onload = init;
//listener for plaform movies by keys;
document.addEventListener('keydown',function (event){
   if(event.keyCode == 37){
       //platform to left
       toLeft = true;
       toRight = false;
   }
    else if(event.keyCode ==39){
       //platform to right
       toRight = true;
       toLeft = false;

   }
    else if(event.keyCode == 40){
       //platform stop
       toRight = false;
       toLeft = false;
   }
});

function init(){
    canvas = document.getElementById('canvas');
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext("2d");
    ctx.font = "80px Kurale";
    ball = new BALL(w/2, h/2+50);
    platforma = new PLATFORMA(w/2,h-20);
    platforma.x -= platforma.width/2;
    blocks = new BLOCKS((w/5),18,6,20);// 20 блоков в строке, 6 уровней
    blocks.obj=[];
    for(var i = 0; i<blocks.rows;i++){
        blocks.obj[i]=[];
        for (var j = 0; j<blocks.cols;j++){
            blocks.obj[i][j]=1;
        }
    }

    /* MAP level:
    11111111111111111111
    11111111111111111111
    11111111111111111111
    11111111111111111111
    11111111111111111111
    11111111111111111111
     */
    beginGame();
}



function beginGame(){
if(game) {
    ctx.clearRect(0, 0, w, h);
    background();
    //physics ball 
    ball.x += ball.vx;
    ball.y += ball.vy;

    if((ball.x+ ball.radius)+ ball.vx > w ||(ball.x-ball.radius)+ball.vx<0){
    ball.vx = - ball.vx;
    }

    if((ball.y-ball.radius)+ ball.vy<0){
        ball.vy= -ball.vy;
    }else if(ball.y+ball.radius+ball.vy>=(h-platforma.height-10)&& (ball.y + ball.radius)+ball.vy<h){
        if(ball.x+ball.radius>=platforma.x && ball.x + ball.radius<=(platforma.x+platforma.width)){
            ball.vy = -ball.vy;
            ball.vx = 10*(ball.x-(platforma.x+platforma.width/2))/platforma.width;//ускорение шарика прстолкновении с платформой по оси x
        }
        else{
            game = false
        }
    }
    
    //physics platforma


    if(toRight && platforma.x+platforma.width<w){
        platforma.x+=platforma.vx;
    }
    if(toLeft && platforma.x>0){
        platforma.x-=platforma.vx;
    }

    //blocks physics
    rowHeight = blocks.height+blocks.padding;
    row = Math.floor(ball.y/(rowHeight)); //позиция шарика в поле с блоками(в i полосе)
    col = Math.floor(ball.x/(blocks.width+blocks.padding));

    if(ball.y<blocks.rows*rowHeight && row >= 0 && col>=0 && blocks.obj[row][col] == 1){
        blocks.obj[row][col] = 0;
        ball.vy = -ball.vy;
    }//(blocks.rows*rowHeight)- огранка где стаят все блокию прописываем, что бы ничего не вылезало за предлелы таблицы


    //drawing ball
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();

    //drawing platforma
    ctx.fillStyle = platforma.color;
    ctx.beginPath();
    ctx.fillRect(platforma.x,platforma.y,platforma.width,platforma.height);
    ctx.closePath();


    //drawing blocks
    ctx.fillStyle = "MediumSpringGreen";
    ctx.strokeStyle = "LightBlue";
    for(var i = 0; i<blocks.rows;i++){
        for (var j = 0; j<blocks.cols;j++){
            if (blocks.obj[i][j] == 1) {
                ctx.beginPath();
                //fillRect(x,y,width,height)
                ctx.rect(j * (blocks.width+blocks.padding),i*(blocks.height+blocks.padding),blocks.width,blocks.height);
                ctx.fill();
                ctx.stroke();


                ctx.closePath();
            }

        }
    }


    window.requestAnimationFrame(beginGame);
}
 else
    {
    //game over
    setTimeout(gameover, 800);

     }
   
}

function gameover(){
    var text = "GAME OVER";
    ctx.clearRect(0,0,w,h);
    background();
    ctx.fillStyle = "MediumSpringGreen";
    var text_lenght =  ctx.measureText(text).width;
    ctx.fillText(text,w/2-text_lenght/2,h/2-50);
    if (game = false){
        alert('GAME OVER');
    }
}
function background(){
    bg.src = "bg.jpg";
    ctx.drawImage(bg,0,0,w,h);
}


