///////////////////////////////////////////////////////////
// game_globals.js                                       //
// Contains global variables used throughout the program //
///////////////////////////////////////////////////////////
"use strict";

var DEBUG_MODE                      = true          ; // [Boolean] Flag determining whether to print any debug statements

var game_level_selected             = null          ; // [Level object] Current level selected
var game_level_loaded               = false         ; // [Boolean] Flag determining whether the level loading phase has finished

var game_canvas                     = null          ; // [Canvas Object]
var game_ctx                        = null          ; // [Canvas Context Object]

var game_chess_instance             = null          ; // [Chess object] Chess instance
var game_chessboard_instance        = null          ; // [ChessBoard Object] ChessBoard instance

var game_chessboard_square_size     = null          ; // [Integer] to be initialized when SCREEN_WIDTH gets initialized

const GAME_CHESSBOARD_WIDTH         = 8             ; // [Integer] Size of the board (length and height)
const GAME_CHESSBOARD_SQUARE_COLOR1 = "lightgreen"  ; // [String] Color of every other square on the chessboard
const GAME_CHESSBOARD_SQUARE_COLOR2 = "white"       ; // [String] Color of every other square on the chessboard
const GAME_CHESSBOARD_COLOR_LIST = [
    GAME_CHESSBOARD_SQUARE_COLOR1,
    GAME_CHESSBOARD_SQUARE_COLOR2
];

const GAME_MODE_ENUM = {                        // game mode enumerator
    EDIT_MODE: 0,                               // level editing mode
    PLAY_MODE: 1                                // normal playing mode
};

var game_core = {
    fps             : 60                        ,   // framerate
    time            : null                      ,   // GameTime object, for keeping track of game's time/tickrate
    keyhandler      : null                      ,   // user input handler
    animation_timer : 35                            // time in milliseconds between animation frame
};

var SCREEN_WIDTH                    = null      ; // [Integer]
var SCREEN_HEIGHT                   = null      ; // [Integer]

var TIME_1_SECOND                   = 1000      ; // [Integer] Milliseconds for 1 second

// Mouse position
// Will be used for menus
var mousepos            = {x: 0, y: 0};
var mousestartpos       = {x: 0, y: 0};

var mousedif            = {x: 0, y: 0};
var mousedragbox        = {x: 0, y: 0, width: 0, height: 0};

var mouseselectedentity = null; // for drag and drop

var mdownleft           = false;
var mdownright          = false;
var mlastdownleft       = false;
var mlastdownright      = false;
var mwheel              = false;
var mwheelup            = false;
var mwheeldown          = false;
var mlastwheel          = false;
var mlastwheelup        = false;
var mlastwheeldown      = false;
var MOUSE_DEBUG_MODE    = false;