function rectangularCollision( { rectangle1, rectangle2 } ) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerid}){   
    clearTimeout(timerId);     
    document.querySelector('#displayText').style.display = 'flex';
        if(player.health === enemy.health){
        document.querySelector('#displayText').innerHTML = 'Tie';
        } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins!';
        }else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins!';
        };
};

let timer = 60;
let timerId; 

function decreaseTimer() {
    if( timer > 0){
        timerId = setTimeout(decreaseTimer, 1000)
        if(!keys.p.pressed){
            timer--   
        };
        document.querySelector('#timer').innerHTML = timer; 
    }; 
    if(timer === 0){
        determineWinner({player, enemy});
    };
};

// brings up pause menu 

function pausebutton() {
    if(keys.p.pressed)
    {
       document.querySelector('#pauseMenu').style.display = 'flex'; 
    } else {
        document.querySelector('#pauseMenu').style.display = 'none'; 
    }
    
};

// start menu toggle

let startMenu = document.querySelector('#startingMenu').style.display

function startGame(){
    if(startMenu === 'flex'){
        console.log("game needs to be started")
        document.querySelector('#startingMenu').style.display = 'none'
        keys.p.pressed = false
    } 
}

    
    