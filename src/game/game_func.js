////////////////////////////////////////////////////////////////
// game_func.js                                               //
// Contains the main game loop and utility functions it needs //
////////////////////////////////////////////////////////////////
"use strict";

// Main game function
function game()
{
    // Wait for the game to load, these two variables will be set elsewhere when the game is ready
    if (image_all_loaded && sound_all_loaded)
    {
        game_handleKeyboard();

        // Determine if the button_game_started element has been pressed or has cancelled the game
        if (HTML_START_GAME__STATE__STARTED == html_start_game_button_state)
        {
            game_draw();
            game_update();
        }
        else
        {
            game_drawWaitingState();
        }

        // Saved which keys were pressed and not pressed so we can tell next frame if anything changed
        game_core.keyhandler.updateLastKeypress();
    }
    else
    {
        // The game has not finished loading
        // With small-scale games, loading images and sounds should be very fast and not need a loading screen
        // If loading DOES take a long time, this would be the place to program a loading screen
    }
} // End of game()

/////////////////////////////////////////////////////
//              game_handleKeyboard                //
// Function:                                       //
//     Handles the keyboard inputs in one function //
// Return function:                                //
//     None                                        //
/////////////////////////////////////////////////////
function game_handleKeyboard()
{

} // End of game_handleKeyboard()

/////////////////////////////////////////////////////////////////////////
// game_decimalToHex                                                   //
// Function:                                                           //
//     Converts a decimal number to a proper 32-bit hexidecimal string //
// Parameters:                                                         //
//     decimal_number [IN] = [Number] Value to be converted            //
// Return value:                                                       //
//     String                                                          //
/////////////////////////////////////////////////////////////////////////
function game_decimalToHex(decimal_number)
{
    // Determine if the negative bit is set in this number
    if (decimal_number < 0)
    {
        decimal_number = 0xFFFFFFFF + decimal_number + 1;
    }

    return decimal_number.toString(16).toUpperCase();

} // End of game_decimalToHex(decimal_number)


/////////////////////////////////////////////
//               game_draw                 //
// Function:                               //
//     Draws everything you need to draw   //
// Return value:                           //
//     None                                //
/////////////////////////////////////////////
function game_draw()
{
    // Draw chess board
    game_drawChessBoard();

    // Draw chess pieces
    game_drawChessPieces();
} // End of game_draw()

///////////////////////////////////////////////////////////
//                      game_update                      //
// Function:                                             //
//     Everything you need updated should be done here   //
// Return value:                                         //
//     None                                              //
///////////////////////////////////////////////////////////
function game_update()
{
    // Run the game's state machine
    game_chess_instance.stateRun();
} // End of game_update()

//////////////////////////////////////////////////////////////
// game_initializePlayers                                   //
// Function:                                                //
//     Sets the player objects for the game's state machine //
// Return value:                                            //
//     None                                                 //
//////////////////////////////////////////////////////////////
function game_initializePlayers()
{
    // White player will be the first one, Black player will be the second
    var player1 = null;
    var player2 = null;

    // Grab the HTML checkbox data
    var html_p1_checkbox = document.getElementById("checkbox_player1");
    var html_p2_checkbox = document.getElementById("checkbox_player2");

    // Determine if the checkbox for CPU players is checked
    if (html_p1_checkbox.checked) { player1 = new Player(GAME_PLAYER__COLOR__WHITE, GAME_PLAYER__TYPE__COMPUTER); }
    else                          { player1 = new Player(GAME_PLAYER__COLOR__WHITE, GAME_PLAYER__TYPE__HUMAN   ); }
    if (html_p2_checkbox.checked) { player2 = new Player(GAME_PLAYER__COLOR__BLACK, GAME_PLAYER__TYPE__COMPUTER); }
    else                          { player2 = new Player(GAME_PLAYER__COLOR__BLACK, GAME_PLAYER__TYPE__HUMAN   ); }

    // Assign the players to the chess instance
    game_chess_instance.setPlayerWhite(player1);
    game_chess_instance.setPlayerBlack(player2);
} // End of game_initializePlayers()

///////////////////////////////////////////////////////////////////////////////////////
//     game_drawWaitingState                                                         //
// Function:                                                                         //
//     Draws the waiting screen for the button_start_game HTML element to be pressed //
// Return value:                                                                     //
//     None                                                                          //
///////////////////////////////////////////////////////////////////////////////////////
function game_drawWaitingState()
{
    // Draw the background
    game_fillBox
    (
        0,
        0,
        SCREEN_WIDTH,
        SCREEN_HEIGHT,
        "white"
    );

    // Draw the text
    ui_drawText
    (
        "Click Start Game to begin", // text
        SCREEN_WIDTH / 2           , // x
        SCREEN_HEIGHT / 2          , // y
        "black"                      // color
    );
} // End of game_drawWaitingState()
//////////////////////////////////////////////////
//     game_drawChessBoard                      //
// Function:                                    //
//     Draws the graphical chessboard interface //
// Return value:                                //
//     None                                     //
//////////////////////////////////////////////////
function game_drawChessBoard()
{
    for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)
    {
        for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)
        {
            var square_color = GAME_CHESSBOARD_COLOR_LIST[(iRowIndex + iColumnIndex) % 2]
            game_fillBox
            (
                iRowIndex * game_chessboard_square_size,    // x
                iColumnIndex * game_chessboard_square_size, // y
                game_chessboard_square_size,                // w
                game_chessboard_square_size,                // h
                square_color                                // style
            );

        } // End of for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)

    } // End of for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)

} // End of game_drawChessBoard()

//////////////////////////////////////////////////////////////////////
//     game_drawChessPieces                                         //
// Function:                                                        //
//     Draws the chess pieces where they currently are on the board //
// Return value:                                                    //
//     None                                                         //
//////////////////////////////////////////////////////////////////////
function game_drawChessPieces()
{
    for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)
    {
        for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)
        {
            game_drawChessPiece
            (
                game_chessboard_instance.getPieceFromPosition(iRowIndex, iColumnIndex),
                iColumnIndex, // Swapping column for rows to get the game drawn graphically correct
                iRowIndex     // to more closely match how the array is interpreted in memory
            );
        } // End of for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)

    } // End of for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)

} // End of game_drawChessPieces()

///////////////////////////////////////////////
//     game_drawChessPiece(iType)            //
// Function:                                 //
//     Draws a chess piece based on its type //
// Return value:                             //
//     None                                  //
///////////////////////////////////////////////
function game_drawChessPiece(oChesspiece, x, y)
{
    var xoffset = 12;
    var yoffset = 15;

    if (oChesspiece.getColor() != GAME_CHESSPIECE__COLOR__NONE)
    {
        if (oChesspiece.getType() != GAME_CHESSPIECE__TYPE__EMPTY)
        {
            var strFile_path_and_name = 
                MEDIA_DIR + 
                GAME_CHESSPIECE__COLOR__STRING_LIST[oChesspiece.getColor() ] + " " +
                GAME_CHESSPIECE__TYPE__STRING_LIST [oChesspiece.getType()] + ".png";

            // File name color + " " + type
            game_drawImageByName
            (
                strFile_path_and_name,
                (x * game_chessboard_square_size) + xoffset,
                (y * game_chessboard_square_size) + yoffset
            );

        } // End of if (oChesspiece.getType() != GAME_CHESSPIECE__TYPE__EMPTY)

    } // End of if (oChesspiece.getColor() != GAME_CHESSPIECE__COLOR__NONE)

} // End of game_drawChessPiece(oChesspiece, x, y)

//////////////////////////////////////////////////////////
//     game_drawImageByName(image_name)                 //
// Function:                                            //
//     Draws an image with default settings by its name //
// Return value:                                        //
//     None                                             //
//////////////////////////////////////////////////////////
function game_drawImageByName(image_name, x, y)
{
    game_ctx.drawImage(image_findObject(image_name), x, y);
} // End of game_drawImage()

///////////////////////////////////////////
//               invertColor             //
// Function:                             //
//     Converts a color to its opposite. //
//     If bw is true, then it will turn  //
//     the color to be black or white.   //
// Return value:                         //
//     string                            //
// Source:                               /////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function invertColor(hex, bw) 
{
    if (hex.indexOf('#') === 0) 
    {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) 
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) 
    {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) 
    {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
function padZero(str, len) 
{
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

////////////////////////////////////////////////////////////
//                    colorNameToHex                      //
// Function:                                              //
//     Uses the color parameter to index the colors table //
//     to return a hex string of a color.                 //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function colorNameToHex(color)
{
    if (typeof colors[color.toLowerCase()] != 'undefined')
    {
        return colors[color.toLowerCase()];
    }

    return null;
}

//////////////////////////////////////////
//            game_copyVector           //
// Function:                            //
//     Creates a deep copy of a vector  //
// Return value:                        //
//     Object {x, y}                    //
//////////////////////////////////////////
function game_copyVector2D(vect)
{
    return {x: vect.x, y: vect.y};
}

////////////////////////////////////////////////////////
//     game_vectorsEqual2D                            //
// Function:                                          //
//     Compares the x and y components of a 2D vector //
// Return value:                                      //
//     Boolean                                        //
////////////////////////////////////////////////////////
function game_vectorsEqual2D(vector1, vector2)
{
    return vector1.x == vector2.x &&
           vector1.y == vector2.y;
} // End of game_vectorsEqual2D(vector1, vector2)

/////////////////////////////////////////
//           game_drawLine             //
// Function:                           //
//     Draws a line between two points //
// Return value:                       //
//     none                            //
/////////////////////////////////////////
function game_drawLine(srcx, srcy, dstx, dsty, line_style, line_width=2)
{
    var old_width           = game_ctx.lineWidth;
    var old_style           = game_ctx.strokeStyle;

    game_ctx.strokeStyle    = style;
    game_ctx.lineWidth      = line_width;

    game_ctx.beginPath();
    game_ctx.moveTo(srcx, srcy);
    game_ctx.lineTo(dstx, dsty);
    game_ctx.stroke();

    game_ctx.lineWidth      = old_width;
    game_ctx.strokeStyle    = old_style;

    return;
}

//////////////////////////
//    game_drawEllipse  //
// Function:            //
//     Draws an ellipse //
// Return value:        //
//     None             //
//////////////////////////
function game_drawEllipse(x, y, width, height)
{
    game_ctx.beginPath();
    game_ctx.ellipse(x, y, width, height);
    game_ctx.stroke();
}

///////////////////////////////////////////////////////////////////////////////////////
//                                game_fillBox                                       //
// Function:                                                                         //
//     Fills the contents of a box with a specified position, dimensions, and style. //
// Return value:                                                                     //
//     none                                                                          //
///////////////////////////////////////////////////////////////////////////////////////
function game_fillBox(x, y, w, h, style)
{
    var old_style = game_ctx.fillStyle;

    game_ctx.fillStyle = style;
    game_ctx.fillRect(x, y, w, h);

    game_ctx.fillStyle = old_style;

    return;
}

///////////////////////////////////////////////////////////////////////
// game_randomNumber                                                 //
// Function:                                                         //
//     Generates a random number between within the range [min, max] //
// Return value:                                                     //
//     Number                                                        //
// Source:                                                           /////////////////////////////////////
// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function game_randomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}