////////////////////////////////
// game_chesspiece.js         //
// Chess Piece implementation //
////////////////////////////////
"use strict";

const GAME_CHESSPIECE__NIBBLE         = 0xF; // 1111

const GAME_CHESSPIECE__TYPE__EMPTY    = 0x0; // 0000

const GAME_CHESSPIECE__TYPE__PAWN     = 0x1; // 0001
const GAME_CHESSPIECE__TYPE__ROOK     = 0x2; // 0010
const GAME_CHESSPIECE__TYPE__BISHOP   = 0x3; // 0011
const GAME_CHESSPIECE__TYPE__KNIGHT   = 0x4; // 0100
const GAME_CHESSPIECE__TYPE__QUEEN    = 0x5; // 0101
const GAME_CHESSPIECE__TYPE__KING     = 0x6; // 0110

const GAME_CHESSPIECE__TYPE__STRING_LIST = [
    "empty"    , // 0
    "pawn"     , // 1
    "rook"     , // 2
    "bishop"   , // 3
    "horsey"   , // 4 - Knight is renamed to horsey to help with abbreviating K since King also uses K
    "queen"    , // 5
    "king"       // 6
];

const GAME_CHESSPIECE__TYPE__CHAR_LIST = [
    "E",
    "P",
    "R",
    "B",
    "H", // K is already taken by the King
    "Q",
    "K"
];

const GAME_CHESSPIECE__TYPE__MASK   = 7; // 0111 - The type of the chess piece is contained within the first three bits

const GAME_CHESSPIECE__COLOR__NONE  = 0;
const GAME_CHESSPIECE__COLOR__BLACK = 1;
const GAME_CHESSPIECE__COLOR__WHITE = 2;

const GAME_CHESSPIECE__COLOR__STRING_LIST = [
    "none" , // 0
    "black", // 1
    "white"  // 2
];

// Color bit masks
const GAME_CHESSPIECE__COLOR__MASK = 8; // 1000 - The 3rd bit is 1

const GAME_CHESSPIECE__RETURN_SUCCESS             =  0;
const GAME_CHESSPIECE__RETURN_NULL_VALUE          = -1;
const GAME_CHESSPIECE__RETURN_INVALID_CHESS_PIECE = -2;

class ChessPiece
{
    constructor(iPieceMask, oPosition)
    {
        this.iType                 = this.getTypeFromMask (iPieceMask); // [Number ] Type of chess piece
        this.iColor                = this.getColorFromMask(iPieceMask); // [Number ] Piece color
        this.oPosition             = {x: -1, y: -1}                   ; // [Object ] Coordinates of the piece
        this.bHas_king_in_check    = false                            ; // [Boolean] Flag determining if this piece currently has a king in check
        this.bPiece_has_moved_once = false                            ; // [Boolean] Flag for pawns determining whether this piece has moved from its spawn position
        this.valid_moves_list      = []                               ; // [Number ] List of valid moves this piece can make

        // Apply the properties to the object
        this.setProperties(this.iType, this.iColor, oPosition);
    }

    /////////////////////////////////////////////////////////
    // ChessPiece.getTypeFromMask                          //
    // Function:                                           //
    //     Gets the piece type from a bit mask             //
    // Parameters:                                         //
    //     iMask [IN] = [Number] Bit mask of a chess piece //
    // Return value:                                       //
    //     Number                                          //
    /////////////////////////////////////////////////////////
    getTypeFromMask(iMask)
    {
        return iMask & GAME_CHESSPIECE__TYPE__MASK;
    } // End of ChessPiece.getTypeFromMask()

    /////////////////////////////////////////////////////////
    // ChessPiece.getColorFromMask                         //
    // Function:                                           //
    //     Gets the piece color from a bit bask            //
    // Parameters:                                         //
    //     iMask [IN] = [Number] Bit mask of a chess piece //
    // Return value:                                       //
    //     Number                                          //
    /////////////////////////////////////////////////////////
    getColorFromMask(iMask)
    {
        var iReturn = GAME_CHESSPIECE__COLOR__NONE;

        // Determine if the black color bit is set
        if (iMask & GAME_CHESSPIECE__COLOR__MASK)
        {
            iReturn = GAME_CHESSPIECE__COLOR__BLACK;
        }
        else
        {
            iReturn = GAME_CHESSPIECE__COLOR__WHITE;
        }

        return iReturn;
    } // End of ChessPiece.getColorFromMask()

    /////////////////////////////////////////////////////
    // ChessPiece.getMask                              //
    // Function:                                       //
    //     Gets the piece color and type as a bit mask //
    // Return value:                                   //
    //     Number                                      //
    /////////////////////////////////////////////////////
    getMask()
    {
        var iPieceMask = 0         ; // [Number] The final number representing the chess piece as a bit mask
        var iTypeMask  = this.iType; // [Number] The type currently maps 1 to 1 to its type bit mask
        var iColorMask = 0         ; // [Number] The color bit mask

        if (this.isBlack())
        {
            iColorMask = GAME_CHESSPIECE__COLOR__MASK;
        }

        iPieceMask  = GAME_CHESSPIECE__TYPE__MASK  & iTypeMask ;
        iPieceMask += GAME_CHESSPIECE__COLOR__MASK & iColorMask;

        return iPieceMask;
    }

    ////////////////////////////////////////
    //     ChessPiece.getType()           //
    // Function:                          //
    //     Gets the piece type            //
    // Return value:                      //
    //     Number                         //
    ////////////////////////////////////////
    getType()
    {
        return this.iType;
    }

    ////////////////////////////////////////
    //     ChessPiece.setType(iType)      //
    // Function:                          //
    //     Sets the piece type            //
    // Return value:                      //
    //     None                           //
    ////////////////////////////////////////
    setType(iType)
    {
        this.iType = iType;
    }

    /////////////////////////////////////////////
    //     ChessPiece.getColor()               //
    // Function:                               //
    //     Gets the color/team the piece is on //
    // Return value:                           //
    //     Number                              //
    /////////////////////////////////////////////
    getColor()
    {
        return this.iColor;
    }

    /////////////////////////////////////////////////
    //    ChessPiece.isBlack()                     //
    // Function:                                   //
    //     Determines if this chess piece is black //
    // Return value:                               //
    //     Boolean                                 //
    /////////////////////////////////////////////////
    isBlack()
    {
        return this.iColor == GAME_CHESSPIECE__COLOR__BLACK;
    }

    /////////////////////////////////////////////////
    //    ChessPiece.isWhite()                     //
    // Function:                                   //
    //     Determines if this chess piece is white //
    // Return value:                               //
    //     Boolean                                 //
    /////////////////////////////////////////////////
    isWhite()
    {
        return this.iColor == GAME_CHESSPIECE__COLOR__WHITE;
    }

    /////////////////////////////////////////////
    //     ChessPiece.setColor(iColor)         //
    // Function:                               //
    //     Sets the color/team the piece is on //
    // Return value:                           //
    //     None                                //
    /////////////////////////////////////////////
    setColor(iColor)
    {
        this.iColor = iColor;
    }

    ////////////////////////////////////////////
    // ChessPiece.hasKingInCheck()            //
    // Function:                              //
    //     Returns the king in check variable //
    // Return value:                          //
    //     Boolean                            //
    ////////////////////////////////////////////
    hasKingInCheck()
    {
        return this.bHas_king_in_check;
    }

    //////////////////////////////////////////////////////////////////////////////
    //     ChessPiece.getPosition()                                             //
    // Function:                                                                //
    //     Gets the position within the chess_board_instance.oChess_board array //
    // Return value:                                                            //
    //     {x: Number, y: Number}                                               //
    //////////////////////////////////////////////////////////////////////////////
    getPosition()
    {
        return this.oPosition;
    }

    ////////////////////////////////////////////////
    //     ChessPiece.getPositionCopy()           //
    // Function:                                  //
    //     Gets a deep copy of the piece position //
    // Return value:                              //
    //     {x: Number, y: Number}                 //
    ////////////////////////////////////////////////
    getPositionCopy()
    {
        return game_copyVector2D(this.oPosition);
    }

    //////////////////////////////////////////////////////////////////////////////
    //     ChessPiece.setPosition(oPosition)                                    //
    // Function:                                                                //
    //     Sets the position within the chess_board_instance.oChess_board array //
    // Return value:                                                            //
    //     None                                                                 //
    //////////////////////////////////////////////////////////////////////////////
    setPosition(oPosition)
    {
        this.oPosition = game_copyVector2D(oPosition);
    }

    ////////////////////////////////////////////////////////
    //     ChessPiece.isEmpty()                           //
    // Function:                                          //
    //     Returns true if this chess piece type is empty //
    // Return value:                                      //
    //     Boolean                                        //
    ////////////////////////////////////////////////////////
    isEmpty()
    {
        return this.getType() == GAME_CHESSPIECE__TYPE__EMPTY;
    }

    ////////////////////////////////////////////////////////////
    //     ChessPiece.isSameTeam(oPiece)                      //
    // Function:                                              //
    //     Returns true if this chess piece color is the same //
    //     as the chess piece color of oPiece                 //
    // Return value:                                          //
    //     Boolean                                            //
    ////////////////////////////////////////////////////////////
    isSameTeam(oPiece)
    {
        return this.getColor() == oPiece.getColor();
    }

    ///////////////////////////////////////////////////////////////
    //     ChessPiece.setProperties(iType, iColor, oPosition)    //
    // Function:                                                 //
    //     Sets the properties of a chess piece, if the property //
    //     is null, then it is not changed                       //
    // Return value:                                             //
    //     None                                                  //
    ///////////////////////////////////////////////////////////////
    setProperties(iType, iColor, oPosition)
    {
        if (iType != null)
        {
            this.setType(iType);
        }

        if (iColor != null)
        {
            this.setColor(iColor);
        }

        if (oPosition != null)
        {
            this.setPosition(oPosition);
        }
    } // End of setProperties(iType, iColor, oPosition)

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // ChessPiece.checkForEnemyKing()                                                                 //
    // Function:                                                                                      //
    //     Determines if, within the list of valid moves, there is an enemy king                      //
    // Parameters:                                                                                    //
    //     valid_moves_list [IN] = [Array<{x,y}>] List of valid positions this current piece can make //
    // Return value:                                                                                  //
    //     ChessPiece - The king that is in check                                                     //
    //     null       - No king is in check, orthe valid moves list wasn't valid                      //
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    checkForEnemyKing(valid_moves_list)
    {
        var oReturn = null;

        // Null checks
        if (null == valid_moves_list       ) { return oReturn; }
        if (null == valid_moves_list.length) { return oReturn; }
        if (   0 == valid_moves_list.length) { return oReturn; }

        for (var iMoveIndex = 0; iMoveIndex < valid_moves_list.length; iMoveIndex++)
        {
            var oPosition   = valid_moves_list[iMoveIndex];
            var oChessPiece = game_chessboard_instance.getPieceFromPosition(oPosition.x, oPosition.y);

            // Determine if this piece is on the opposite team and is a king
            if (    (this.getColor()             != oChessPiece.getColor())
                 && (GAME_CHESSPIECE__TYPE__KING == oChessPiece.getType() )    )
            {
                // The current chess piece has the opposite king in their "valid_moves_list" array
                // Set the return value as the king that is now in check
                oReturn = oChessPiece;

                // Setting the checked board pieces here for convenience
                game_chessboard_instance.oKing_in_check         = oChessPiece;
                game_chessboard_instance.oPiece_checking_king   = this;

                // King in check found, break out of the function
                break;
            } // End of if (this.getColor() == oChessPiece.getColor())

        } // End of for (var iMoveIndex = 0; iMoveIndex < valid_moves_list.length)

        return oReturn;

    } // End of ChessPiece.checkForEnemyKing()

    ////////////////////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves()                                     //
    // Function:                                                          //
    //     Returns an array of valid positions the current piece can move //
    // Return value:                                                      //
    //     Array[{x, y}]                                                  //
    ////////////////////////////////////////////////////////////////////////
    getValidMoves()
    {
        var valid_moves_list = [];
        switch (this.getType())
        {
            case GAME_CHESSPIECE__TYPE__PAWN  : { this.getValidMoves_Pawn  (valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__PAWN
            case GAME_CHESSPIECE__TYPE__ROOK  : { this.getValidMoves_Rook  (valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__ROOK
            case GAME_CHESSPIECE__TYPE__BISHOP: { this.getValidMoves_Bishop(valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__BISHOP
            case GAME_CHESSPIECE__TYPE__KNIGHT: { this.getValidMoves_Knight(valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__KNIGHT
            case GAME_CHESSPIECE__TYPE__QUEEN : { this.getValidMoves_Queen (valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__QUEEN
            case GAME_CHESSPIECE__TYPE__KING  : { this.getValidMoves_King  (valid_moves_list); break; } // End of case GAME_CHESSPIECE__TYPE__KING

            case GAME_CHESSPIECE__TYPE__EMPTY:
            default:
            {
                console.log("Invalid piece type: " + this.getType());
                break;
            } // End of default case

        } // End of switch (this.iChess_piece_type)

        this.checkForEnemyKing(valid_moves_list);

        this.valid_moves_list = valid_moves_list;

        return valid_moves_list;

    } // End of getValidMoves()

    //////////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_Pawn(valid_moves_list)      //
    // Function:                                                //
    //     Finds the valid positions a particular pawn can move //
    // Return value:                                            //
    //     None                                                 //
    //////////////////////////////////////////////////////////////
    getValidMoves_Pawn(valid_moves_list)
    {
        var chess_piece_front       = null;
        var chess_piece_front_left  = null; 
        var chess_piece_front_right = null;
        var chess_piece_front_front = null;

        if (GAME_CHESSPIECE__COLOR__BLACK == this.getColor())
        {
            // Black piece

            // Determine if the vertical change is within bounds
            if (this.oPosition.x + 1 < GAME_CHESSBOARD_WIDTH)
            {
                chess_piece_front = game_chessboard_instance.getPieceFromPosition(this.oPosition.x + 1, this.oPosition.y);

                // Determine if the left position is within bounds
                if (this.oPosition.y - 1 >= 0)
                {
                    chess_piece_front_left = game_chessboard_instance.getPieceFromPosition(this.oPosition.x + 1, this.oPosition.y - 1);
                }

                // Determine if the right position is within bounds
                if (this.oPosition.y + 1 < GAME_CHESSBOARD_WIDTH)
                {
                    chess_piece_front_right = game_chessboard_instance.getPieceFromPosition(this.oPosition.x + 1, this.oPosition.y + 1);
                }

                // Determine if the front front position is within bounds
                if (this.oPosition.x + 1 < GAME_CHESSBOARD_WIDTH && !this.bPiece_has_moved_once)
                {
                    chess_piece_front_front = game_chessboard_instance.getPieceFromPosition(this.oPosition.x + 2, this.oPosition.y);
                }

            } // End of if (this.oPosition.x + 1 < GAME_CHESSBOARD_WIDTH)

            if (chess_piece_front != null)
            {
                // Determine if the space in front of the pawn is empty
                if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front.getType())
                {
                    valid_moves_list.push({x: this.oPosition.x + 1, y: this.oPosition.y});

                    // We can only move in front front of the space is also empty
                    if (chess_piece_front_front != null)
                    {
                        // Determine if the space front right of the pawn is not empty, and is an enemy
                        if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front_front.getType()
                         && !this.bPiece_has_moved_once)
                        {
                            valid_moves_list.push({x: this.oPosition.x + 2, y: this.oPosition.y});
                        } // End of if (chess_piece_front_front != GAME_CHESSPIECE__TYPE__EMPTY)

                    } // End of if (chess_piece_front_front != null)

                } // End of if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front.getType())

            } // End of if (chess_piece_front != null)

            if (chess_piece_front_left != null)
            {
                // Determine if the space front left of the pawn is not empty, and is an enemy
                if (chess_piece_front_left.getType()  != GAME_CHESSPIECE__TYPE__EMPTY
                 && chess_piece_front_left.getColor() == GAME_CHESSPIECE__COLOR__WHITE)
                {
                    valid_moves_list.push({x: this.oPosition.x + 1, y: this.oPosition.y - 1});

                    // Also check if the enemy piece is a king
                    if (chess_piece_front_left.getType() == GAME_CHESSPIECE__TYPE__KING)
                    {
                        this.bHas_king_in_check = true;
                    }

                } // End of if (chess_piece_front_left != GAME_CHESSPIECE__TYPE__EMPTY)

            } // End of if (chess_piece_front_left != null)

            if (chess_piece_front_right != null)
            {
                // Determine if the space front right of the pawn is not empty, and is an enemy
                if (chess_piece_front_right.getType()  != GAME_CHESSPIECE__TYPE__EMPTY
                 && chess_piece_front_right.getColor() == GAME_CHESSPIECE__COLOR__WHITE)
                {
                    valid_moves_list.push({x: this.oPosition.x + 1, y: this.oPosition.y + 1});

                    // Also check if the enemy piece is a king
                    if (chess_piece_front_right.getType() == GAME_CHESSPIECE__TYPE__KING)
                    {
                        this.bHas_king_in_check = true;
                    }

                } // End of if (chess_piece_front_right != GAME_CHESSPIECE__TYPE__EMPTY)

            } // End of if (chess_piece_front_right != null)

        } // End of if (GAME_CHESSPIECE__COLOR__BLACK == this.getType())
        else
        {
            // White piece

            // Determine if the vertical change is within bounds
            if (this.oPosition.x - 1 >= 0)
            {
                chess_piece_front = game_chessboard_instance.getPieceFromPosition(this.oPosition.x - 1, this.oPosition.y);

                // Determine if the left position is within bounds
                if (this.oPosition.y - 1 >= 0)
                {
                    chess_piece_front_left = game_chessboard_instance.getPieceFromPosition(this.oPosition.x - 1, this.oPosition.y - 1);
                }

                // Determine if the right position is within bounds
                if (this.oPosition.y + 1 < GAME_CHESSBOARD_WIDTH)
                {
                    chess_piece_front_right = game_chessboard_instance.getPieceFromPosition(this.oPosition.x - 1, this.oPosition.y + 1);
                }

                // Determine if the front front position is within bounds
                if (this.oPosition.x - 1 >= 0 && !this.bPiece_has_moved_once)
                {
                    chess_piece_front_front = game_chessboard_instance.getPieceFromPosition(this.oPosition.x - 2, this.oPosition.y);
                }

            } // End of if (this.oPosition.x + 1 < GAME_CHESSBOARD_WIDTH)

            if (chess_piece_front != null)
            {
                // Determine if the space in front of the pawn is empty
                if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front.getType())
                {
                    valid_moves_list.push({x: this.oPosition.x - 1, y: this.oPosition.y});

                    if (chess_piece_front_front != null)
                    {
                        // Determine if the space in front front of the pawn is not empty, and is an enemy
                        if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front_front.getType()
                         && !this.bPiece_has_moved_once)
                        {
                            valid_moves_list.push({x: this.oPosition.x - 2, y: this.oPosition.y});
                        } // End of if (chess_piece_front_front != GAME_CHESSPIECE__TYPE__EMPTY)

                    } // End of if (chess_piece_front_front != null)

                } // End of if (GAME_CHESSPIECE__TYPE__EMPTY == chess_piece_front.getType())

            } // End of if (chess_piece_front != null)

            if (chess_piece_front_left != null)
            {
                // Determine if the space front left of the pawn is not empty, and is an enemy
                if (chess_piece_front_left.getType()  != GAME_CHESSPIECE__TYPE__EMPTY
                 && chess_piece_front_left.getColor() == GAME_CHESSPIECE__COLOR__BLACK)
                {
                    valid_moves_list.push({x: this.oPosition.x - 1, y: this.oPosition.y - 1});

                    // Also check if the enemy piece is a king
                    if (chess_piece_front_left.getType() == GAME_CHESSPIECE__TYPE__KING)
                    {
                        this.bHas_king_in_check = true;
                    }

                } // End of if (chess_piece_front_left != GAME_CHESSPIECE__TYPE__EMPTY)

            } // End of if (chess_piece_front_left != null)

            if (chess_piece_front_right != null)
            {
                // Determine if the space front right of the pawn is not empty, and is an enemy
                if (chess_piece_front_right.getType()  != GAME_CHESSPIECE__TYPE__EMPTY
                 && chess_piece_front_right.getColor() == GAME_CHESSPIECE__COLOR__BLACK)
                {
                    valid_moves_list.push({x: this.oPosition.x - 1, y: this.oPosition.y + 1});

                    // Also check if the enemy piece is a king
                    if (chess_piece_front_right.getType() == GAME_CHESSPIECE__TYPE__KING)
                    {
                        this.bHas_king_in_check = true;
                    }

                } // End of if (chess_piece_front_right != GAME_CHESSPIECE__TYPE__EMPTY)

            } // End of if (chess_piece_front_right != null)

        } // End of else (of if (GAME_CHESSPIECE__COLOR__BLACK == this.getType()))

        return;

    } // End of getValidMoves_Pawn(valid_moves_list)

    ////////////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_Rook(valid_moves_list)        //
    // Function:                                                  //
    //     Finds all the valid moves the particular rook can make //
    // Return value:                                              //
    //     None                                                   //
    ////////////////////////////////////////////////////////////////
    getValidMoves_Rook(valid_moves_list)
    {
        // 1. Check all positions above the rook
        // 2. Check all positions below the rook
        // 3. Check all positions left of the rook
        // 4. Check all positions right of the rook

        this.addSpaceIfValid_Multiple(valid_moves_list, -1,  0);
        this.addSpaceIfValid_Multiple(valid_moves_list,  1,  0);
        this.addSpaceIfValid_Multiple(valid_moves_list,  0, -1);
        this.addSpaceIfValid_Multiple(valid_moves_list,  0,  1);

        return;

    } // End of getValidPositions_Rook(valid_moves_list)

    ////////////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_Bishop(valid_moves_list)      //
    // Function:                                                  //
    //     Finds the valid positions a particular bishop can move //
    //                      \            /                        //
    //                       \          /                         //
    //   Left Upper Diagonal  \        /  Right Upper Diagonal    //
    //                         \      /                           //
    //                          Bishop                            //
    //                         /      \                           //
    //                        /        \                          //
    //  Left Lower Diagonal  /          \   Right Lower Diagonal  //
    //                      /            \                        //
    //                                                            //
    // Return value:                                              //
    //     None                                                   //
    ////////////////////////////////////////////////////////////////
    getValidMoves_Bishop(valid_moves_list)
    {
        // x: positive 1 is down
        //    negative 1 is up
        // y: positive 1 is right
        //    negative 1 is left

        this.addSpaceIfValid_Multiple(valid_moves_list, -1, -1); // Left  Upper Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list, -1,  1); // Right Upper Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list,  1, -1); // Left  Lower Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list,  1,  1); // Right Lower Diagonal

        return;

    } // End of getValidMoves_Bishop(valid_moves_list)

    ///////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_Knight(valid_moves_list) //
    // Function:                                             //
    //     Determines the valid moves a knight can make      //
    // Return value:                                         //
    //     None                                              //
    ///////////////////////////////////////////////////////////
    getValidMoves_Knight(valid_moves_list)
    {
        // 8 moves a knight can make
        // 2 pairs of 4 different combinations
        //  # 2 # 3 #
        //  1 # # # 4
        //  # # H # #
        //  5 # # # 8
        //  # 6 # 7 #
        this.addSpaceIfValid_Single(valid_moves_list, -1, -2); // 1 up   2 left
        this.addSpaceIfValid_Single(valid_moves_list, -2, -1); // 2 up   1 left
        this.addSpaceIfValid_Single(valid_moves_list, -2,  1); // 2 up   1 right
        this.addSpaceIfValid_Single(valid_moves_list, -1,  2); // 1 up   2 right
        this.addSpaceIfValid_Single(valid_moves_list,  1, -2); // 1 down 2 left
        this.addSpaceIfValid_Single(valid_moves_list,  2, -1); // 2 down 1 left
        this.addSpaceIfValid_Single(valid_moves_list,  2,  1); // 2 down 1 right
        this.addSpaceIfValid_Single(valid_moves_list,  1,  2); // 1 down 2 right

    } // End of getValidMoves_Knights(valid_moves_list)

    //////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_Queen(valid_moves_list) //
    // Function:                                            //
    //     Collects an array of positions a queen can move  //
    // Return value:                                        //
    //     None                                             //
    //////////////////////////////////////////////////////////
    getValidMoves_Queen(valid_moves_list)
    {
        // Queen moves like a rook in all directions
        this.addSpaceIfValid_Multiple(valid_moves_list,  0, -1); // 1. Left
        this.addSpaceIfValid_Multiple(valid_moves_list, -1, -1); // 2. Left Up Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list, -1,  0); // 3. Up
        this.addSpaceIfValid_Multiple(valid_moves_list, -1,  1); // 4. Right Up Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list,  0,  1); // 5. Right
        this.addSpaceIfValid_Multiple(valid_moves_list,  1,  1); // 6. Right Down Diagonal
        this.addSpaceIfValid_Multiple(valid_moves_list,  1,  0); // 7. Down
        this.addSpaceIfValid_Multiple(valid_moves_list,  1, -1); // 8. Left Down Diagonal

    } // End of getValidMoves_Queen(valid_moves_list

    /////////////////////////////////////////////////////////
    //     ChessPiece.getValidMoves_King(valid_moves_list) //
    // Function:                                           //
    //     Collects valid moves a king can make            //
    // Return value:                                       //
    //     None                                            //
    /////////////////////////////////////////////////////////
    getValidMoves_King(valid_moves_list)
    {
        // King can move in all directions
        this.addSpaceIfValid_Single(valid_moves_list,  0, -1); // Left
        this.addSpaceIfValid_Single(valid_moves_list, -1, -1); // Left Up
        this.addSpaceIfValid_Single(valid_moves_list, -1,  0); // Up
        this.addSpaceIfValid_Single(valid_moves_list, -1,  1); // Right Up
        this.addSpaceIfValid_Single(valid_moves_list,  0,  1); // Right
        this.addSpaceIfValid_Single(valid_moves_list,  1,  1); // Right Down
        this.addSpaceIfValid_Single(valid_moves_list,  1,  0); // Down
        this.addSpaceIfValid_Single(valid_moves_list,  1, -1); // Left Down

    } // End of getValidMoves_King(valid_moves_list)

    //////////////////////////////////////////////////////////////
    // ChessPiece.getSafeMoves                                  //
    // Function:                                                //
    //      Returns a list of all safe moves a piece can make   //
    //      without the chance of being taken the next turn     //
    // Parameters:                                              //
    //      None                                                //
    // Return value:                                            //
    //      Array<{x,y}>                                        //
    //////////////////////////////////////////////////////////////
    getSafeMoves()
    {
        var safe_moves_list = []    ; // [Array<{x,y}>  ] Array of safe moves the
        var bSafe_move_flag = true  ; // [Boolean       ] Flag that signals if the current move is not safe

        // Null checking
        if (null == game_chessboard_instance) { throw "Error: Chessboard instance is null"                  ; }
        if (null == this.valid_moves_list   ) { throw "Error: Valid moves list is null, rather than empty"  ; }
        
        var enemy_pieces_list = null;
        
        // Determine what team this piece is on then get the pieces of the enemy team
        if (this.getColor() == GAME_CHESSPIECE__COLOR__BLACK) { enemy_pieces_list = game_chessboard_instance.getWhitePieces(); }
        else                                                  { enemy_pieces_list = game_chessboard_instance.getBlackPieces(); }

        for (var iMoveIndex = 0; iMoveIndex < this.valid_moves_list.length; iMoveIndex++)
        {
            var oMovePosition = this.valid_moves_list[iMoveIndex];

            for (var iEnemyPieceIndex = 0; iEnemyPieceIndex < enemy_pieces_list.length; iEnemyPieceIndex++)
            {
                var oEnemyPiece = enemy_pieces_list[iEnemyPieceIndex];

                for (var iEnemyMoveIndex = 0; iEnemyMoveIndex < oEnemyPiece.valid_moves_list.length; iEnemyMoveIndex++)
                {
                    var oEnemyMovePosition = oEnemyPiece.valid_moves_list[iEnemyMoveIndex];

                    // Determine if the current piece and the enemy want to move to the same location
                    if (game_vectorsEqual2D(oMovePosition, oEnemyMovePosition))
                    {
                        // This move is not safe, set the safe move flag to false
                        bSafe_move_flag = false;

                        // No need to consider any other enemy's moves for this piece's position since we already know it's not safe
                        break;
                    } // End of if (game_vectorsEqual2D(oMovePosition, oEnemyMovePosition))

                } // End of for (var iEnemyMoveIndex = 0; iEnemyMoveIndex < oEnemyPiece.valid_moves_list.length; iEnemyMoveIndex++)

                // Determine if we've found that this current location in our valid move list is not safe
                if (!bSafe_move_flag)
                {
                    break;
                }

            } // End of for (var iEnemyPieceIndex = 0; iEnemyPieceIndex < enemy_pieces_list.length; iEnemyPieceIndex++)

            // If we've made it this far, and the safe move flag is true, then it must be a safe position
            if (bSafe_move_flag)
            {
                safe_moves_list.push(this.valid_moves_list[iMoveIndex]);
            }

        } // End of for (var iMoveIndex = 0; iMoveIndex < this.valid_moves_list.length; iMoveIndex++)

        return safe_moves_list;

    } // End of ChessPiece.getSafeMoves()

    /////////////////////////////////////////////////////////////
    //     ChessPiece.addSpaceIfValid_Single(valid_moves_list) //
    // Function:                                               //
    //     Checks 8 spaces if the space is valid               //
    // Return value:                                           //
    //     None                                                //
    /////////////////////////////////////////////////////////////
    addSpaceIfValid_Single(valid_moves_list, x_gradient, y_gradient)
    {
        var oPosition = this.getPositionCopy();

        // Reset this flag in case the king is out of this piece's reach from a previous move
        this.bHas_king_in_check = false;

        oPosition.x += x_gradient;
        oPosition.y += y_gradient;

        // Determine if the move is within the board
        if (game_chessboard_instance.coordinatesValid(oPosition.x, oPosition.y))
        {
            var oPiece = game_chessboard_instance.getPieceFromPosition(oPosition.x, oPosition.y);

            // Determine if there's an enemy piece at this space, or if the space is empty
            if (    !this.isSameTeam(oPiece)
                 || oPiece.isEmpty()    )
            {
                valid_moves_list.push(oPiece.getPositionCopy());

                // Also check if the enemy piece is a king
                if (oPiece.getType() == GAME_CHESSPIECE__TYPE__KING)
                {
                    this.bHas_king_in_check = true;
                }
            }
        }

        return;

    } // End of addSpaceIfValid_Single(valid_moves_list, x_gradient, y_gradient)

    ///////////////////////////////////////////////////////////////
    //     ChessPiece.addSpaceIfValid_Multiple(valid_moves_list) //
    // Function:                                                 //
    //     Collects an array of positions a queen can move       //
    // Return value:                                             //
    //     None                                                  //
    ///////////////////////////////////////////////////////////////
    addSpaceIfValid_Multiple(valid_moves_list, x_gradient, y_gradient)
    {
        var oPosition = this.getPositionCopy();

        // Reset this flag in case the king is out of this piece's reach from a previous move
        this.bHas_king_in_check = false;

        oPosition.x += x_gradient;
        oPosition.y += y_gradient;

        while(game_chessboard_instance.coordinatesValid(oPosition.x, oPosition.y))
        {
            var oPiece = game_chessboard_instance.getPieceFromPosition(oPosition.x, oPosition.y);

            // Determine if this is an empty space
            if (oPiece.isEmpty())
            {
                // Empty space
                valid_moves_list.push(oPiece.getPositionCopy());
            } // End of if (oPiece.isEmpty())
            else
            {
                // This space is NOT empty

                // Determine if it is an enemy piece
                if (!this.isSameTeam(oPiece))
                {
                    // Enemy piece
                    valid_moves_list.push(oPiece.getPositionCopy());

                    // Also check if the enemy piece is a king
                    if (oPiece.getType() == GAME_CHESSPIECE__TYPE__KING)
                    {
                        this.bHas_king_in_check = true;
                    }
                }

                break;
            } // End of else (of if (oPiece.isEmpty()))

            oPosition.x += x_gradient;
            oPosition.y += y_gradient;

        } // End of while(game_chessboard_instance.coordinatesValid(oPosition.x, oPosition.y))

    } // End of addSpaceIfValid_Multiple(valid_moves_list)

    //////////////////////////////////////////////
    //     ChessPiece.createDeepCopy()          //
    // Function:                                //
    //     Creates a deep copy of a chess piece //
    // Return value:                            //
    //     ChessPiece                           //
    //////////////////////////////////////////////
    createDeepCopy()
    {
        return ChessPiece(this.iType, this.iColor, game_copyVector2D(this.iPosition))
    } // End of createDeepCopy()

    ///////////////////////////////////////////////////////////
    //     ChessPiece.clearSpace()                           //
    // Function:                                             //
    //     Sets the space empty, useful for capturing pieces //
    // Return value:                                         //
    //     None                                              //
    ///////////////////////////////////////////////////////////
    clearSpace()
    {
        this.setProperties(GAME_CHESSPIECE__TYPE__EMPTY, GAME_CHESSPIECE__COLOR__NONE);
    } // End of clearSpace()

    //////////////////////////////////////////////////////////////
    //     ChessPiece.toString()                                //
    // Function:                                                //
    //     Returns the properties of this object in string form //
    // Return value:                                            //
    //     String                                               //
    //////////////////////////////////////////////////////////////
    toString()
    {
        return GAME_CHESSPIECE__COLOR__STRING_LIST[this.getColor()] + " " +
               GAME_CHESSPIECE__TYPE__STRING_LIST [this.getType()]   + 
               " x: " + this.getPosition().x + ", y: " + this.getPosition().y;
    } // End of toString()

} // End of class ChessPiece