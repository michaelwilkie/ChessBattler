//////////////////////////////////////////
// image_func.js                        //
// Functions for image-related routines //
//////////////////////////////////////////
"use strict";

function image_initialize()
{
    // Add to the list if images are meant to be loaded and displayed
    // These are merely inserted into the array, these still need to be loaded
    image_data_list.push(image_createImageData("black rook"));
    image_data_list.push(image_createImageData("black horsey"));
    image_data_list.push(image_createImageData("black bishop"));
    image_data_list.push(image_createImageData("black queen"));
    image_data_list.push(image_createImageData("black king"));
    image_data_list.push(image_createImageData("black pawn"));

    image_data_list.push(image_createImageData("white rook"));
    image_data_list.push(image_createImageData("white horsey"));
    image_data_list.push(image_createImageData("white bishop"));
    image_data_list.push(image_createImageData("white queen"));
    image_data_list.push(image_createImageData("white king"));
    image_data_list.push(image_createImageData("white pawn"));

    for (var i = 0; i < image_data_list.length; i++)
    {
        var image_data_object = image_data_list[i];

        // Now they actually have image objects created and are ready to share with out entities
        image_data_object.setImageObject
        (
            image_createImageObject(image_data_object.getFileDirectory(), image_loadHandler)
        );
    }

    // In case there are no sounds loaded
    if (0 == image_data_list.length)
    {
        image_all_loaded = true;
    }
}

//////////////////////////////////////////////////////////////////////////
//                         image_findObject                             //
// Function:                                                            //
//     Looks thru the image_data_list array for a particular image file //
// Return value:                                                        //
//     Image object or null                                             //
//////////////////////////////////////////////////////////////////////////
function image_findObject(file_name)
{
    if (file_name == null || file_name == undefined)
    {
        return null;
    }
    
    // Cut off the http://blahblahblah.co/
    var relative_file_name = file_name.split(".co/")[1];

    // In case there was no http://blahhblahblah.co/ prefix
    if (relative_file_name == null || relative_file_name == undefined)
    {
        relative_file_name = file_name;
    }

    for (var i = 0; i < image_data_list.length; i++)
    {
        var image_data_object = image_data_list[i];
        if (image_data_object.getFileDirectory() == relative_file_name)
        {
            return image_data_object.getImageObject();
        }
    }

    console.log("Unable to find image: " + file_name);
    
    return null;
}

////////////////////////////////////////////////////////////////////
//                    image_allImagesLoaded                       //
// Function:                                                      //
//     Checks whether or not all game resources have been loaded. //
// Return value:                                                  //
//     boolean                                                    //
////////////////////////////////////////////////////////////////////
function image_allImagesLoaded()
{
    if (image_data_list.length > 0)
    {
        for (var i = 0; i < image_data_list.length; i++)
        {
            if (null == image_data_list.image_object)
            {
                return false;
            }
        }
    }
    else
    {
        // No images to load, so already done
    }

    return true;
}

/////////////////////////////////////////////
//          image_loadImageObject          //
// Function:                               //
//     Creates an image object from imgsrc //
// Return value:                           //
//     Image object                        //
/////////////////////////////////////////////
function image_createImageObject(imgsrc, callback_function)
{
    var img_object = null;

    // Images are used for visible entities
    if (imgsrc != null)
    {
        img_object          = new Image();
        img_object.src      = imgsrc;
        img_object.onload   = callback_function;
    }

    return img_object;
}

//////////////////////////////////////////////////////////////////////////////////////
//                             image_createImageData                                //
// Function:                                                                        //
//     Creates an ImageData object with the default directory and file extensions   //
// Return value:                                                                    //
//     ImageData object                                                             //
//////////////////////////////////////////////////////////////////////////////////////
function image_createImageData(image_name)
{
    return new ImageData(IMAGE_ROOT_PATH, image_name, IMAGE_DEFAULT_FILE_EXTENSION);
}

//////////////////////////////////////////////////
//              image_loadHandler               //
// Function:                                    //
//     Event handler for images that are loaded //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function image_loadHandler()
{
    image_data_loaded_count++;
    
    // If enough of the images are loaded, proceed to playing the game
    if (image_data_loaded_count >= image_data_list.length)
    {
        image_all_loaded = true;
    }
}