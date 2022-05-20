const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); 

// creates canvas 

canvas.width = 1024; 
canvas.height = 576;

//fills canvas BKG

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.35; 

const bkg = new Sprite({
    position: {
        x:0,
        y:0 
    },
    imageSrc: './img/background.png'
})

const player = new Fighter({
    position:{
        x: 0,
        y: 0
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'green',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale:2.5,
    offset: {
        x: 200,
        y: 152
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/jump.png', 
            framesMax: 2,           
        },
        fall: {
            imageSrc: './img/samuraiMack/fall.png', 
            framesMax: 2,  
        },
        attack1: {
            imageSrc: './img/samuraiMack/attack1.png', 
            framesMax: 6,  
        },
        takeHit: {
            imageSrc: './img/samuraiMack/take hit.png', 
            framesMax: 4,  
        },
        death: {
            imageSrc: './img/samuraiMack/death.png', 
            framesMax: 6,  
        },
    },
    attackBox: {
        offset: {
            x: 80,
            y: 150
        }, 
        width: 190,
        height: -150
    }
});

const enemy = new Fighter({
    position:{
        x: 925,
        y: 0
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'red', 
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/kenji/idle.png',
    framesHold: 15,
    framesMax: 8,
    scale:2.5,
    offset: {
        x: 200,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/jump.png', 
            framesMax: 2,           
        },
        fall: {
            imageSrc: './img/kenji/fall.png', 
            framesMax: 2,  
        },
        attack1: {
            imageSrc: './img/kenji/attack1.png', 
            framesMax: 4,  
        },
        takeHit: {
            imageSrc: './img/kenji/take hit.png', 
            framesMax: 3,  
        },
        death: {
            imageSrc: './img/kenji/death.png', 
            framesMax: 7,  
        },
    },       
    attackBox: {
        offset: {
            x: -150,
            y: 0
        }, 
        width: 135,
        height: 150
        }
});

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w: {
        pressed: false
    },
    p:{
        pressed: true
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    bkg.update();
    
    //enables puase

    if(!keys.p.pressed){
        player.update();
        enemy.update();   
    }

      
    player.velocity.x = 0;
    enemy.velocity.x = 0;
    
    //player's movement
    

    if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -2;
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 2;
        player.switchSprite('run')
    } else {
      player.switchSprite('idle')  
    }

    //jumping

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }


    //enemy's movement 

    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -2;
        enemy.switchSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 2;
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
    }

    //jumping

    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision

    if(
        rectangularCollision({
           rectangle1: player,
           rectangle2: enemy 
        }) && 
        player.isAttacking && 
        player.framesCurrnet === 4 
        ) {
        enemy.takeHit()
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health +'%'
        })
    };

    if(player.isAttacking && player.framesCurrnet === 4){
        player.isAttacking = false;
    }

    if(
        rectangularCollision({
           rectangle1: enemy,
           rectangle2: player 
        }) && enemy.isAttacking){
        player.takeHit()
        enemy.isAttacking = false; 
        gsap.to('#playerHealth', {
            width: player.health +'%'
        })
    };

    if(enemy.isAttacking && enemy.framesCurrnet === 2){
        enemy.isAttacking = false;
    }
    
    // end game based on health 
    if(enemy.health <= 0 || player.health <= 0){
        determineWinner({ player, enemy, timerId });
    };
}

animate();

window.addEventListener('keydown',(event)=>{
    switch(event.key){
        case 'p':
            keys.p.pressed = !keys.p.pressed;
            pausebutton();
        break
    }
    
    if(!player.dead){
    switch (event.key) {

        //Player's keys
        
        case 'd':
            keys.d.pressed = true;
            player.lastkey = 'd';
        break
        case 'a':
            keys.a.pressed = true;
            player.lastkey = 'a'; 
        break    
        case 'w':
            player.velocity.y = -11;
        break
        case 's':
            player.attack()
        break  
        }
    };
    
    if(!enemy.dead){ 
    switch (event.key){

        //Enemy's keys

        case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastkey = 'ArrowRight';
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastkey = 'ArrowLeft'; 
        break    
        case 'ArrowUp':
            enemy.velocity.y = -11;
        break        
        case 'ArrowDown':
            enemy.attack();
        break
    }
}

})        

window.addEventListener('keyup',(event)=>{
    switch (event.key) {

        //Player's Keys

        case 'd':
            keys.d.pressed = false;
        break
        case 'a':
            keys.a.pressed = false;
        break
        case 'w':
            keys.w.pressed = false;
        break


        //Enemy's keys

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
        break

    }
    
})

