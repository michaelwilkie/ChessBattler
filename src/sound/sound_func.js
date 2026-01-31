////////////////////////////////////////////////////
// sound_func.js                                  //
// Protocol to initialize the sounds for the game //
////////////////////////////////////////////////////
"use strict";

function sound_initialize()
{
    // Add to the list if sounds are meant to be loaded and played
    // sound_data_list.push(sound_createSoundData("music/CrossCode - Autumn's Rise"));

    ////////////////////////////////
    // CreateJS initialization steps
    if (!createjs.Sound.initializeDefaultPlugins()) { return; }

    createjs.Sound.addEventListener("fileload", sound_loadHandler);
    createjs.Sound.alternateExtensions = ["mp3"];

    // End CreateJS initialization steps
    ////////////////////////////////
    for (var i = 0; i < sound_data_list.length; i++)
    {
        var sound_data_object = sound_data_list[i];
        createjs.Sound.registerSound
        (
            sound_data_object.getFileDirectory(),   // file location
            sound_data_object.getFileName()         // file alias, or key used to access the sound object
        );
    }

    // In case there are no sounds loaded
    if (0 == sound_data_list.length)
    {
        sound_all_loaded = true;
    }
} // End of sound_initialize()

///////////////////////////////////////////////////////////////////////////////////
//                             sound_createSoundData                             //
// Function:                                                                     //
//     Creates a SoundData object with the default directory and file extensions //
// Return value:                                                                 //
//     SoundData object                                                          //
///////////////////////////////////////////////////////////////////////////////////
function sound_createSoundData(sound_name)
{
    return new SoundData(SOUND_ROOT_PATH, sound_name, SOUND_DEFAULT_FILE_EXTENSION);
}

//////////////////////////////////////////////////
//              sound_loadHandler               //
// Function:                                    //
//     Event handler for sounds that are loaded //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function sound_loadHandler()
{
    sound_data_loaded_count++;
    
    // If enough of the sounds are loaded, proceed to playing the game
    if (sound_data_loaded_count >= sound_data_list.length)
    {
        sound_all_loaded = true;
    }
}