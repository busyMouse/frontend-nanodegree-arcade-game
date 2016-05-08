/**
* @description abstract class for all actors on the stage
* @constructor
* @param {intiger} x - horizontal position
* @param {intiger} y - vertical position
*/
var Character = function(x,y){
    this.x = x;
    this.y = y;
};

/**
* @description Draw the character on the screen
*/
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Enemies our player must avoid
* @constructor
* @param {intiger} row - number of the row where enemy moves
*/
var Enemy = function(row) {
    Character.call(this, this.randomHorizontalStartPosition(), row * 83 - 20);
    this.speed = this.randomSpeed();
    this.sprite = 'images/enemy-bug.png';
};

/**
* @description Enemy inherits from Character
*/
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
* @description update the enemy's position
* @param {number} dt - a time delta between ticks
*/
Enemy.prototype.update = function(dt) {
    this.x += dt * this.speed;
    if(this.x >= 5*101){
        this.x = this.randomHorizontalStartPosition();
        this.speed = this.randomSpeed();
    }
};

/**
* @description sets enemy bug speed to random
* @return speed of enemy
*/
Enemy.prototype.randomSpeed = function(){
    return Math.floor(Math.random()*350+50);
};

/**
* @description sets random horizontal position
* @return x
*/
Enemy.prototype.randomHorizontalStartPosition = function(){
    return -Math.floor(Math.random()*300+100);
};

/**
* @description create player
* @constructor
*/
var Player = function() {
    Character.call(this, 0, 0);
    this.reset();
};

/**
* @description Player inherits from Character
*/
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
* @description update player
* @param {number} dt - a time delta between ticks
*/
Player.prototype.update = function(dt) {
    // no op
};

/**
* @description handles player movement
* @param {text} key - type of key user pressed on the keyboard
*/
Player.prototype.handleInput = function(key) {
    if(this.canMove){
        switch(key){
            case 'left':
                this.col = Math.max(--this.col,0);
                this.x = this.col  * 101;
                break;
            case 'up':
                this.row = Math.max(--this.row,0);
                this.y = this.row * 83-20;
                break;
            case 'right':
                this.col = Math.min(++this.col,4);
                this.x = this.col  * 101;
                break;
            case 'down':
                this.row = Math.min(++this.row,5);
                this.y = this.row * 83-20;
                break;
        }
    }
};

/**
* @description reset player position and image to default
*/
Player.prototype.reset = function(){
    this.sprite = 'images/char-cat-girl.png';
    this.col = 2;
    this.x = this.col  * 101;
    this.row = 5;
    this.y = this.row * 83-20;
    this.canMove = true;
};

/**
* @description change image of the player, block movement and reset player after timeout. Since setTimeout uses global context we need to bind 'this' to player instance.
*/
Player.prototype.kill = function(){
    this.canMove = false;
    this.sprite = 'images/char-cat-dead-girl.png';
    setTimeout(this.reset.bind(this), 500);
};

/**
* @description change image of the player, block movement and reset player after timeout. Since setTimeout uses global context we need to bind 'this' to player instance.
*/
Player.prototype.win = function(){
    this.canMove = false;
    this.sprite = 'images/char-cat-girl-win.png';
    setTimeout(this.reset.bind(this), 500);
};

var allEnemies = createEnemies();

/**
* @description creates enemies array
* @returns {array} array of enemies
*/
function createEnemies(){
    var enemies = [];
    enemies.push(new Enemy(3));
    enemies.push(new Enemy(3));

    enemies.push(new Enemy(2));
    enemies.push(new Enemy(2));
    enemies.push(new Enemy(2));

    enemies.push(new Enemy(1));
    enemies.push(new Enemy(1));
    return enemies;
}

var player = new Player();

/**
* @description listenes to user keyboard events
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});