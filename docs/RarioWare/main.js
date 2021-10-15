title = " RarioWare";

description = `
 `;

characters = [
`
  bbb 
  bbb 
   b  
  bbb 
   b  
  b b
`,

`
  bbb 
  bbb 
   b  
  bbb 
   b  
  b b
`,

`
RR  RR
RRRRLR
RRRrrR
RRRRRR
 RRRR 
  RR  
`,

`
RllllR
lRllRl
lRllRl
lRllRl
lRllRl
RllllR
`,

`
BBgggB
Bggggg
BgBlBg
bbblbb
YYYlYY
YYYYYY
`,

`
 RRRRR
RRR  R
RRRRRR
RRRRRR
 R  R 
 RR RR
`,

`
      
    y 
y   yy
 yyyyy
  yyy 
  y y 
`
];
  

const G = {
  WIDTH: 75,
  HEIGHT: 75,

  RANDOM_START: false,
  STARTING_GAME: 1, // FIRST GAME INDEX IF RANDOM IS FALSE
  GAME_TIMES: [4, 4],  // Measured in seconds

  // ICON MINIGAME
  STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
  JUMP_HEIGHT: 4,
  MIN_CHARACTERS: 3,
  MAX_CHARACTERS: 8,
  PLAYER_SECONDS: 0,
  ICON_CHOOSER: 0,
  PLAYER_ICON: 0,
};

options = {
  theme: 'pixel',
  isPlayingBgm: true,
  seed:1124, //4,7,9,11,65, 1124
  viewSize: {x: G.WIDTH, y: G.HEIGHT}
};


/** @type  { number } */
let gameIndex;

// a storage for unplayed games and their timer
/** @typedef {{duration: number}} Games */
/** @type  { Games[] } */
let games;

/** @type  { number } */
let gameTimer = 0;

/** @typedef {{pos: Vector, speed: number}} rain */
/** @type  { rain[] } */
let rain;

/** @typedef {{pos: Vector, speed: number}} press_me */
/** @type  { press_me[] } */
let press_me;

/** @typedef {{pos: Vector}} NPC */
/** @type { NPC } */
let npc;

/** @typedef {{pos: Vector}} Player */
/** @type { Player } */
let player;


function update() {
  if (!ticks) {
    initialize()
  }

  if (gameIndex == 0) {
    tileMatcher();
  }

  if (gameIndex == 1) {
    dontPressIt();
  }

  timerManager();
}

//~~~~~~~Main game utility functions~~~~~~~
function initialize()
{
  games = [];
  fillGames();

  if (G.RANDOM_START) {
    gameIndex = floor(rnd(0, games.length));
  } else {
    gameIndex = G.STARTING_GAME;
  }
  

  rain = times(20, () => {
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(0, G.HEIGHT);
    return {
      pos: vec(posX, posY),
      speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
    };
  });

  press_me = times(24, () => {
    const posX = rnd(0, 15);
    const posY = rnd(-55, G.HEIGHT);
    return {
      pos: vec(posX, posY),
      speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
    };
  });

  npc = {
    pos: vec(43, 72), 
  };

  player = {
    pos: vec(32, 72),
  };
}

function fillGames() {
  for (let index = 0; index < G.GAME_TIMES.length; index++) {
    games.push({
      duration: G.GAME_TIMES[index]
    });
  }
}

function timerManager() {
  gameTimer += 1/60;
  var currentGame = games[gameIndex];
  if (gameTimer > currentGame.duration) {
    transitionGame();
  }
}

// switches to next index and resets timer
function transitionGame() {
  if (games.length > 1) {
    games.splice(gameIndex, 1);
  } else {
    games.pop();
    fillGames();
  }
  gameIndex = floor(rnd(0, games.length - 1));

  gameTimer = 0;
}

//~~~~~~~Microgames~~~~~~~
function dontPressIt() {

  var flag = 1;

  if(ticks % 75  <= 35)
    flag = -flag;
  
  if(flag == -1)
    color("yellow");
  else
    color("red");
  rect( 18, 19, 38, 35 );
  color("black");
  text("DONT", 27, 30);
  text("PRESS", 24, 40);

  color("transparent");

  //color("red");
  if(input.isJustPressed &&  rect(input.pos.x, input.pos.y, 1, 1).isColliding.rect.red)
    addScore(-10 * difficulty);

  if(flag == -1)
    color("green");
  else
    color("black");

  particle(18, 19);
 //particle(37, 19);
  particle(56, 19);
  particle(18, 57);
  particle(56, 57);
  


    press_me.forEach((s) => {
      // Move the text downwards
      s.pos.y += s.speed;
      // Bring the text back to top once it's past the bottom of the screen
      s.pos.wrap(0, G.WIDTH, -55, G.HEIGHT);

  
      // Choose a color to draw
      color("cyan");
      // Draw the text
      text("PRESS ME!!!", s.pos);

      color("yellow");

    });

    color("transparent");

    if(rect(input.pos, 10, 10).isColliding.text["PRESS ME!!!"] && input.isPressed)
      addScore(10 * difficulty);


}

function tileMatcher() {
  rain.forEach((s) => {
    // Move the rain downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_blue");
    // Draw the rain as a square of size 1
    box(s.pos, 1);
  });

  color ("green");
  box(50, 63, 10, 10);

  color ("blue");
  box(50, 63, 8, 8);

  color ("green");
  box(32, 63, 10, 10);

  color ("blue");
  box(32, 63, 8, 8);

  // CHOOSING ICON AT START OF GAME
  if (G.ICON_CHOOSER == 0) {
    G.ICON_CHOOSER = rndi(G.MIN_CHARACTERS, G.MAX_CHARACTERS);
  }

  if (G.ICON_CHOOSER == 3) {
    color("black");
    char("c", 50, 63)
  }
  else if (G.ICON_CHOOSER == 4) {
    color("black");
    char("d", 50, 63)
  }
  else if (G.ICON_CHOOSER == 5) {
    color("black");
    char("e", 50, 63)
  }
  else if (G.ICON_CHOOSER == 6) {
    color("black");
    char("f", 50, 63)
  }
  else if (G.ICON_CHOOSER == 7) {
    color("black");
    char("g", 50, 63)
  }

  npc.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
  color ("red");
  char("b", npc.pos);

  // UPDATING AND DRAWING THE PLAYER
  if (G.PLAYER_SECONDS > 60) {
    G.PLAYER_ICON = rndi(G.MIN_CHARACTERS, G.MAX_CHARACTERS);
    G.PLAYER_SECONDS = 0;
  }
  G.PLAYER_SECONDS++;
  if (G.PLAYER_ICON == 3) {
    color("black");
    char("c", 32, 63)
  }
  else if (G.PLAYER_ICON == 4) {
    color("black");
    char("d", 32, 63)
  }
  else if (G.PLAYER_ICON == 5) {
    color("black");
    char("e", 32, 63)
  }
  else if (G.PLAYER_ICON == 6) {
    color("black");
    char("f", 32, 63)
  }
  else if (G.PLAYER_ICON == 7) {
    color("black");
    char("g", 32, 63)
  }

  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT - 3);
  color("black");
  char("a", player.pos);

  // INPUT_DETECTION
  if (input.isJustPressed) {
    player.pos.y -= G.JUMP_HEIGHT;
    if (G.PLAYER_ICON == G.ICON_CHOOSER) {
      play('coin');
      addScore(10 * difficulty);
    }
    else {
      play('explosion');
      addScore(-10 * difficulty);
    }
  }
  else if (input.isJustReleased || input.isPressed) {
    player.pos.y += G.JUMP_HEIGHT;
  }
}
