///////////////////////////////////////////////////////////
// initialize.js                                         //
// All code needed to prepare the game for the main loop //
///////////////////////////////////////////////////////////
"use strict";

// Canvas frame update handling
var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) 
{
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

$(document).ready(function () 
{
    // Get HTML Canvas elements
    game_canvas     = $("#game_canvas")[0]                 ;
    game_ctx        = $("#game_canvas")[0].getContext("2d");
    ui_canvas       = $("#ui_canvas"  )[0]                 ;
    ui_ctx          = $("#ui_canvas"  )[0].getContext("2d");

    // Set screen constants
    SCREEN_WIDTH    = game_canvas.width;
    SCREEN_HEIGHT   = game_canvas.height;

    // Set the pixel size of a chess square
    game_chessboard_square_size = SCREEN_WIDTH / GAME_CHESSBOARD_WIDTH;

    // Setup the chess board
    game_chessboard_instance = new ChessBoard();

    // Setup the chess game instance
    game_chess_instance = new Chess();
    
    // Initialize game-time-keeping object
    game_core.time = new GameTime();
    game_core.time.tick();

    // Loading images and sounds
    image_initialize();
    sound_initialize();

    // Initalize HTML elements and internal variables
    html_initialize();

    // Create KeyHandler object and attach it to the game_core object
    game_core.keyhandler = new KeyHandler();

    // Attach key-listener to the window, this is what it will do when you press a key
    window.onkeydown = function(e)
    {
        var key = e.code;

        // Prevent space bar from scrolling the page
        if(e.keyCode == 32 && e.target == document.body) 
        {
            e.preventDefault();
        }
        
        game_core.keyhandler.keydown(key);
    }

    // Attach key-listener to the window, this is what it will do when you release a key
    window.onkeyup = function(e)
    {
        var key = e.code;    
        game_core.keyhandler.keyup(key);
    }

    // The UI canvas will be listening for mouse events
    ui_canvas.addEventListener('mousedown', function (event)
    {
        ui_mouse_down(event);
    });
    ui_canvas.addEventListener('mousemove', function (event)
    {
        ui_mouse_move(event);
    });
    ui_canvas.addEventListener('mouseup', function (event)
    {
        ui_mouse_up(event);
    });

    CanvasBasicEngine();
});

// The main function the game runs in
function CanvasBasicEngine()
{
    // The window will repeatedly call this function
    window.requestAnimationFrame(CanvasBasicEngine);

    game_core.time.tick();

    game_ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ui_ctx.clearRect  (0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // run the game
    game();

    // draw the ui elements
    ui();
}