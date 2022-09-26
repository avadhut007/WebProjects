var dx, dy;       /* displacement at every dt */
var dt = 5
var x, y;         /* ball location */
var score = 0;    /* # of walls you have cleaned */
var tries = 0;    /* # of tries to clean the wall */
var started = false;  /* false means ready to kick the ball */
var ball, court, paddle, brick, msg;
var court_height, court_width, paddle_left;
var curr_level;
var bricks = new Array(4);  // rows of bricks
var colors = ["red","blue","yellow","green"];
var is_running = false
var num_of_hit_bricks = 0
/* get an element by id */
function id ( s ) { return document.getElementById(s); }

/* convert a string with px to an integer, eg "30px" -> 30 */
function pixels ( pix ) {
    pix = pix.replace("px", "");
    num = Number(pix);
    return num;
}

/* place the ball on top of the paddle */
function readyToKick () {
    x = pixels(paddle.style.left)+paddle.width/2.0-ball.width/2.0;
    y = pixels(paddle.style.top)-2*ball.height;
    ball.style.left = x+"px";
    ball.style.top = y+"px";
}

/* paddle follows the mouse movement left-right */
function movePaddle (e) {
    var ox = e.pageX-court.getBoundingClientRect().left;
    paddle.style.left = (ox < 0) ? "0px"
                            : ((ox > court_width-paddle.width)
                               ? court_width-paddle.width+"px"
                               : ox+"px");
    if (!started)
        readyToKick();
}

function initialize () {
    court = id("court");
    ball = id("ball");
    paddle = id("paddle");
    wall = id("wall");
    msg = id("messages");
    brick = id("red");
    court_height = pixels(court.style.height);
    court_width = pixels(court.style.width);
    for (i=0; i<4; i++) {
        // each row has 20 bricks
        bricks[i] = new Array(20);
        var b = id(colors[i]);
        for (j=0; j<20; j++) {
            var x = b.cloneNode(true);
            bricks[i][j] = x;
            wall.appendChild(x);
        }
        b.style.visibility = "hidden";
    }
    started = false;
 }

/* true if the ball at (x,y) hits the brick[i][j] */
function hits_a_brick ( x, y, i, j ) {
    var top = i*brick.height - 450 + ball.height;
    var left = j*brick.width;
    return (x >= left && x <= left+brick.width
            && y >= top && y <= top+brick.height);
}

/* move ball function */
function moveTheBall(x,y){

    x = pixels(ball.style.left)
    y = pixels(ball.style.top)
    dx = x + vx*dt
    dy = y + vy*dt
    paddle_x = pixels(paddle.style.left)
    paddle_y = pixels(paddle.style.top)
    
    // if paddle is hit reflect
    //console.log(dy, vy, -paddle_y - ball.height )
    //console.log(paddle_x - ball.width , dx ,paddle_x + paddle.width,dy )
    if (dx >= paddle_x - ball.width + 5 && dx <= paddle_x + paddle.width  && dy > -paddle_y  - ball.height+5){
        vy = -vy
    }
    
    //right side 
    //console.log(dx, court_width)
    if (dx >= court_width -ball.width){ 
       vx = -vx
    } 

    //left side
    //console.log(dx, court_width)
    if (dx < 0){ 
        vx = -vx
    }

    // top
    if (dy  < -court_height + ball.height){ 
        vy = -vy
    } 
    
    // bottom out of bounds
    //console.log(dy, -court_height)
    if (dy  > 0){ 
        num_tries = parseInt(id("tries").textContent)+1
        id("tries").textContent = num_tries.toString()

        clearInterval(stop_ball)
        //initialize()
        started = false
        readyToKick()
        is_running = false
        return
    } 

    // if all bricks are hit increase score and reset bricks
    if (num_of_hit_bricks >= 80){
        score = parseInt( id("score").textContent )
        id("score").textContent = (score+1).toString()
        resetGame ()
        return
    }

    // if brick is hit make it hidden
    for (i=0;i<4;i++){
        for (j=0;j<20;j++){
            if (hits_a_brick ( dx, dy, i, j ) && bricks[i][j].style.visibility != "hidden"){
                bricks[i][j].style.visibility = "hidden"
                num_of_hit_bricks+=1
                vy = -vy
                break
            }
        }
    }



    dx = x + vx*dt
    dy = y + vy*dt
    ball.style.left = dx + "px"
    ball.style.top = dy + "px"
}

function startGame () {

    is_running = true
    started = true
    ballSpeed = getBallSpeed()
    /* as said by prof we need angle between 45 (pi/4) and 135 (pi*3/4) */
    kickedAngle = ((Math.random() * 90) + 45) *Math.PI/180

    if (Math.random() > 0.5){
        vx = -ballSpeed*kickedAngle
    }else{
        vx = ballSpeed*kickedAngle
    }

    vy = -ballSpeed*kickedAngle

    stop_ball = setInterval(moveTheBall, 50)




    
}

function getBallSpeed(){
    curr_level = id('level')
    return curr_level.value //increased ball speed according to level
}
    

function resetGame () {
    clearInterval(stop_ball)
    for (i=0;i<4;i++){
        for (j=0;j<20;j++){    
        bricks[i][j].style.visibility = "visible"
        }
    }

    num_of_hit_bricks = 0
    started = false
    readyToKick()
    id("tries").textContent = '0'
    is_running = false
}
