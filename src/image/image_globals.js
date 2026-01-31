//////////////////////////////////////////////////////////////////////
// image_globals.js                                                 //
// This file contains global variables for image-related components //
//////////////////////////////////////////////////////////////////////
"use strict";

const MEDIA_DIR                     = "images/";
const IMAGE_ROOT_PATH               = MEDIA_DIR ; // [string]   root directory for sounds
const IMAGE_DEFAULT_FILE_EXTENSION  = ".png"    ; // [string]   default file extension

var image_all_loaded        = false;              // [boolean]  Used to check if all images are loaded so no 404 errors are thrown
var image_data_list         = [];                 // [array  ]  Used to manage shared image objects
var image_data_loaded_count = 0;                  // [integer]  Used to check if the game is ready to play by counting all the loaded images
