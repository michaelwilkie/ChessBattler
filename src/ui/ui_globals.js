//////////////////////////////////////////////////////////
// ui_globals.js                                        //
//     Contains all the globals used for the UI Canvas. //
//////////////////////////////////////////////////////////
"use strict";

const ui_default_font               = "Arial"                       ;
const ui_default_fontsize           = 20                            ;
const ui_default_text_color         = "black"                       ;
const ui_default_background_color   = "white"                       ;
const ui_default_text_alignment     = "center"                      ;
const ui_default_line_width         = 2                             ;
const ui_default_menu_button_height = 100                           ;

const UI_DEFAULT_SQUARE_TRANSPARENCY= 0.5                           ; // [Real Number] How transparent the red square will shade a selected piece

var ui_font                         = ui_default_font               ;
var ui_fontsize                     = ui_default_fontsize           ;
var ui_text_color                   = ui_default_text_color         ;
var ui_background_color             = ui_default_background_color   ;

var ui_component_list = []; // should contain all the UI elements that are to be displayed

var ui_fps_label;

var ui_selected_chesspiece_move_list = null; // [Array<Game_ChessPiece>] List of moves a selected chess piece can make

var ui_canvas;
var ui_ctx;

// If the scrollbar is horizontal, where height doesn't matter,
// and for the sake of having a clickable area, it will use the 
// default height.
// Similarly for the width.
var ui_scrollbar_width  = 16; 
var ui_scrollbar_height = 16;

var SCREEN_WIDTH            = 500  ;
var SCREEN_HEIGHT           = 800   ;
var SCREEN_ASPECT_RATIO     = 5/4   ;
var SCREEN_WIDTH_PERCENTAGE = 0.75  ; // out of 1.0