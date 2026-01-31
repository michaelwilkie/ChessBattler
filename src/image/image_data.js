//////////////////////////////////////////////////////////////////
// image_data.js                                                //
// Contains the ImageData class for image-related components    //
//////////////////////////////////////////////////////////////////
"use strict";

class ImageData
{
    constructor(root_directory, file_name, file_extension)
    {
        this.root_directory = root_directory;
        this.file_name      = file_name;
        this.file_extension = file_extension;
        this.image_object   = null;
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
    getImageObject()
    {
        return this.image_object;
    }
    setImageObject(image_object)
    {
        this.image_object = image_object;
    }
}