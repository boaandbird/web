(function($) {

    var snakeGame;
    var snake;
    var square;
    var ctx;
    var squareSize = 20;
    var direction = null;
    var isGameOver = false;
    var moveFlag = true;

    var defaults = {
        width: 500,
        height: 500,
        squareSize: 20
    }

    function SnakeGame(settings) {
        snakeGame = this;
        $.extend(true, defaults, settings);
        init();
    }


    function init() {
        snakeGame.css({ defaults })
        var cvs = document.createElement("canvas");
        cvs.width = defaults.width;
        cvs.height = defaults.height;
        cvs.style.border = "1px solid";
        snakeGame.append(cvs);

        ctx = cvs.getContext("2d");

        squareSize = defaults.squareSize;

        snake = new Snake();

        square = createSquare();

        addKeyListener();
    }

    function addKeyListener() {
        document.onkeydown = function(event) {

            var keyCode = event.keyCode;

            if (keyCode == 37 && direction != 0 && moveFlag) {
                snake.move(-squareSize, 0);
                direction = 0;
            } else if (keyCode == 38 && direction != 1 && moveFlag) {
                snake.move(0, -squareSize);
                direction = 1;
            } else if (keyCode == 39 && direction != 0 && direction != null && moveFlag) {
                snake.move(squareSize, 0);
                direction = 0;
            } else if (keyCode == 40 && direction != 1 && moveFlag) {
                snake.move(0, squareSize);
                direction = 1;
            }
        };
    }

    function createSquare() {
        var lenX = defaults.width / squareSize;
        var lenY = defaults.height / squareSize;
        var x, y;
        while (true) {

            x = parseInt(Math.random() * lenX);
            y = parseInt(Math.random() * lenY);

            for (var i = 0; i < snake.body.length; i++) {
                square = snake.body[i];
                if (square.x == x && square.y == y) {
                    break;
                }
            }

            if (i == snake.body.length) {
                var s = new Square(x * squareSize, y * squareSize, squareSize, getColor());
                s.centerX = s.x + s.size / 2;
                s.centerY = s.y + s.size / 2;
                return s;
            }
        }
    }

    function getColor() {
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c']
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += arr[parseInt(Math.random() * arr.length)];
        }
        return color;
    }

    function checkBump() {
        var head = snake.head;

        if (head.x < 0 || head.y < 0 || head.x + squareSize > defaults.width || head.y + squareSize > defaults.height) {
            isGameOver = true;
        }

        for (var i = 1; i < snake.body.length; i++) {
            var bd = snake.body[i];
            if (bd.x == head.x && bd.y == head.y) {
                isGameOver = true;
            }
        }
    }

    function Snake() {
        this.body = [];
        this.eat(new Square(200, 100, squareSize, getColor()));
        this.eat(new Square(200 + squareSize, 100, squareSize, getColor()));
        this.eat(new Square(200 + squareSize * 2, 100, squareSize, getColor()));
    }

    Snake.prototype.eat = function(square) {
        if (this.body.length != 0) {
            square.previous = this.body[this.body.length - 1];
            this.body[this.body.length - 1].next = square;
        } else {
            square.previous = {};
            this.head = square;
        }
        this.body.push(square);
    };

    Snake.prototype.move = function(offsetX, offsetY) {
        moveFlag = false;
        ctx.beginPath();
        clearInterval(snakeGame.timer);
        snakeGame.timer = setInterval(function() {

            if (ctx.isPointInPath(square.centerX, square.centerY)) {
                var color = square.color;
                square = createSquare();
                var last = this.body[this.body.length - 1];
                this.eat(new Square(last.x, last.y, squareSize, color));
            }
            ctx.beginPath();
            this.head.cacheX = this.head.x;
            this.head.cacheY = this.head.y;
            this.head.x = this.head.x + offsetX;
            this.head.y = this.head.y + offsetY;

            checkBump();
            if (isGameOver) {
                clearInterval(snakeGame.timer);
                document.onkeydown = null;
                return;
            }

            this.head.draw();
            this.head.next.move();
            moveFlag = true;
        }.bind(this), 100);
    };

    function Square(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.draw();
    }

    Square.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
    };

    Square.prototype.move = function() {
        ctx.clearRect(this.x, this.y, squareSize, squareSize);
        this.cacheX = this.x;
        this.cacheY = this.y;
        this.x = this.previous.cacheX;
        this.y = this.previous.cacheY;
        this.draw();
        if (this.next) {
            this.next.move();
        }
    };

    $.fn.extend({
        SnakeGame: SnakeGame
    });
})(jQuery)
