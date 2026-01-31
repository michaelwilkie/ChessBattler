////////////////////////////////////////////////////////
// ui_func.js                                         //
//     Functions for interacting with the UI that the //
//     UI classes will use.                           //
////////////////////////////////////////////////////////
"use strict";

/////////////////////////////////////////////////////////
//                        ui                           //
// Function:                                           //
//     Main loop that draws all the canvas elements.   //
//     It is called repeatedly from CanvasPlatformer() //
//     in the initialize.js file.                      //
// Return value:                                       //
//     none                                            //
/////////////////////////////////////////////////////////
function ui()
{
    // Only allow interaction once the game has been started

    if (HTML_START_GAME__STATE__STARTED == html_start_game_button_state)
    {
        for (var i = 0; i < ui_component_list.length; i++)
        {
            ui_component_list[i].draw();
            ui_component_list[i].update();
        }

        if (game_chess_instance.isHumanTurn())
        {
            ui_highlightSquareByMouse();
            ui_handleSelectedChessPiece();
            ui_highlightSelectedChessPiece();
            ui_highlightSelectedChessPieceMoves();
        }

    } // End of if (HTML_START_GAME__STATE__STARTED == html_start_game_button_state)

    mlastdownleft   = mdownleft; // putting this here in case I have the game paused so I can still register 'press' vs 'unpress' mouse events
    mlastdownright  = mdownright;
    mlastwheel      = mwheel;
    mlastwheeldown  = mwheeldown;
    mlastwheelup    = mwheelup;

    // These lack a corresponding 'stop wheel' like how mouse has a 'mouseup' to signify user has stopped pressing mouse
    // so I am setting them to be false here
    mwheel          = false;
    mwheeldown      = false;
    mwheelup        = false;
} // End of ui()

////////////////////////////////////////////////////////
//     ui_highlightSquareByMouse                      //
// Function:                                          //
//     Draws a red square where the mouse is hovering //
// Return value:                                      //
//     None                                           //
////////////////////////////////////////////////////////
function ui_highlightSquareByMouse()
{
    // Dividing by game_chessboard_square_size makes the position miniature
    // Math.floor turns it into an integer
    var scaled_x_position = Math.floor(mousepos.x / game_chessboard_square_size);
    var scaled_y_position = Math.floor(mousepos.y / game_chessboard_square_size);

    // Multiplying it again by game_chessboard_square_size brings it back to the chess board scale
    ui_drawBox
    (
        Math.floor(scaled_x_position) * game_chessboard_square_size,
        Math.floor(scaled_y_position) * game_chessboard_square_size,
        game_chessboard_square_size,
        game_chessboard_square_size,
        "red"
    );

} // End of ui_highlightSquareByMouse()

///////////////////////////////////////////////////////////////////////////
//     ui_handleSelectedChessPiece                                       //
// Function:                                                             //
//     Toggling which piece has been selected:                           //
//     1. Determine if a piece has not been selected already             //
//         a. Determine if the coordinates landed on a valid chess piece //
//             i. Set the selected chess piece as selected               //
//     2. Determine if the coordinates landed on a valid chess piece     //
//         a. Determine if the same chess piece was selected             //
//             i. Clear the selected chess piece                         //
//         b. Determine if the selected square is a valid chess piece    //
//             i. Set the selected chess piece as selected               //
// Return value:                                                         //
//     None                                                              //
///////////////////////////////////////////////////////////////////////////
function ui_handleSelectedChessPiece(current_player_turn)
{
    // Dividing by game_chessboard_square_size makes the position miniature
    // Math.floor turns it into an integer
    var scaled_x_position = Math.floor(mousepos.x / game_chessboard_square_size);
    var scaled_y_position = Math.floor(mousepos.y / game_chessboard_square_size);

    // Mouse position deals with graphics, the graphical part of the chessboard has x and y swapped
    // Swapping x and y to match the array layout of the chess pieces
    var transposed_x_position = scaled_y_position;
    var transposed_y_position = scaled_x_position;

    //console.log("mousepos.x: " + mousepos.x + "\n" +
    //            "mousepos.y: " + mousepos.y + "\n" +
    //            "square.x  : " + scaled_x_position + "\n" +
    //            "square.y  : " + scaled_y_position + "\n"
    //);

    // Enable for more debug info on the HTML
    //html_textarea_putMousePosition(transposed_x_position, transposed_y_position);

    // A chess piece was clicked
    if (mdownleft && !mlastdownleft)
    {
        var new_selected_chess_piece = game_chessboard_instance.getPieceFromPosition(transposed_x_position, transposed_y_position);

        // Determine if the square clicked was a valid chess piece
        if (new_selected_chess_piece != null)
        {
            // Determine if there wasn't already a selected chess piece
            if (null == game_chessboard_instance.oSelected_chess_piece)
            {
                // A new chess piece is selected

                // Determine if the newly selected chess piece 
                if (new_selected_chess_piece.getType() != GAME_CHESSPIECE__TYPE__EMPTY)
                {
                    // A valid chess piece has been selected

                    // 1ai. Set the new chess piece as the selected one
                    game_chessboard_instance.oSelected_chess_piece = new_selected_chess_piece;
                    game_chessboard_instance.oSelected_chess_piece.getValidMoves();
                } // End of if (new_selected_chess_piece.iChess_piece_type != GAME_CHESSPIECE__TYPE__EMPTY)
                else
                {
                    // An empty slot has been selected
                    game_chessboard_instance.oSelected_chess_piece = null;
                } // End of else (of if (new_selected_chess_piece.getType() != GAME_CHESSPIECE__TYPE__EMPTY))

            } // End of if (null == game_chessboard_instance)
            else
            {
                // A chess piece has previously been selected

                // Determine if the same chess piece was selected
                if (game_chessboard_instance.chessPiecesEqual(new_selected_chess_piece, game_chessboard_instance.oSelected_chess_piece))
                {
                    // The same chess piece was selected

                    // Clear the selected chess piece
                    game_chessboard_instance.oSelected_chess_piece = null;
                } // End of if (new_selected_chess_piece == game_chessboard_instance.oSelected_chess_piece)
                else
                {
                    // A new chess piece was selected

                    // Determine if the selected square is a valid chess piece
                    if (new_selected_chess_piece.getType() != GAME_CHESSPIECE__TYPE__EMPTY)
                    {
                        // A valid chess piece has been selected

                        // Determine if the new piece is an enemy piece
                        if (new_selected_chess_piece.getColor() != game_chessboard_instance.oSelected_chess_piece.getColor())
                        {
                            // Determine if the space is a valid place to move the piece
                            for (var i = 0; i < game_chessboard_instance.oSelected_chess_piece.valid_moves_list.length; i++)
                            {
                                var valid_position = game_chessboard_instance.oSelected_chess_piece.valid_moves_list[i];
                                var new_chess_piece_pos = new_selected_chess_piece.getPosition();

                                // If the user clicked a valid place to move their piece
                                if (new_chess_piece_pos.x == valid_position.x
                                 && new_chess_piece_pos.y == valid_position.y)
                                {
                                    // Swap the pieces
                                    game_chessboard_instance.capturePiece(game_chessboard_instance.oSelected_chess_piece, new_selected_chess_piece);

                                    // Advance the state machine
                                    game_chess_instance.humanMove();
                                }
                            } // End of for (var i = 0; i < game_chessboard_instance.oSelected_chess_piece.valid_moves_list.length; i++)

                            // The piece should have been moved by now, so time to de-select the selected piece by setting it to null
                            game_chessboard_instance.oSelected_chess_piece = null;

                            // OPTIONAL:
                            //     If you want to have one player be able to select an enemy piece with an ally piece selected,
                            //     add:
                            //         if (game_chessboard_instance.oSelected_chess_piece != null)
                            //     here

                        } // End of if (new_selected_chess_piece.getColor() != game_chessboard_instance.oSelected_chess_piece.getColor())
                        else
                        {
                            // The new piece is an ally

                            // Set the selected chess piece
                            game_chessboard_instance.oSelected_chess_piece = new_selected_chess_piece;
                        } // End of else (of if (new_selected_chess_piece.getColor() != game_chessboard_instance.oSelected_chess_piece.getColor()))


                    } // End of if (new_selected_chess_piece.iChess_piece_type != GAME_CHESSPIECE__TYPE__EMPTY)
                    else
                    {
                        // The clicked space is empty

                        // Determine if the space is a valid place to move the piece
                        for (var i = 0; i < game_chessboard_instance.oSelected_chess_piece.valid_moves_list.length; i++)
                        {
                            var valid_position = game_chessboard_instance.oSelected_chess_piece.valid_moves_list[i];
                            var new_chess_piece_pos = new_selected_chess_piece.getPosition();

                            // If the user clicked a valid place to move their piece
                            if (new_chess_piece_pos.x == valid_position.x
                             && new_chess_piece_pos.y == valid_position.y)
                            {
                                // Swap the pieces
                                game_chessboard_instance.swapPieces(new_selected_chess_piece, game_chessboard_instance.oSelected_chess_piece);

                                // Advance the state machine
                                game_chess_instance.humanMove();
                            }
                        } // End of for (var i = 0; i < game_chessboard_instance.oSelected_chess_piece.valid_moves_list.length; i++)

                        // An empty slot has been selected
                        game_chessboard_instance.oSelected_chess_piece = null;

                    } // End of else (of if (new_selected_chess_piece.getType() != GAME_CHESSPIECE__TYPE__EMPTY))

                } // End of else (of if (new_selected_chess_piece == game_chessboard_instance.oSelected_chess_piece))

            } // End of else (of if (null == game_chessboard_instance))

        } // End of if (new_selected_chess_piece != null)

        /* Enable this if you want to show selected entity statistics on the HTML
           You will also have to set the display css settings on the HTML to anything other than "none"
        // Populate the textarea on the HTML
        if (game_chessboard_instance.oSelected_chess_piece != null)
        {
            html_textarea_putSelectedEntity();
        }
        */

    } // End of if (mdownleft && !mlastdownleft)

} // End of ui_handleSelectedChessPiece()

/////////////////////////////////////////////////////////////////////////
//     ui_highlightSelectedChessPiece                                  //
// Function:                                                           //
//     Highlights a red transparent square on the selected chess piece //
// Return value:                                                       //
//     None                                                            //
/////////////////////////////////////////////////////////////////////////
function ui_highlightSelectedChessPiece()
{
    if (game_chessboard_instance.oSelected_chess_piece != null)
    {
        var oPosition = game_chessboard_instance.oSelected_chess_piece.getPosition();
        var old_alpha = ui_ctx.globalAlpha;

        ui_ctx.globalAlpha = UI_DEFAULT_SQUARE_TRANSPARENCY;

        ui_fillBox
        (
            // Flipping x and y since graphical display of the chess board is flipped
            oPosition.y * game_chessboard_square_size, // x
            oPosition.x * game_chessboard_square_size, // y
            game_chessboard_square_size              , // w
            game_chessboard_square_size              , // h
            "red"                                      // style
        );

        ui_ctx.globalAlpha = old_alpha;

    } // End of if (game_chessboard_instance.oSelected_chess_piece != null)

} // End of ui_highlightSelectedChessPiece()

///////////////////////////////////////////////////////
//     ui_highlightSelectedChessPieceMoves           //
// Function:                                         //
//     Highlights all the squares the piece can move //
// Return value:                                     //
//     None                                          //
///////////////////////////////////////////////////////
function ui_highlightSelectedChessPieceMoves()
{
    if (game_chessboard_instance.oSelected_chess_piece != null)
    {
        var old_alpha = ui_ctx.globalAlpha;
        ui_ctx.globalAlpha = UI_DEFAULT_SQUARE_TRANSPARENCY;

        for (var i = 0; i < game_chessboard_instance.oSelected_chess_piece.valid_moves_list.length; i++)
        {
            var oPosition = game_chessboard_instance.oSelected_chess_piece.valid_moves_list[i];
            ui_fillBox
            (
                // Flipping x and y since graphical display of the chess board is flipped
                oPosition.y * game_chessboard_square_size, // x
                oPosition.x * game_chessboard_square_size, // y
                game_chessboard_square_size              , // w
                game_chessboard_square_size              , // h
                "blue"                                     // style
            );
        } // End of for (var i = 0; i < valid_moves_list.length; i++)

        ui_ctx.globalAlpha = old_alpha;
    } // End of if (game_chessboard_instance.oSelected_chess_piece != null)

} // End of ui_highlightSelectedChessPieceMoves()

////////////////////////////////////////////////////////////
//                       getFont                          //
// Function:                                              //
//     Formats the given parameters in the following way: //
//         "XXpx WWWWW"                                   //
//     Where XX is a number representing font size        //
//     and WWWW is text representing font style           //
// Return value:                                          //
//     string                                             //
////////////////////////////////////////////////////////////
function ui_getFont(font, fontsize)
{
    var base_10 = 10;
    return fontsize.toString(base_10) + "px" + " " + font;
}

////////////////////////////////////////////////////////////////
//                      prepareContext                        //
// Function:                                                  //
//     Replaces the default UI variables with the parameters. //
// Return value:                                              //
//     none                                                   //
////////////////////////////////////////////////////////////////
function ui_prepareContext(font, fontsize, text_color, background_color)
{
    ui_font             = font            ;
    ui_fontsize         = fontsize        ;
    ui_text_color       = text_color      ;
    ui_background_color = background_color;

    return;
}

/////////////////////////////////////////
//              drawLine               //
// Function:                           //
//     Draws a line between two points //
// Return value:                       //
//     none                            //
/////////////////////////////////////////
function ui_drawLine(srcx, srcy, dstx, dsty, line_style, line_width=2)
{
    var old_width       = ui_ctx.lineWidth;
    var old_style       = ui_ctx.strokeStyle;

    ui_ctx.strokeStyle  = style;
    ui_ctx.lineWidth    = line_width;

    ui_ctx.beginPath();
    ui_ctx.moveTo(srcx, srcy);
    ui_ctx.lineTo(dstx, dsty);
    ui_ctx.stroke();

    ui_ctx.lineWidth    = old_width;
    ui_ctx.strokeStyle  = old_style;

    return;
}

///////////////////////////////////////////////////////////////////////
//                           setFillColor                            //
// Function:                                                         //
//     Updates the ui_ctx with a new fill style specified by 'color' //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function ui_setFillColor(color)
{
    ui_ctx.fillStyle = color;

    return;
}

//////////////////////////////////////////////////////////////////////////////////////////
//                                     drawText                                         //
// Function:                                                                            //
//     Draws text at an absolute position (not relative position like in game objects). //
// Return value:                                                                        //
//     none                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////
function ui_drawText(text, x, y, color,
                     alignment=ui_default_text_alignment,
                     font     =ui_default_font,
                     fontsize =ui_default_fontsize)
{
    ui_ctx.font         = ui_getFont(font, fontsize);
    ui_ctx.fillStyle    = color;
    ui_ctx.textAlign    = alignment;
    ui_ctx.fillText(text, x, y);

    return;
}

///////////////////////////////////////////////////////////////////////
//                             drawBox                               //
// Function:                                                         //
//     Draws a box with a specified position, dimensions, and style. //
// Return value:                                                     //
//     none                                                          //
///////////////////////////////////////////////////////////////////////
function ui_drawBox(x, y, w, h, style, line_width=2)
{
    var old_width       = ui_ctx.lineWidth;
    var old_style       = ui_ctx.strokeStyle;
    ui_ctx.strokeStyle  = style;
    ui_ctx.lineWidth    = line_width;

    ui_ctx.beginPath();
    ui_ctx.rect(x, y, w, h);
    ui_ctx.stroke();

    ui_ctx.lineWidth    = old_width;
    ui_ctx.strokeStyle  = old_style;

    return;
}

////////////////////////////////////////////////////////////////////
//                       invertedClearRect                        //
// Function:                                                      //
//     Clears everything outside of a given rectangle.            //
//     +---------------------------------+                        //
//     |                1                |                        //
//     |                                 |                        //
//     |------#============#-------------|                        //
//     |   3  || rectangle||      4      |                        //
//     |      ||          ||             |                        //
//     |------#============#-------------|                        //
//     |                                 |                        //
//     |                                 |                        //
//     |                2                |                        //
//     |                                 |                        //
//     |                                 |                        //
//     +---------------------------------+                        //
//                                                                //
// Box 1 is only disqualified if rect.y <= 0                      //
// Box 2 is only disqualified if rect.y + rect.h >= SCREEN_HEIGHT //
// Box 3 is only disqualified if rect.x <= 0                      //
// Box 4 is only disqualified if rect.x + rect.w >= SCREEN_WIDTH  //
//     Parts 1, 2, 3, 4 will be cleared                           //
// Return value:                                                  //
//     none                                                       //
////////////////////////////////////////////////////////////////////
function ui_invertedClearRect(x, y, w, h)
{
    var rect1 = {x: 0    , y: 0    , w: SCREEN_WIDTH          , h: y                       };
    var rect2 = {x: 0    , y: y + h, w: SCREEN_WIDTH          , h: SCREEN_HEIGHT - (y + h) };
    var rect3 = {x: 0    , y: y    , w: x                     , h: h                       };
    var rect4 = {x: x + w, y: y    , w: SCREEN_WIDTH - (x + w), h: h                       };

    if (y > 0)                  { ui_ctx.clearRect(rect1.x, rect1.y, rect1.w, rect1.h); }
    if (y + h < SCREEN_HEIGHT)  { ui_ctx.clearRect(rect2.x, rect2.y, rect2.w, rect2.h); }
    if (x > 0)                  { ui_ctx.clearRect(rect3.x, rect3.y, rect3.w, rect3.h); }
    if (x + w < SCREEN_WIDTH )  { ui_ctx.clearRect(rect4.x, rect4.y, rect4.w, rect4.h); }

    return;
}

///////////////////////////////////////////////////////////////////////////////////////
//                                   fillBox                                         //
// Function:                                                                         //
//     Fills the contents of a box with a specified position, dimensions, and style. //
// Return value:                                                                     //
//     none                                                                          //
///////////////////////////////////////////////////////////////////////////////////////
function ui_fillBox(x, y, w, h, style)
{
    var old_style = ui_ctx.fillStyle;

    ui_ctx.fillStyle = style;
    ui_ctx.fillRect(x, y, w, h);

    ui_ctx.fillStyle = old_style;

    return;
}