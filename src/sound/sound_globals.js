//////////////////////////////////////////////////////////////
// sound_globals.js                                         //
// Contains global variables for sound-related functions    //
//////////////////////////////////////////////////////////////
"use strict";

const SOUND_DIR                     = "sound/"
const SOUND_ROOT_PATH               = SOUND_DIR ; // [string]           root directory for sounds
const SOUND_DEFAULT_FILE_EXTENSION  = ".mp3"    ; // [string]           default file extension

var sound_data_list                 = []        ; // [SoundData object] global array for all precached sounds
var sound_data_loaded_count         = 0         ; // [integer]          number of sounds currently loaded
var sound_all_loaded                = false     ; // [boolean]          flag checking if sounds are currently loaded