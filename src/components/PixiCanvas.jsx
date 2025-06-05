import * as PIXI from 'pixi.js';
import React from 'react';
import levels from './levels.json';

const imageScale = 3;
const tileSize = 8 * imageScale;
const blockSize = 16 * imageScale;
const imagePath = "./jeu_assets_x" + imageScale + ".png"

function clamp(t, min, max) {
    return Math.max(Math.min(max, t), min)
}

function sinEase(t) {
    return Math.sin((t - 0.5) * Math.PI) * 0.5 + 0.5
}

class Block {
    constructor (n) {
        this.n = n;
        let n2 = n % 2;
        n -= n2;
        let n4 = n % 4;
        n -= n4;
        let n8 = n % 8;
        n -= n8;
        let n16 = n % 16;
        this.space = n2 != 0;
        this.solid = !this.space;
        this.goal = n4 != 0;
        this.box = n8 != 0;
        this.player = n16 != 0;
    }

    static DEFAULT = new Block(0);
}

const testmap = {
    name: "test",
    blocks: [
        [0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,1,1,1,0,0,0,0,0],
        [0,1,1,5,1,9,3,0,0,0,0,0,0],
        [0,1,0,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
}


const tilesetImage = new Image();
tilesetImage.src = imagePath;

const tilesetData = {
	frames: {
		player1: {
			frame: { x: 0*imageScale, y: 0, w: 16*imageScale, h: 16*imageScale },
			sourceSize: { w: 16*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 16*imageScale, h: 16*imageScale }
		},
		player2: {
			frame: { x: 16*imageScale, y: 0, w: 16*imageScale, h: 16*imageScale },
			sourceSize: { w: 16*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 16*imageScale, h: 16*imageScale }
		},
        box: {
			frame: { x: 32*imageScale, y: 0, w: 16*imageScale, h: 16*imageScale },
			sourceSize: { w: 16*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 16*imageScale, h: 16*imageScale }
		},
		box2: {
			frame: { x: 48*imageScale, y: 0, w: 16*imageScale, h: 16*imageScale },
			sourceSize: { w: 16*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 16*imageScale, h: 16*imageScale }
		},
        partA0: {
			frame: { x: 56*imageScale, y: 16*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		partA1: {
			frame: { x: 56*imageScale, y: 20*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		partA2: {
			frame: { x: 56*imageScale, y: 24*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		partA3: {
			frame: { x: 62*imageScale, y: 16*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		partA4: {
			frame: { x: 62*imageScale, y: 20*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		partA5: {
			frame: { x: 62*imageScale, y: 24*imageScale, w: 6*imageScale, h: 4*imageScale },
			sourceSize: { w: 6*imageScale, h: 4*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 6*imageScale, h: 4*imageScale }
		},
		recommencer: {
			frame: { x: 0*imageScale, y: 40*imageScale, w: 76*imageScale, h: 10*imageScale },
			sourceSize: { w: 76*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 76*imageScale, h: 10*imageScale }
		},
		recommencer2: {
			frame: { x: 0*imageScale, y: 69*imageScale, w: 76*imageScale, h: 10*imageScale },
			sourceSize: { w: 76*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 76*imageScale, h: 10*imageScale }
		},
		bouger: {
			frame: { x: 0*imageScale, y: 50*imageScale, w: 53*imageScale, h: 19*imageScale },
			sourceSize: { w: 53*imageScale, h: 19*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 53*imageScale, h: 19*imageScale }
		},
		bouger2: {
			frame: { x: 53*imageScale, y: 50*imageScale, w: 53*imageScale, h: 19*imageScale },
			sourceSize: { w: 53*imageScale, h: 19*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 53*imageScale, h: 19*imageScale }
		},
        pause: {
            frame: { x: 76*imageScale, y: 79*imageScale, w: 41*imageScale, h: 10*imageScale },
			sourceSize: { w: 41*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 41*imageScale, h: 10*imageScale }
        },
        pause2: {
            frame: { x: 76*imageScale, y: 69*imageScale, w: 41*imageScale, h: 10*imageScale },
			sourceSize: { w: 41*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 41*imageScale, h: 10*imageScale }
        },
        jouer: {
            frame: { x: 63*imageScale, y: 128*imageScale, w: 48*imageScale, h: 10*imageScale },
			sourceSize: { w: 48*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 10*imageScale }
        },
        jouer2: {
            frame: { x: 76*imageScale, y: 89*imageScale, w: 41*imageScale, h: 10*imageScale },
			sourceSize: { w: 41*imageScale, h: 10*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 41*imageScale, h: 10*imageScale }
        },
        suivantbtn: {
            frame: { x: 0*imageScale, y: 128*imageScale, w: 63*imageScale, h: 16*imageScale },
			sourceSize: { w: 63*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 63*imageScale, h: 16*imageScale }
        },
        niveauxbtn: {
            frame: { x: 0*imageScale, y: 144*imageScale, w: 63*imageScale, h: 16*imageScale },
			sourceSize: { w: 63*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 63*imageScale, h: 16*imageScale }
        },
        jouerbtn: {
            frame: { x: 0*imageScale, y: 160*imageScale, w: 63*imageScale, h: 16*imageScale },
			sourceSize: { w: 63*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 63*imageScale, h: 16*imageScale }
        },
        suivantbtn2: {
            frame: { x: 0*imageScale, y: 80*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        niveauxbtn2: {
            frame: { x: 0*imageScale, y: 96*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        jouerbtn2: {
            frame: { x: 0*imageScale, y: 112*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        levelA: {
            frame: { x: 48*imageScale, y: 80*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        levelB: {
            frame: { x: 48*imageScale, y: 96*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        levelC: {
            frame: { x: 48*imageScale, y: 112*imageScale, w: 48*imageScale, h: 16*imageScale },
			sourceSize: { w: 48*imageScale, h: 16*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 48*imageScale, h: 16*imageScale }
        },
        pauselbl: {
            frame: { x: 92*imageScale, y: 31*imageScale, w: 36*imageScale, h: 12*imageScale },
			sourceSize: { w: 36*imageScale, h: 12*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 36*imageScale, h: 12*imageScale }
        },
        bravolbl: {
            frame: { x: 88*imageScale, y: 19*imageScale, w: 40*imageScale, h: 12*imageScale },
			sourceSize: { w: 40*imageScale, h: 12*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 40*imageScale, h: 12*imageScale }
        },
        sokobanlbl: {
            frame: { x: 77*imageScale, y: 7*imageScale, w: 51*imageScale, h: 12*imageScale },
			sourceSize: { w: 51*imageScale, h: 12*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 51*imageScale, h: 12*imageScale }
        },
        levelselect: {
            frame: { x: 69*imageScale, y: 108*imageScale, w: 25*imageScale, h: 20*imageScale },
			sourceSize: { w: 25*imageScale, h: 20*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 25*imageScale, h: 20*imageScale }
        },
        tutorial1: {
            frame: { x: 63*imageScale, y: 138*imageScale, w: 65*imageScale, h: 23*imageScale },
			sourceSize: { w: 65*imageScale, h: 23*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 65*imageScale, h: 23*imageScale }
        },
        tutorial2: {
            frame: { x: 63*imageScale, y: 161*imageScale, w: 63*imageScale, h: 15*imageScale },
			sourceSize: { w: 63*imageScale, h: 15*imageScale },
			spriteSourceSize: { x: 0, y: 0, w: 63*imageScale, h: 15*imageScale }
        },
	},
	meta: {
		image: imagePath,
		format: 'RGBA8888',
		size: { w: 128 * imageScale, h: 176 * imageScale },
		scale: 1
	}
}

const levelsspacing = 8 * imageScale;
const levelslength = levels.levels.length;
const levelscolumns = 6;
const levelsrows = Math.ceil(levelslength / levelscolumns);
const levelsblckW = 21 * imageScale;
const levelsblckH = 16 * imageScale;

function drawlevelselector() {
    const cvx = new OffscreenCanvas(levelsblckW * levelscolumns + levelsspacing * (levelscolumns - 1), levelsblckH * levelsrows + levelsspacing * (levelsrows - 1));
    const ctx = cvx.getContext("2d");


    for (let levelId = 0; levelId < levelslength; levelId++) {
        const name = levels.levels[levelId].name;
        const col = levelId % levelscolumns;
        const row = Math.floor(levelId / levelscolumns);
        let dx = (levelsspacing + levelsblckW) * col;
        let dy = (levelsspacing + levelsblckH) * row;
        let frame =tilesetData.frames.levelA.frame;
        if (levelId >= 24) {
            frame = tilesetData.frames.levelC.frame;
        } else if (levelId >= 12) {
            frame = tilesetData.frames.levelB.frame;
        }
        let nbPad = 4 * imageScale;
        let nbW = 5 * imageScale;
        let nbH = 7 * imageScale;
        let nbGap = 4 * imageScale;
        const numbers = {
            "0": 123,
            "1": 83,
            "2": 88,
            "3": 92,
            "4": 97,
            "5": 101,
            "6": 105,
            "7": 110,
            "8": 114,
            "9": 119,
            "e": 69,
            "n": 73,
            "d": 78
        }
        ctx.drawImage(tilesetImage, frame.x, frame.y, levelsblckW, levelsblckH, dx, dy, levelsblckW, levelsblckH);
        ctx.drawImage(tilesetImage, numbers[name[0]] * imageScale, 0, nbW, nbH, dx + nbPad + 0 * nbGap, dy + nbPad, nbW, nbH);
        ctx.drawImage(tilesetImage, numbers[name[1]] * imageScale, 0, nbW, nbH, dx + nbPad + 1 * nbGap, dy + nbPad, nbW, nbH);
        ctx.drawImage(tilesetImage, numbers[name[2]] * imageScale, 0, nbW, nbH, dx + nbPad + 2 * nbGap, dy + nbPad, nbW, nbH);
    }

    return cvx;
    
}

async function waitForTilesetImage() {
    return new Promise((resolve, reject) => {
        let i;
        i = setInterval(() => {
            if (tilesetImage.complete) {
                clearInterval(i);
                resolve(tilesetImage)
            }
        }, 20);
    })
}

function expFollow( deltaTime, current, target, expFollowRatio = 0.000001 ) {
    let diff = target - current;
    let new_diff = diff * Math.pow( expFollowRatio, deltaTime );
    return target - new_diff;
}

const PixiCanvas = () => {
    const canvasRef = React.useRef(null);
    const pixiAppRef = React.useRef(null); // Référence persistante de PIXI.Application
    const spriteRef = React.useRef(null); // Référence à ton sprite principal
    const dataRef = React.useRef(new PIXI.Text("init"));
    const spritesheet = React.useRef(null);
    const playerRef = React.useRef(null);
    const gameRef = React.useRef(null);
    const levelRef = React.useRef(null);

    

    function screenCenter() {
        return [
            Math.round(window.innerWidth / 2),
            Math.round(window.innerHeight / 2)
        ]
    }

    class Particle {

        static TYPE1 = "partA2";
        static TYPE2 = "partA3";
        static TYPE3 = "partA4";
        static TYPE4 = "partA5";

        static PARTICLES = [];

        static updateAll(deltaTime) {
            let list = []
            for (let i = 0; i < this.PARTICLES.length; i++) {
                const particle = this.PARTICLES[i];
                particle.update(deltaTime);
                if (particle.alive) {
                    list.push(particle);
                } else {
                    particle.destroy();
                }
            }
            this.PARTICLES = list;
        }

        static add(container, lifetime, startX, startY, endX, endY, partType, rot) {
            this.PARTICLES.push(new Particle(container, lifetime, startX, startY, endX, endY, partType, rot));
        }
        
        constructor (container, lifetime, startX, startY, endX, endY, partType, rot) {
            this.lifetime = lifetime;
            this.startX = startX;
            this.startY = startY;
            this.endX = startX + endX;
            this.endY = startY + endY;
            this.currentX = startX;
            this.currentY = startY;
            this.currentRot = rot;
            this.start = performance.now();
            this.end = performance.now() + this.lifetime;
            this.alive = this.lifetime > 0.0;
            this.spriteFG = new PIXI.Sprite(spritesheet.current.textures["partA0"]);
            this.spriteFG.anchor.set(0.5, 0.5);
            this.spriteBG = new PIXI.Sprite(spritesheet.current.textures["partA1"]);
            this.spriteBG.anchor.set(0.5, 0.5);
            this.spriteDS = new PIXI.Sprite(spritesheet.current.textures[partType]);
            this.spriteDS.anchor.set(0.5, 0.5);
            this.container = container;
            this.apply();
            this.container.addChild(this.spriteBG);
            this.container.addChild(this.spriteDS);
            this.container.addChild(this.spriteFG);
        }

        update(deltaTime) {
            if (performance.now() > this.end) {
                this.alive = false;
            } else {
                this.currentX = expFollow(deltaTime, this.currentX, this.endX, 0.00001);
                this.currentY = expFollow(deltaTime, this.currentY, this.endY, 0.00001);
                this.apply();
            }
        }

        apply() {
            this.spriteFG.x = this.currentX;
            this.spriteFG.y = this.currentY;
            this.spriteFG.angle = this.currentRot;
            this.spriteBG.x = this.currentX;
            this.spriteBG.y = this.currentY;
            this.spriteBG.angle = this.currentRot;
            this.spriteDS.x = this.currentX;
            this.spriteDS.y = this.currentY + imageScale;
            this.spriteDS.angle = this.currentRot;
        }

        destroy() {
            this.spriteBG.destroy();
            this.spriteDS.destroy();
            this.spriteFG.destroy();
        }
    }

    class Player {
        static me() {
            return playerRef.current;
        }
        constructor (x, y, level) {
            this.level = level;
            playerRef.current = this;
            this.frame = 0;
            this.gridX = x;
            this.gridY = y;
            let [sx, sy] = this.level.gridToScreen(x, y);
            this.screenX = sx;
            this.screenY = sy;
            this.targetX = sx;
            this.targetY = sy;
            this.targetAngle = 0;
            this.screenAngle = 0;
        }

        place(x, y) {
            this.gridX = x;
            this.gridY = y;
        }

        move(x, y) {
            this.gridX += x;
            this.gridY += y;
        }

        destroy() {
            this.sprite.destroy();
        }

        init() {
            this.sprite = new PIXI.Sprite(spritesheet.current.textures["player1"]);
            this.sprite.anchor.set(0.5);
            this.sprite.x = this.screenX;
            this.sprite.y = this.screenY;
            this.sprite.width = blockSize;
            this.sprite.height = blockSize;
            this.sprite.angle = this.screenAngle;
            this.level.sprite.addChild(this.sprite);
        }

        update(deltaTime) {
            let [sx, sy] = this.level.gridToScreen(this.gridX, this.gridY);
            this.targetX = sx;
            this.targetY = sy;
            this.screenX = expFollow(deltaTime, this.screenX, this.targetX);
            this.screenY = expFollow(deltaTime, this.screenY, this.targetY);

            if (this.screenAngle - this.targetAngle > 2) {
                this.screenAngle = this.screenAngle - 4;
            } else if (this.targetAngle - this.screenAngle > 2) {
                this.screenAngle = this.screenAngle + 4;
            }

            this.screenAngle = expFollow(deltaTime, this.screenAngle, this.targetAngle, 0.000000001);
            this.sprite.x = this.screenX;
            this.sprite.y = this.screenY;
            this.sprite.angle = this.screenAngle * 90;
            if (this.frame++ % 120 < 5) {
                this.sprite.texture = spritesheet.current.textures["player2"];
            } else {
                this.sprite.texture = spritesheet.current.textures["player1"];
            }
        }

        pushleft() {
            if (this.level.getAt(this.gridX - 1, this.gridY).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX - 1 == cbox.gridX && this.gridY == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (box) {
                    if (box.pushleft()) {
                        this.move(-1, 0);
                        return true;
                    } else {
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -1.0, blockSize *  0.0, Particle.TYPE2, 0);
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -0.8, blockSize * -0.6, Particle.TYPE2, 0 + 30);
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -0.8, blockSize *  0.6, Particle.TYPE2, 0 - 30);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * -1.5, this.screenY, blockSize * -1.0, blockSize *  0.0, Particle.TYPE2, 0);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * -1.5, this.screenY, blockSize * -0.8, blockSize * -0.6, Particle.TYPE2, 0 + 30);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * -1.5, this.screenY, blockSize * -0.8, blockSize *  0.6, Particle.TYPE2, 0 - 30);
                        this.screenX -= imageScale * 4;
                    }
                } else {
                    this.move(-1, 0);
                    return true;
                }
            } else {
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -1.0, blockSize *  0.0, Particle.TYPE2, 0);
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -0.8, blockSize * -0.6, Particle.TYPE2, 0 + 30);
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * -0.5, this.screenY, blockSize * -0.8, blockSize *  0.6, Particle.TYPE2, 0 - 30);
                this.screenX -= imageScale * 4;
            }
            return false;
        }
        pushright() {
            if (this.level.getAt(this.gridX + 1, this.gridY).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX + 1 == cbox.gridX && this.gridY == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (box) {
                    if (box.pushright()) {
                        this.move(1, 0);
                        return true;
                    } else {
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 1.0, blockSize *  0.0, Particle.TYPE2, 0);
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 0.8, blockSize * -0.6, Particle.TYPE2, 0 - 30);
                        // Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 0.8, blockSize *  0.6, Particle.TYPE2, 0 + 30);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * 1.5, this.screenY, blockSize * 1.0, blockSize *  0.0, Particle.TYPE2, 0);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * 1.5, this.screenY, blockSize * 0.8, blockSize * -0.6, Particle.TYPE2, 0 - 30);
                        Particle.add(this.level.sprite, 400, this.screenX + blockSize * 1.5, this.screenY, blockSize * 0.8, blockSize *  0.6, Particle.TYPE2, 0 + 30);
                        this.screenX += imageScale * 4;
                    }
                } else {
                    this.move(1, 0);
                    return true;
                }
            } else {
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 1.0, blockSize *  0.0, Particle.TYPE2, 0);
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 0.8, blockSize * -0.6, Particle.TYPE2, 0 - 30);
                Particle.add(this.level.sprite, 400, this.screenX + blockSize * 0.5, this.screenY, blockSize * 0.8, blockSize *  0.6, Particle.TYPE2, 0 + 30);
                this.screenX += imageScale * 4;
            }
            return false;
        }
        pushup() {
            if (this.level.getAt(this.gridX, this.gridY - 1).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX == cbox.gridX && this.gridY - 1 == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (box) {
                    if (box.pushup()) {
                        this.move(0, -1);
                        return true;
                    } else {
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize *  0.0, blockSize * -1.0, Particle.TYPE2, 90);
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize * -0.6, blockSize * -0.8, Particle.TYPE2, 90 - 30);
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize *  0.6, blockSize * -0.8, Particle.TYPE2, 90 + 30);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -1.5, blockSize *  0.0, blockSize * -1.0, Particle.TYPE2, 90);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -1.5, blockSize * -0.6, blockSize * -0.8, Particle.TYPE2, 90 - 30);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -1.5, blockSize *  0.6, blockSize * -0.8, Particle.TYPE2, 90 + 30);
                        this.screenY -= imageScale * 4;
                    }
                } else {
                    this.move(0, -1);
                    return true;
                }
            } else {
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize *  0.0, blockSize * -1.0, Particle.TYPE2, 90);
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize * -0.6, blockSize * -0.8, Particle.TYPE2, 90 - 30);
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * -0.5, blockSize *  0.6, blockSize * -0.8, Particle.TYPE2, 90 + 30);
                this.screenY -= imageScale * 4;
            }
            return false;
        }
        pushdown() {
            if (this.level.getAt(this.gridX, this.gridY + 1).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX == cbox.gridX && this.gridY + 1 == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (box) {
                    if (box.pushdown()) {
                        this.move(0, 1);
                        return true;
                    } else {
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize *  0.0, blockSize *  1.0, Particle.TYPE2, 90);
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize * -0.6, blockSize *  0.8, Particle.TYPE2, 90 + 30);
                        // Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize *  0.6, blockSize *  0.8, Particle.TYPE2, 90 - 30);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 1.5, blockSize *  0.0, blockSize *  1.0, Particle.TYPE2, 90);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 1.5, blockSize * -0.6, blockSize *  0.8, Particle.TYPE2, 90 + 30);
                        Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 1.5, blockSize *  0.6, blockSize *  0.8, Particle.TYPE2, 90 - 30);
                        this.screenY += imageScale * 4;
                    }
                } else {
                    this.move(0, 1);
                    return true;
                }
            } else {
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize *  0.0, blockSize *  1.0, Particle.TYPE2, 90);
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize * -0.6, blockSize *  0.8, Particle.TYPE2, 90 + 30);
                Particle.add(this.level.sprite, 400, this.screenX, this.screenY + blockSize * 0.5, blockSize *  0.6, blockSize *  0.8, Particle.TYPE2, 90 - 30);
                this.screenY += imageScale * 4;
            }
            return false;
        }
    }

    class Box {
        constructor (x, y, level) {
            this.level = level;
            this.gridX = x;
            this.gridY = y;
            let [sx, sy] = this.level.gridToScreen(x, y);
            this.screenX = sx;
            this.screenY = sy;
            this.targetX = sx;
            this.targetY = sy;
        }

        init() {
            this.sprite = new PIXI.Sprite(spritesheet.current.textures["box"]);
            this.sprite.anchor.set(0.5);
            this.sprite.x = this.screenX;
            this.sprite.y = this.screenY;
            this.sprite.width = blockSize;
            this.sprite.height = blockSize;
            this.level.sprite.addChild(this.sprite);
        }

        place(x, y) {
            this.gridX = x;
            this.gridY = y;
        }

        move(x, y) {
            this.gridX += x;
            this.gridY += y;
        }

        update(deltaTime) {
            // console.log([this.gridX, this.gridY]);
            // console.log(this.level.gridToScreen(0, 2));
            let [sx, sy] = this.level.gridToScreen(this.gridX, this.gridY);
            this.targetX = sx;
            this.targetY = sy;
            this.screenX = expFollow(deltaTime, this.screenX, this.targetX);
            this.screenY = expFollow(deltaTime, this.screenY, this.targetY);
            let tex = this.level.getAt(this.gridX, this.gridY).goal ? "box" : "box2";
            this.sprite.texture = spritesheet.current.textures[tex];
            this.sprite.x = this.screenX;
            this.sprite.y = this.screenY;
        }

        destroy() {
            this.sprite.destroy()
        }

        pushleft() {
            if (this.level.getAt(this.gridX - 1, this.gridY).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX - 1 == cbox.gridX && this.gridY == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (!box) {
                    this.move(-1, 0);
                    return true;
                } else {
                    this.screenX -= imageScale * 2;
                }
            } else {
                this.screenX -= imageScale * 2;
            }
            return false;
        }
        pushright() {
            if (this.level.getAt(this.gridX + 1, this.gridY).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX + 1 == cbox.gridX && this.gridY == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (!box) {
                    this.move(1, 0);
                    return true;
                } else {
                    this.screenX += imageScale * 2;
                }
            } else {
                this.screenX += imageScale * 2;
            }
            return false;
        }
        pushup() {
            if (this.level.getAt(this.gridX, this.gridY - 1).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX == cbox.gridX && this.gridY - 1 == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (!box) {
                    this.move(0, -1);
                    return true;
                } else {
                    this.screenY -= imageScale * 2;
                }
            } else {
                this.screenY -= imageScale * 2;
            }
            return false;
        }
        pushdown() {
            if (this.level.getAt(this.gridX, this.gridY + 1).space) {
                let box;
                for (let boxi = 0; boxi < this.level.boxes.length; boxi++) {
                    let cbox = this.level.boxes[boxi];
                    if (this.gridX == cbox.gridX && this.gridY + 1 == cbox.gridY){
                        box = cbox;
                        break;
                    }
                }
                if (!box) {
                    this.move(0, 1);
                    return true;
                } else {
                    this.screenY += imageScale * 2;
                }
            } else {
                this.screenY += imageScale * 2;
            }
            return false;
        }
    }

    class Goal {
        constructor (x, y, level) {
            this.level = level;
            this.gridX = x;
            this.gridY = y;
        }
    }

    class Level {
        constructor (game, data) {
            this.game = game;
            levelRef.current = this;
            this.originalData = data;
            this.name = data.name;
            this.gridH = data.blocks.length;
            this.gridW = data.blocks[0].length;
            this.screenW = this.gridW * blockSize;
            this.screenH = this.gridH * blockSize;
            this.blocks = [];
            this.boxes = [];
            this.goals = [];
            for (let y = 0; y < this.gridH; y++) {
                this.blocks.push([]);
                for (let x = 0; x < this.gridW; x++) {
                    // console.log([x, y]);
                    // console.log(data.blocks[y][x]);
                    let block = new Block(data.blocks[y][x]);
                    if (block.player) {
                        this.player = new Player(x, y, this);
                    }
                    if (block.box) {
                        this.boxes.push(new Box(x, y, this));
                    }
                    if (block.goal) {
                        this.goals.push(new Goal(x, y, this));
                    }
                    this.blocks[y].push(block);
                }
            }
        }

        init() {
            this.drawTilemap();
            this.texture = PIXI.Texture.from(this.cvx);
            this.sprite = new PIXI.Sprite(this.texture);
            this.sprite.anchor.set(0.5);
            let [hw, hh] = screenCenter();
            this.sprite.x = hw;
            this.sprite.y = hh;
            this.sprite.width = this.screenW;
            this.sprite.height = this.screenH;
            this.game.gamecontainer.addChild(this.sprite);
            for (let _box = 0; _box < this.boxes.length; _box++) {
                this.boxes[_box].init();
            }
            this.player.init();
            this.tutorial = null;
            if (this.name == "000") {
                this.tutorial = new PIXI.Sprite(spritesheet.current.textures["tutorial1"]);
                this.tutorial.anchor.set(0.5, 0);
                this.tutorial.x = 0;
                this.tutorial.y = this.gridH * tileSize;
                this.sprite.addChild(this.tutorial);
            } else if (this.name == "007") {
                this.tutorial = new PIXI.Sprite(spritesheet.current.textures["tutorial2"]);
                this.tutorial.anchor.set(0.5, 0);
                this.tutorial.x = 0;
                this.tutorial.y = this.gridH * tileSize;
                this.sprite.addChild(this.tutorial);
            }
        }

        destroy() {
            for (let _box = 0; _box < this.boxes.length; _box++) {
                this.boxes[_box].destroy();
            }
            this.player.destroy();
            if (this.tutorial) {
                this.tutorial.destroy();
            }
            this.sprite.destroy();
        }

        update(deltaTime) {
            let [hw, hh] = screenCenter();
            this.sprite.x = hw + this.game.showNiveaux;
            this.sprite.y = hh;
            this.player.update(deltaTime);
            for (let _box = 0; _box < this.boxes.length; _box++) {
                this.boxes[_box].update(deltaTime);
            }
        }

        getAt(x, y) {
            if (x < 0 || y < 0 || x >= this.gridW || y >= this.gridH) {
                return Block.DEFAULT;
            } else {
                return this.blocks[y][x];
            }
        }

        drawTilemap() {
            this.cvx = new OffscreenCanvas((this.gridW) * blockSize, (this.gridH) * blockSize);
            let ctx = this.cvx.getContext("2d");

            for (let x = 0; x < this.gridW; x++) {
                for (let y = 0; y < this.gridH; y++) {
                    let self = this.getAt(x, y);
                    let top = this.getAt(x, y - 1);
                    let bottom = this.getAt(x, y + 1);
                    let left = this.getAt(x - 1, y);
                    let right = this.getAt(x + 1, y);
                    let topleft = this.getAt(x - 1, y - 1);
                    let topright = this.getAt(x + 1, y - 1);
                    let bottomleft = this.getAt(x - 1, y + 1);
                    let bottomright = this.getAt(x + 1, y + 1);
                    let [tlX, tlY] = this.fitTile("tl", self, left, top, topleft);
                    let [trX, trY] = this.fitTile("tr", self, right, top, topright);
                    let [blX, blY] = this.fitTile("bl", self, left, bottom, bottomleft);
                    let [brX, brY] = this.fitTile("br", self, right, bottom, bottomright);
                    ctx.drawImage(
                        tilesetImage, 
                        tlX * tileSize, tlY * tileSize, 
                        tileSize, tileSize, 
                        x * blockSize + tileSize * 0, y * blockSize + tileSize * 0, 
                        tileSize, tileSize
                    );
                    ctx.drawImage(
                        tilesetImage, 
                        trX * tileSize, trY * tileSize, 
                        tileSize, tileSize, 
                        x * blockSize + tileSize * 1, y * blockSize + tileSize * 0, 
                        tileSize, tileSize
                    );
                    ctx.drawImage(
                        tilesetImage, 
                        blX * tileSize, blY * tileSize, 
                        tileSize, tileSize, 
                        x * blockSize + tileSize * 0, y * blockSize + tileSize * 1, 
                        tileSize, tileSize
                    );
                    ctx.drawImage(
                        tilesetImage, 
                        brX * tileSize, brY * tileSize, 
                        tileSize, tileSize, 
                        x * blockSize + tileSize * 1, y * blockSize + tileSize * 1, 
                        tileSize, tileSize
                    );
                }
            }
            ctx.strokeStyle = "#f00";
            ctx.lineWidth = 2;
        }

        fitTile(corner, self, neighborX, neighborY, neighborD) {
            // tl: top left
            // tr: top right
            // bl: bottom left
            // br: bottom right
            if (self.goal) {
                if (corner == "tl") return [5, 2]
                else if (corner == "tr") return [6, 2]
                else if (corner == "bl") return [5, 3]
                else if (corner == "br") return [6, 3]
            } else if (self.space) {
                return [1, 3]
            } else if (neighborX.solid && neighborY.solid && neighborD.solid) {
                return [6, 4]
            } else if (corner == "tl") {
                if (neighborX.solid && neighborY.solid) { return [2, 4] } 
                else if (neighborX.solid) { return [1, 4] } 
                else if (neighborY.solid) { return [2, 3] } 
                else { return [4, 3] }
            } else if (corner == "tr") {
                if (neighborX.solid && neighborY.solid) { return [0, 4] }
                else if (neighborX.solid) { return [1, 4] }
                else if (neighborY.solid) { return [0, 3] }
                else { return [3, 3] }
            } else if (corner == "bl") {
                if (neighborX.solid && neighborY.solid) { return [2, 2] } 
                else if (neighborX.solid) { return [1, 2] } 
                else if (neighborY.solid) { return [2, 3] } 
                else { return [4, 2] }
            } else if (corner == "br") {
                if (neighborX.solid && neighborY.solid) { return [0, 2] } 
                else if (neighborX.solid) { return [1, 2] } 
                else if (neighborY.solid) { return [0, 3] } 
                else { return [3, 2] }
            }
        }

        screenToGrid(x, y, snap = true) {
            let [hw, hh] = screenCenter();
            let left = levelRef.current.gridW * tileSize + hw;
            let top = levelRef.current.gridH * tileSize + hh;
            if (snap) {
                return [
                    Math.floor((x - left) / blockSize),
                    Math.floor((y - top) / blockSize)
                ]
            } else {
                return [
                    (x - left) / blockSize - tileSize,
                    (y - top) / blockSize - tileSize
                ]
            }
        }

        gridToScreen(x, y) {
            let left = -levelRef.current.gridW * tileSize;
            let top = -levelRef.current.gridH * tileSize;
            return [
                left + x * blockSize + tileSize,
                top + y * blockSize + tileSize
            ]
        }

        receiveEvent(cmd, action) {
            if (cmd == "left") {
                this.player.targetAngle = -1;
                return this.player.pushleft();
            } else if (cmd == "right") {
                this.player.targetAngle = 1;
                return this.player.pushright();
            } else if (cmd == "up") {
                this.player.targetAngle = 0;
                return this.player.pushup();
            } else if (cmd == "down") {
                this.player.targetAngle = 2;
                return this.player.pushdown();
            }
        }

        hasWon() {
            let win = true
            for (let boxi = 0; boxi < this.boxes.length; boxi++) {
                const box = this.boxes[boxi];
                win = win && this.goals.some((goal => box.gridX == goal.gridX && box.gridY == goal.gridY));
            }
            return win;
        }
    }

    class Game {
        constructor () {
            let self = this;
            gameRef.current = this;
            this.app = new PIXI.Application({
                view: canvasRef.current,
                width: 1920,
                height: 1080,
                backgroundAlpha: 0,
                backgroundColor: "#8e3ce1"
            });
            this.state = "niveaux";
            this.frame = 0;
            this.frameSinceWin = 0;
            this.levelNumber = 0;
            this.recommencerAngle = 0;
            this.recommencerAngle2 = 0;
            this.pauseAngle = 0;
            this.pauseAngle2 = 0;
            this.jouerAngle = 0;
            this.jouerAngle2 = 0;
            this.showControl = 200;
            this.showLevelControl = 200;
            this.showPause = 200;
            this.showBravo = 200;
            this.showNiveaux = window.innerWidth;
            this.selectGridX = this.levelNumber % levelscolumns;
            this.selectGridY = Math.floor(this.levelNumber / levelscolumns);
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.app.renderer.type = PIXI.RENDERER_TYPE.CANVAS;
            PIXI.settings.RENDER_OPTIONS.antialias = false;
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            pixiAppRef.current = this.app;
            this.gamecontainer = new PIXI.Container();
            this.gamecontainer.x = 0;
            this.gamecontainer.y = 0;
            PIXI.Assets.load(imagePath).then(async (texture) => {
                spritesheet.current = new PIXI.Spritesheet(texture, tilesetData);
                await spritesheet.current.parse();
                this.level = new Level(this, levels.levels[this.levelNumber]);
                this.app.stage.addChild(this.gamecontainer);
                // this.level = new Level(this, testmap);
                self.init();
                let [hw, hh] = screenCenter();

                this.recommencer = new PIXI.Sprite(spritesheet.current.textures["recommencer"]);
                this.recommencer.anchor.set(0, 1);
                this.recommencer.x = 36;
                this.recommencer.y = window.innerHeight - 24 + this.showControl;
                this.app.stage.addChild(this.recommencer);

                this.pause = new PIXI.Sprite(spritesheet.current.textures["pause"]);
                this.pause.anchor.set(0, 1);
                this.pause.x = 36 * 2 + 76 * imageScale;
                this.pause.y = window.innerHeight - 24 + this.showControl;
                this.app.stage.addChild(this.pause);

                this.bouger = new PIXI.Sprite(spritesheet.current.textures["bouger"]);
                this.bouger.anchor.set(1, 1);
                this.bouger.x = window.innerWidth - 36;
                this.bouger.y = window.innerHeight - 24 + this.showControl;
                this.app.stage.addChild(this.bouger);

                this.jouer = new PIXI.Sprite(spritesheet.current.textures["jouer"]);
                this.jouer.anchor.set(0, 1);
                this.jouer.x = 36;
                this.jouer.y = window.innerHeight - 24 + this.showLevelControl;
                this.app.stage.addChild(this.jouer);

                this.pauselbl = new PIXI.Sprite(spritesheet.current.textures["pauselbl"]);
                this.pauselbl.anchor.set(0.5, 0);
                this.pauselbl.x = hw + window.innerWidth;
                this.pauselbl.y = 64 - this.showPause;
                this.app.stage.addChild(this.pauselbl);

                this.bravolbl = new PIXI.Sprite(spritesheet.current.textures["bravolbl"]);
                this.bravolbl.anchor.set(0.5, 0);
                this.bravolbl.x = hw + window.innerWidth;
                this.bravolbl.y = 64 - this.showBravo;
                this.app.stage.addChild(this.bravolbl);

                this.jouerbtn = new PIXI.Sprite(spritesheet.current.textures["jouerbtn"]);
                this.jouerbtn.anchor.set(0, 1);
                this.jouerbtn.x = hw + 12 + window.innerWidth;
                this.jouerbtn.y = window.innerHeight - 64 + this.showPause;
                this.app.stage.addChild(this.jouerbtn);

                this.suivantbtn = new PIXI.Sprite(spritesheet.current.textures["suivantbtn"]);
                this.suivantbtn.anchor.set(0, 1);
                this.suivantbtn.x = hw + 12 + window.innerWidth;
                this.suivantbtn.y = window.innerHeight - 64 + this.showBravo;
                this.app.stage.addChild(this.suivantbtn);

                this.niveauxbtn = new PIXI.Sprite(spritesheet.current.textures["niveauxbtn"]);
                this.niveauxbtn.anchor.set(1, 1);
                this.niveauxbtn.x = hw - 12 + window.innerWidth;
                this.niveauxbtn.y = window.innerHeight - 64 + Math.min(this.showPause, this.showBravo);
                this.app.stage.addChild(this.niveauxbtn);

                this.niveauxtexture = PIXI.Texture.from(drawlevelselector());
                this.niveaux = new PIXI.Sprite(this.niveauxtexture);
                this.niveaux.anchor.set(0.5, 0.5);
                this.niveaux.x = hw;
                this.niveaux.y = hh;
                this.app.stage.addChild(this.niveaux);
                this.levelselect = new PIXI.Sprite(spritesheet.current.textures["levelselect"]);
                this.levelselect.anchor.set(0, 0);
                this.levelselect.x = -2 * imageScale - this.niveaux.width / 2;
                this.levelselect.y = -2 * imageScale - this.niveaux.height / 2;
                this.niveaux.addChild(this.levelselect);
                this.sokobanlbl = new PIXI.Sprite(spritesheet.current.textures["sokobanlbl"]);
                this.sokobanlbl.anchor.set(0.5, 1);
                this.sokobanlbl.x = 0;
                this.sokobanlbl.y = -64 - this.niveaux.height / 2;
                this.niveaux.addChild(this.sokobanlbl);

                this.basicText = dataRef.current;
                this.basicText.x = 100;
                this.basicText.y = 100;
                // this.app.stage.addChild(this.basicText);
            })
        }

        init() {
            // temporary
            this.level.init();
            let self = this;
            this.app.ticker.add((time) => {
                self.frame++;
                let deltaTime = time / 60;
                self.update(deltaTime);
            });
        }

        update(deltaTime) {
            if (this.level.hasWon()) {
                this.frameSinceWin++;
                if (this.frameSinceWin == 20) {
                    // alert("felicitation");
                    this.state = "bravo";
                }
            }
            let [hw, hh] = screenCenter();
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.recommencerAngle = expFollow(deltaTime, this.recommencerAngle, 0);
            this.recommencerAngle2 = expFollow(deltaTime, this.recommencerAngle2, this.recommencerAngle);
            this.pauseAngle = expFollow(deltaTime, this.pauseAngle, 0);
            this.pauseAngle2 = expFollow(deltaTime, this.pauseAngle2, this.pauseAngle);
            this.jouerAngle = expFollow(deltaTime, this.jouerAngle, 0);
            this.jouerAngle2 = expFollow(deltaTime, this.jouerAngle2, this.jouerAngle);
            this.showControl = expFollow(deltaTime, this.showControl, this.state == "ingame" ? 0 : 200);
            this.showPause = expFollow(deltaTime, this.showPause, this.state == "pause" ? 0 : 200);
            this.showBravo = expFollow(deltaTime, this.showBravo, this.state == "bravo" ? 0 : 200);
            this.showLevelControl = expFollow(deltaTime, this.showLevelControl, this.state == "niveaux" ? 0 : 200);
            this.showNiveaux = expFollow(deltaTime, this.showNiveaux, this.state == "niveaux" ? window.innerWidth : 0, 0.001);
            this.selectGridX = expFollow(deltaTime, this.selectGridX, this.levelNumber % levelscolumns, 0.000000001);
            this.selectGridY = expFollow(deltaTime, this.selectGridY, Math.floor(this.levelNumber / levelscolumns), 0.000000001);
            this.recommencer.y = window.innerHeight - 24 + this.recommencerAngle2 * 2 + this.showControl;
            this.pause.y = window.innerHeight - 24 + this.pauseAngle2 * 8 + this.showControl;
            this.bouger.y = window.innerHeight - 24 + this.showControl;
            this.jouer.y = window.innerHeight - 24 + this.jouerAngle2 * 8 + this.showLevelControl;
            this.bouger.x = window.innerWidth - 36;
            this.recommencer.angle = this.recommencerAngle2 * 0.5;
            this.pause.angle = this.pauseAngle2 * 0.5;
            this.jouer.angle = this.jouerAngle2 * 0.5;
            this.pauselbl.y = 64 - this.showPause;
            this.pause.x = 36 * 2 + 76 * imageScale;
            this.recommencer.x = 36;
            this.pauselbl.x = hw + this.showNiveaux;
            this.bravolbl.x = hw + this.showNiveaux;
            this.jouerbtn.x = hw + 12 + this.showNiveaux;
            this.suivantbtn.x = hw + 12 + this.showNiveaux;
            this.niveauxbtn.x = hw - 12 + this.showNiveaux;
            this.bravolbl.y = 64 - this.showBravo;
            this.jouerbtn.y = window.innerHeight - 64 + this.showPause;
            this.suivantbtn.y = window.innerHeight - 64 + this.showBravo;
            this.niveauxbtn.y = window.innerHeight - 64 + Math.min(this.showPause, this.showBravo);

            this.niveaux.x = hw - window.innerWidth + this.showNiveaux;
            this.niveaux.y = hh;
            this.levelselect.x = this.selectGridX * (levelsblckW + levelsspacing) - 2 * imageScale - this.niveaux.width / 2;
            this.levelselect.y = this.selectGridY * (levelsblckH + levelsspacing) - 2 * imageScale - this.niveaux.height / 2;

            this.level.update(deltaTime);
            Particle.updateAll(deltaTime);
        }

        receiveEvent(cmd, action) {
            // to be changed since menus will be a thing
            // if (action != "press") return true;
            if (this.state == "ingame") {
                if (!this.level.hasWon()) {
                    if (cmd == "b") {
                        this.state = "pause";
                        this.pauseAngle = -90;
                    } else if (cmd == "a") {
                        this.level.destroy();
                        this.level = new Level(this, levels.levels[this.levelNumber]);
                        this.level.init();
                        this.recommencerAngle = -90;
                    } else {
                        this.level.receiveEvent(cmd, action);
                    }
                }
            } else if (this.state == "pause") {
                if (cmd == "a") {
                    this.state = "ingame";
                } else if (cmd == "b") {
                    this.state = "niveaux";
                }
            } else if (this.state == "bravo") {
                if (cmd == "a") {
                    this.state = "ingame";
                    this.level.destroy();
                    this.levelNumber++;
                    this.level = new Level(this, levels.levels[this.levelNumber]);
                    this.level.init();
                    this.frameSinceWin = 0;
                } else if (cmd == "b") {
                    this.levelNumber++;
                    this.state = "niveaux";
                }
            } else if (this.state == "niveaux") {
                if (cmd == "a") {
                    this.jouerAngle = -90;
                    this.state = "ingame";
                    this.level.destroy();
                    this.level = new Level(this, levels.levels[this.levelNumber]);
                    this.level.init();
                    this.frameSinceWin = 0;
                } else if (cmd == "left") {
                    let col = this.levelNumber % levelscolumns;
                    let row = Math.floor(this.levelNumber / levelscolumns);
                    if (col == 0) {
                        if (row == levelsrows - 1) {
                            this.levelNumber += (levelslength - 1) % levelscolumns;
                        } else {
                            this.levelNumber += levelscolumns - 1;
                        }
                    } else {
                        this.levelNumber -= 1;
                    }
                } else if (cmd == "right") {
                    let col = this.levelNumber % levelscolumns;
                    let row = Math.floor(this.levelNumber / levelscolumns);
                    if (col == levelscolumns - 1) {
                        this.levelNumber -= levelscolumns - 1;
                    } else if (this.levelNumber == levelslength - 1) {
                        this.levelNumber -= this.levelNumber % levelscolumns;
                    } else {
                        this.levelNumber += 1;
                    }
                } else if (cmd == "up") {
                    let col = this.levelNumber % levelscolumns;
                    let row = Math.floor(this.levelNumber / levelscolumns);
                    this.levelNumber -= levelscolumns;
                    if (this.levelNumber < 0) {
                        this.levelNumber += levelsrows * levelscolumns
                    }
                    if (this.levelNumber >= levelslength) {
                        this.levelNumber -= levelscolumns
                    }
                } else if (cmd == "down") {
                    let col = this.levelNumber % levelscolumns;
                    let row = Math.floor(this.levelNumber / levelscolumns);
                    this.levelNumber += levelscolumns;
                    if (this.levelNumber >= levelslength) {
                        this.levelNumber -= levelsrows * levelscolumns
                    }
                    if (this.levelNumber < 0) {
                        this.levelNumber += levelscolumns
                    }
                }
            }
        }
    }

    React.useEffect(() => {
        waitForTilesetImage().then(() => {
            new Game();
        });

        return () => {
            app.destroy(true, true);
        };
    }, []);

    // manual events, for testing purposes
    React.useEffect(() => {
        document.addEventListener("keydown", function (event) {
            if (!event.repeat) {
                if (event.key == " ") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("a", "press")
                } else if (event.key == "Escape") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("b", "press")
                } else if (event.key == "ArrowLeft") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("left", "press")
                } else if (event.key == "ArrowRight") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("right", "press")
                } else if (event.key == "ArrowUp") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("up", "press")
                } else if (event.key == "ArrowDown") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("down", "press")
                } else if (event.key == "a") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("left", "press")
                } else if (event.key == "d") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("right", "press")
                } else if (event.key == "w") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("up", "press")
                } else if (event.key == "s") {
                    event.preventDefault();
                    gameRef.current.receiveEvent("down", "press")
                }
            }
        });
    }, []);


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* <h1 id="test" style={{backgroundColor: "#ff0000", color:"#000000", zIndex: 99}}>test</h1> */}
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default PixiCanvas;