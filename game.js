var width = 640;
var height = 640;
var game = new Phaser.Game(width, height, "game", Phaser.AUTO);

var squareSize = 16;
var xSquareCount = width / squareSize;
var ySquareCount = height / squareSize;

var filledGroup = null;
var emptyGroup = null;

var data = Array();

var timeRequiredToUpdate = 300;
var timeElapsedSinceUpdate = 0;

var state = function(){};
state.prototype.preload = function () {
    this.load.image('empty', 'assets/cell.png');
    this.load.image('filled', 'assets/FilledCell.png');
};

state.prototype.create = function () {
    filledGroup = this.add.group();
    emptyGroup = this.add.group();

    initData();
};

state.prototype.update = function () {
    if(timeRequiredToUpdate > timeElapsedSinceUpdate){
        timeElapsedSinceUpdate += this.time.elapsedMS;
    } else {
        timeElapsedSinceUpdate = 0;

        var cloneDataset = data.clone();

        for(var i = 0; i < xSquareCount; i++){
            for(var j = 0; j < ySquareCount; j++){
                var cellValue = data[i][j];
                var neighbors = getNeighbors(i, j);

                if(cellValue == 1 && neighbors.countOf(1) < 2){
                    cloneDataset[i][j] = 0;
                }

                if(cellValue == 1 && neighbors.countOf(1) > 3){
                    cloneDataset[i][j] = 0;
                }

                if(cellValue == 1 && (neighbors.countOf(1) == 2 || neighbors.countOf(1) == 3)){
                    cloneDataset[i][j] = 1;
                }

                if(cellValue == 0 && neighbors.countOf(1) == 3){
                    cloneDataset[i][j] = 1;
                }

            }
        }

        data = cloneDataset.clone();

    }

};

state.prototype.render = function () {
    filledGroup.destroy();
    emptyGroup.destroy();

    filledGroup = this.add.group();
    emptyGroup = this.add.group();

    for(var i = 0; i < xSquareCount; i++){
        for(var j = 0; j < ySquareCount; j++){

            var cellValue =  data[i][j];

            if(cellValue == 0){
                var image = this.add.sprite(i * squareSize, j * squareSize, 'empty');
                image.width = squareSize;
                image.height = squareSize;
                emptyGroup.add(image);
            }

            if(cellValue == 1){
                var image = this.add.sprite(i * squareSize, j * squareSize, 'filled');
                image.width = squareSize;
                image.height = squareSize;
                filledGroup.add(image);
            }

        }
    }

};

function initData(){
    for(var i = 0; i < xSquareCount; i++){
        data.push(Array());
        for(var j = 0; j < ySquareCount; j++){
            data[i].push(0);
        }
    }

    addInitData();
}

function addInitData(){
    data[10][10] = 1
    data[10][11] = 1
    data[11][10] = 1
    data[11][12] = 1
    data[11][11] = 1
    data[11][13] = 1
    data[11][14] = 1
}

function getNeighbors(x, y){
    var result = Array();

    try{if(data[x-1][y-1] != undefined) result.push(data[x-1][y-1]);}catch(err){}
    try{if(data[x-1][y] != undefined) result.push(data[x-1][y]);}catch(err){}
    try{if(data[x-1][y+1] != undefined) result.push(data[x-1][y+1]);}catch(err){}
    try{if(data[x][y+1] != undefined) result.push(data[x][y+1]);}catch(err){}
    try{if(data[x][y-1] != undefined) result.push(data[x][y-1]);}catch(err){}
    try{if(data[x+1][y-1] != undefined) result.push(data[x+1][y-1]);}catch(err){}
    try{if(data[x+1][y] != undefined) result.push(data[x+1][y]);}catch(err){}
    try{if(data[x+1][y+1] != undefined) result.push(data[x+1][y+1]);}catch(err){}

    return result;
};


Array.prototype.clone = function () {
    var str = JSON.stringify(this);
    return JSON.parse(str);
};

Array.prototype.countOf = function(lookFor){
    var count = 0;
    for(var i = 0; i < this.length; i++){
        if(this[i] == lookFor) count++;
    }

    return count;
}

game.state.add('state', state);
game.state.start('state');
