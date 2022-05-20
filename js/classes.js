class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0 , y: 0} }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale; 
        this.framesMax = framesMax;
        this.framesCurrnet = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrnet * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
            )
    };

    animateFrames() {
        this.framesElapsed ++
        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrnet < this.framesMax - 1){
                this.framesCurrnet ++
            } else {
            this.framesCurrnet = 0
            }
        } 
    }

    update() { 
        this.draw();
        this.animateFrames()
    };  

};

class Fighter extends Sprite {
    constructor({ 
        position, 
        velocity, 
        color = 'red', 
        offset = {x: 0, y: 0}, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        sprites, 
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        },
        framesHold = 10
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.framesCurrnet = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.velocity = velocity;
        this.width = 75;
        this.height = 150;
        this.lastkey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y:this.position.y
            }, 
            offset: attackBox.offset,
            width: attackBox.width, 
            height: attackBox.height
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }


    }

    update() {  
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(!this.dead){
            this.animateFrames()    
        }
    
        

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 96 ){
            this.velocity.y = 0;
            this.position.y = 330.04999999999956;
            
        } 
        else this.velocity.y += gravity;
    };  

    attack() {
            this.switchSprite('attack1')
            this.isAttacking = true;
        }

    takeHit() {
        this.health -= 20
        if(this.health <= 0){
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrnet === this.sprites.death.framesMax - 1 ){
                this.dead = true;
            }
            return;
        };  

        if(
            this.image === this.sprites.attack1.image &&
            this.framesCurrnet < this.sprites.attack1.framesMax - 1
            ) 
            return;

        if(
            this.image === this.sprites.takeHit.image &&
            this.framesCurrnet < this.sprites.takeHit.framesMax - 1
            ) 
            return;

        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrnet = 0
            }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                this.image = this.sprites.run.image 
                this.framesMax = this.sprites.run.framesMax 
                this.framesCurrnet = 0 
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                this.image = this.sprites.jump.image;
                this.framesMax = this.sprites.jump.framesMax
                this.framesCurrnet = 0
                }
                break;            
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                this.image = this.sprites.fall.image;
                this.framesMax = this.sprites.fall.framesMax
                this.framesCurrnet = 0
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                this.image = this.sprites.attack1.image;
                this.framesMax = this.sprites.attack1.framesMax
                this.framesCurrnet = 0
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                this.image = this.sprites.takeHit.image;
                this.framesMax = this.sprites.takeHit.framesMax
                this.framesCurrnet = 0
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                this.image = this.sprites.death.image;
                this.framesMax = this.sprites.death.framesMax
                this.framesCurrnet = 0
                }
                break;
            
        };
    }

};
