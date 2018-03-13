


var gameScene = new Phaser.Scene('Game');

// game parameters
gameScene.playerSpeed = 1.5;
gameScene.enemySpeed = 2;
gameScene.enemyMaxY = 280;
gameScene.enemyMinY = 80;
gameScene.isPlayerAlive = true;

// load asset files for our game
gameScene.preload = function() {
  console.log(this);
  // load images
  this.load.image('background', 'assets/background.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('dragon', 'assets/dragon.png');
  this.load.image('treasure', 'assets/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function() {

  // background
  this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'background');
  //this.add.image(0, 0, 'sky').setOrigin(0);

  // player
  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

  // scale down
  this.player.setScale(0.5);
  //this.player.scaleX = 0.5;
  //this.player.scaleY = 0.5;

  // goal
  this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'treasure');
  this.treasure.setScale(0.6);

  // enemies
  // this.enemy = this.add.sprite(160, this.sys.game.config.height / 2, 'dragon');
  // this.enemy.setScale(0.5);
  // this.enemy.flipX = true;

  // group of enemies
  

  // player is alive!
  this.isPlayerAlive = true;
};

// executed on every frame
gameScene.update = function() {

  // only if the player is alive
  if (!this.isPlayerAlive) {
    return;
  }
  // move when input down
  if (this.input.activePointer.isDown) {
    //this.scene.stop('default');

    this.player.x += this.playerSpeed;
  }
  // move enemies
  this.enemy.y += this.enemySpeed;

  if (this.enemy.y >= this.enemyMaxY && this.enemySpeed > 0) {
    this.enemySpeed *= -1;
  } else if (this.enemy.y <= this.enemyMinY && this.enemySpeed < 0) {
    this.enemySpeed *= -1;
  }

  // enemy collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy.getBounds())) {
    this.gameOver();
  }

  // treasure collision
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
    this.gameOver();
  }
};

gameScene.gameOver = function() {
  this.isPlayerAlive = false;

  // shake the camera
  this.cameras.main.shake(500);

  // fade camera
  this.time.delayedCall(250, function() {
    this.cameras.main.fade(250);
  }, [], this);

  // restart game
  this.time.delayedCall(500, function() {
    this.scene.manager.bootScene(this);
  }, [], this);

  // reset camera effects
  this.time.delayedCall(600, function() {
    this.cameras.main.resetFX();
  }, [], this);
}

var config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

var game = new Phaser.Game(config);
