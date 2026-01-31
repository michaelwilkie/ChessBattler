//////////////////////////////////////////////////////////////////////
// sound_data.js                                                    //
// Contains the SoundData class for managing sound-related objects  //
//////////////////////////////////////////////////////////////////////
"use strict";

class SoundData
{
    constructor(root_directory, file_name, file_extension)
    {
        this.root_directory = root_directory;
        this.file_name      = file_name;
        this.file_extension = file_extension;
    }
    getRootDirectory()
    {
        return this.root_directory;
    }
    getFileDirectory()
    {
        return this.root_directory + this.file_name + this.file_extension;
    }
    getFileName()
    {
        return this.file_name;
    }
    getFileExtension()
    {
        return this.file_extension;
    }
}