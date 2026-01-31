////////////////////////
// game_chessboard.js //
// Chess board object //
////////////////////////
"use_strict";

const GAME_CHESSBOARD__STATUS__UNINITIALIZED    = 0; // Board has yet to be initialized and setup
const GAME_CHESSBOARD__STATUS__READY            = 1; // Board has all the pieces setup
const GAME_CHESSBOARD__STATUS__GAME_IN_PROGRESS = 2; // Board has pieces not in their default positions

const g_initial_board = [
    0xACBDEBCA,
    0x99999999,
    0x00000000,
    0x00000000,
    0x00000000,
    0x00000000,
    0x11111111,
    0x23465432
];

class ChessBoard
{
    constructor()
    {
        // Initialize the state
        this.iState = GAME_CHESSBOARD__STATUS__UNINITIALIZED;

        // Initialize all places with the default chess piece types
        this.setupBoard();

        // Debugging purposes
        this.printBoardPieces();

        // For highlighting
        this.oSelected_chess_piece = null;

    } // End of constructor()

    /////////////////////////////////////////////////////////////////////////
    //     ChessBoard.setupBoard()                                         //
    // Function:                                                           //
    //     Sets all spaces in this.oChess_board to the default chess setup //
    // Return value:                                                       //
    //     None                                                            //
    /////////////////////////////////////////////////////////////////////////
    setupBoard()
    {
        // Initialize the oChess_board object
        this.oChess_board = this.bitmapTo2D(g_initial_board);

        // The board is cleared and has been arranged
        this.iState = GAME_CHESSBOARD__STATUS__READY;

    } // End of setupBoard()

    //////////////////////////////////////////////////////////////////////////////////////
    // ChessBoard.bitmapTo2D                                                            //
    // Function:                                                                        //
    //     Turns a chessboard from a bitmap to a two-dimensional array of chess objects //
    // Return value:                                                                    //
    //     Array<Array<ChessPiece>>                                                     //
    //////////////////////////////////////////////////////////////////////////////////////
    bitmapTo2D(oBitmap_list)
    {
        var oReturn_board = [];

        // Determine if the bitmap is valid
        if (oBitmap_list != null)
        {
            // Determine if the length is valid
            if (GAME_CHESSBOARD_WIDTH == oBitmap_list.length)
            {
                // Loop through the rows in the bitmap list
                for (var iBitmap_index = 0; iBitmap_index < GAME_CHESSBOARD_WIDTH; iBitmap_index++)
                {
                    var iBitmap_row = oBitmap_list[iBitmap_index];
                    var oBoard_row  = [];

                    // Loop through the bits in the row
                    for (var iNibble_index = 0; iNibble_index < GAME_CHESSBOARD_WIDTH; iNibble_index++)
                    {
                        var iBits_per_nibble = 4;

                        // Grab the front piece
                        var iFront_piece = iBitmap_row & 0xF;

                        // Create a new chess piece object at this location
                        oBoard_row.push(new ChessPiece(iFront_piece, {x: iBitmap_index, y:iNibble_index}));

                        // Shift the bits over in groups of 4 based on the column
                        iBitmap_row = iBitmap_row >> iBits_per_nibble;

                        // Log hexadecimal
                        console.log("iBitmap_row: " + game_decimalToHex(iBitmap_row));
                    } // for (var iNibble_index = 0; iNibble_index < GAME_CHESSBOARD_WIDTH; iNibble_index++)

                    // Add a row to the board that we are generating
                    oReturn_board.push(oBoard_row);

                } // End of for (var iBitmap_index = 0; iBitmap_index < GAME_CHESSBOARD_WIDTH; iBitmap_index++)

            } // End of if (GAME_CHESSBOARD_WIDTH == oBitmap_list.length)
            else
            {
                console.log("bitmapTo2D: Error: Invalid chessboard size of " + oBitmap_list.length);
            } // End of else (of if (GAME_CHESSBOARD_WIDTH == oBitmap_list.length))

        } // End of if (oBitmap_list != null)
        else
        {
            console.log("bitmapTo2D: Error: oBitmap_list is null");
        } // End of else (of if (oBitmap_list != null))

        return oReturn_board;

    } // End of ChessBoard.bitmapTo2D()

    //////////////////////////////////////////////////////////////////////////////
    // ChessBoard.getBlackPieces                                                //
    // Function:                                                                //
    //     Loops through the board and returns an array of all the black pieces //
    // Return value:                                                            //
    //     Array<ChessPiece>                                                    //
    //////////////////////////////////////////////////////////////////////////////
    getBlackPieces()
    {
        var black_pieces_list = [];
        for (var x = 0; x < GAME_CHESSBOARD_WIDTH; x++)
        {
            for (var y = 0; y < GAME_CHESSBOARD_WIDTH; y++)
            {
                if (this.isBlackPiece(this.oChess_board[x][y]))
                {
                    black_pieces_list.push(this.oChess_board[x][y]);
                }
            }
        }

        return black_pieces_list;
    } // End of getBlackPieces()

    /////////////////////////////////////////////
    // ChessBoard.getPieceFromPosition         //
    // Function:                               //
    //    Gets the piece from a row and column //
    // Return value:                           //
    //    Integer                              //
    /////////////////////////////////////////////
    getPieceFromPosition(x, y)
    {
        return this.oChess_board[x][y];
    } // End of ChessBoard.getPieceFromPosition(x, y)

    ///////////////////////////////////////////////////////////////////
    // ChessBoard.isBlackPiece                                       //
    // Function:                                                     //
    //     Determines whether the piece in a row is a black piece    //
    // Return value:                                                 //
    //     Boolean                                                   //
    ///////////////////////////////////////////////////////////////////
    isBlackPiece(oPiece)
    {
        return oPiece.isBlack();
    } // End of ChessBoard.isBlackPiece(iPiece)

    ///////////////////////////////////////////////////////////////////
    // ChessBoard.isWhitePiece                                       //
    // Function:                                                     //
    //     Determines whether the piece in a row is a white piece    //
    // Return value:                                                 //
    //     Boolean                                                   //
    ///////////////////////////////////////////////////////////////////
    isWhitePiece(oPiece)
    {
        // Determine if the piece type is within a certain bound if it is white
        return oPiece.isWhite();
    } // End of ChessBoard.isWhitePiece(iPiece)

    //////////////////////////////////////////////////////////////////////////////
    // ChessBoard.getWhitePieces                                                //
    // Function:                                                                //
    //     Loops through the board and returns an array of all the white pieces //
    // Return value:                                                            //
    //     Array<ChessPiece>                                                    //
    //////////////////////////////////////////////////////////////////////////////
    getWhitePieces()
    {
        var white_pieces_list = [];
        for (var x = 0; x < GAME_CHESSBOARD_WIDTH; x++)
        {
            for (var y = 0; y < GAME_CHESSBOARD_WIDTH; y++)
            {
                if (this.isWhitePiece(this.oChess_board[x][y]))
                {
                    white_pieces_list.push(this.oChess_board[x][y]);
                }
            }
        }

        return white_pieces_list;
    } // End of getWhitePieces()

    ///////////////////////////////////////////////
    // ChessBoard.getPieceByTypeAndColor         //
    // Function:                                 //
    //     Finds a piece based on type and color //
    //     or multiple pieces if there are more  //
    //     than one of the same type and color   //
    // Return value:                             //
    //     ChessPiece                            //
    ///////////////////////////////////////////////
    getPieceByTypeAndColor(iType, iColor)
    {
        var oReturn_list = [];
        for (var x = 0; x < GAME_CHESSBOARD_WIDTH; x++)
        {
            for (var y = 0; y < GAME_CHESSBOARD_WIDTH; y++)
            {
                if (iColor == this.oChess_board[x][y].getColor()
                 && iType  == this.oChess_board[x][y].getType())
                {
                    oReturn_list.push(this.oChess_board[x][y]);
                }
            }
        }

        return oReturn_list;
    } // End of ChessBoard.getPieceByTypeAndColor()

    ////////////////////////////////////////////
    // ChessBoard.printBoardPieces()          //
    // Function:                              //
    //     Prints the board pieces to console //
    // Return value:                          //
    //     None                               //
    ////////////////////////////////////////////
    printBoardPieces()
    {
        var board_string = [];
        var row_string   = "";

        for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)
        {
            row_string = "";

            for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)
            {
                row_string += GAME_CHESSPIECE__TYPE__CHAR_LIST[
                    this.getPieceFromPosition(iRowIndex, iColumnIndex).iChess_piece_type
                ];
            } // End of for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)

            board_string += row_string + "\n";
        } // End of for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)

        console.log(board_string);
    } // End of printBoardPieces()

    ////////////////////////////////////////////////////////
    // ChessBoard.getPieceFromPosition(x, y)              //
    // Function:                                          //
    //     Gets the chess piece at a certain position x,y //
    // Return value:                                      //
    //     None                                           //
    ////////////////////////////////////////////////////////
    getPieceFromPosition(x, y)
    {
        // Determine if the values are in bounds
        if (x >= 0 || x < GAME_CHESSBOARD_WIDTH)
        {
            if (y >= 0 || y < GAME_CHESSBOARD_WIDTH)
            {
                try
                {
                    return this.oChess_board[x][y];
                }
                catch (error)
                {
                    console.log("Error: getPieceFromPosition(x,y)=(" + x + ", " + y + "): " + error);
                }
            }
            else
            {
                throw "Invalid y position: " + y;
            }
        }
        else
        {
            throw "Invalid x position: " + x;
        }
    } // End of getPieceFromPosition(x, y)

    //////////////////////////////////////////////////////////////
    // ChessBoard.chessPiecesEqual(piece1, piece2)              //
    // Function:                                                //
    //     Determines if the pieces type and color are the same //
    // Return value:                                            //
    //     Boolean                                              //
    //////////////////////////////////////////////////////////////
    chessPiecesEqual(piece1, piece2)
    {
        if (null == piece1
         || null == piece2)
        {
            return false;
        }
        else
        {
            return piece1.getType() == piece2.getType()
                && piece1.getColor()== piece2.getColor()
                && game_vectorsEqual2D(piece1.getPosition(), piece2.getPosition());
        }
    } // End of chessPiecesEqual(piece1, piece2)

    /////////////////////////////////////////////////
    //     ChessBoard.getPositionFromPiece()       //
    // Function:                                   //
    //     Gets the coordinates from a chess piece //
    // Return value:                               //
    //     Object {x,y} or null                    //
    /////////////////////////////////////////////////
    getPositionFromPiece(oChess_piece)
    {
        for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)
        {
            for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)
            {
                if (this.chessPiecesEqual(this.oChess_board[iRowIndex][iColumnIndex], oChess_piece))
                {
                    return {x: iRowIndex, y: iColumnIndex};
                }
            } // End of for (var iColumnIndex = 0; iColumnIndex < GAME_CHESSBOARD_WIDTH; iColumnIndex++)

        } // End of for (var iRowIndex = 0; iRowIndex < GAME_CHESSBOARD_WIDTH; iRowIndex++)

        return null;
    } // End of getPieceFromPosition(x, y)

    /////////////////////////////////////////////////
    //     ChessBoard.capturePiece(killer, victim) //
    // Function:                                   //
    //     Kill the victim, swap their places      //
    // Return value:                               //
    //     None                                    //
    /////////////////////////////////////////////////
    capturePiece(killer, victim)
    {
        var victim_pos = victim.getPosition();

        // In case a pawn finds a piece
        this.bPiece_has_moved_once = true;

        // Kill the victim
        this.oChess_board[victim_pos.x][victim_pos.y].clearSpace();

        // Swap places with the killer
        this.swapPieces(killer, victim);

    } // End of capturePiece(killer, victim)

    //////////////////////////////////////////////////
    //     ChessBoard.swapPieces(piece1, piece2)    //
    // Function:                                    //
    //     Swaps the positions of piece1 and piece2 //
    //     even if one of them is empty             //
    // Return value:                                //
    //     None                                     //
    //////////////////////////////////////////////////
    swapPieces(piece1, piece2)
    {
        // For pawns
        piece1.bPiece_has_moved_once = true;

        var piece1_pos = piece1.getPosition();
        var piece2_pos = piece2.getPosition();

        var temp_piece = new ChessPiece(piece1.getMask(), piece1_pos);

        this.oChess_board[piece1_pos.x][piece1_pos.y].setProperties(piece2.getType()    , piece2.getColor()    );
        this.oChess_board[piece2_pos.x][piece2_pos.y].setProperties(temp_piece.getType(), temp_piece.getColor());

        return;
    } // End of swapPieces(piece1, piece2)

    //////////////////////////////////////////////////////////////////////////////////
    //     ChessBoard.coordinatesValid(iRowIndex, iColumnIndex)                     //
    // Function:                                                                    //
    //     Determines if the coordinates provided are within the oChess_board array //
    // Return value:                                                                //
    //     Boolean                                                                  //
    //////////////////////////////////////////////////////////////////////////////////
    coordinatesValid(iRowIndex, iColumnIndex)
    {
        var bReturn = false;

        if (iRowIndex != null)
        {
            if (iColumnIndex != null)
            {
                if (GAME_CHESSBOARD_WIDTH > iRowIndex)
                {
                    if (iRowIndex >= 0)
                    {
                        if (GAME_CHESSBOARD_WIDTH > iColumnIndex)
                        {
                            if (iColumnIndex >= 0)
                            {
                                bReturn = true;
                            } // End of if (iColumnIndex >= 0)
                            else
                            {
                                //console.log("Chessboard.coordinatesValid(): Invalid iColumnIndex: it is less than 0");
                            } // End of else (of if (iColumnIndex >= 0))

                        } // End of if (GAME_CHESSBOARD_WIDTH > iColumnIndex)
                        else
                        {
                            //console.log("Chessboard.coordinatesValid(): Invalid iColumnIndex: it is greater than " + GAME_CHESSBOARD_WIDTH);
                        } // End of else (of if (GAME_CHESSBOARD_WIDTH > iColumnIndex))

                    } // End of if (iRowIndex < 0)
                    else
                    {
                        //console.log("Chessboard.coordinatesValid(): Invalid iRowIndex: it is less than 0");
                    } // End of else (of if (iRowIndex < 0))

                } // End of if (GAME_CHESSBOARD_WIDTH > iRowIndex)
                else
                {
                    //console.log("Chessboard.coordinatesValid(): Invalid iRowIndex: it is greater than " + GAME_CHESSBOARD_WIDTH);
                } // End of else (of if (GAME_CHESSBOARD_WIDTH > iRowIndex))

            } // End of if (iColumnIndex != null)
            else
            {
                //console.log("Chessboard.coordinatesValid(): iColumnIndex is NULL");
            } // End of else (of if (iColumnIndex != null))

        } // End of if (iRowIndex != null)
        else
        {
            //console.log("Chessboard.coordinatesValid(): iRowIndex is NULL");
        } // End of else (of if (iRowIndex != null))

        return bReturn;

    } // End of coordinatesValid(iRowIndex, iColumnIndex)

} // End of class ChessBoard