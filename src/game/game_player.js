////////////////////
// game_player.js //
// Chess player   //
////////////////////
"use strict";

// Player types
const GAME_PLAYER__TYPE__HUMAN    = 0;
const GAME_PLAYER__TYPE__COMPUTER = 1;

// Player colors
const GAME_PLAYER__COLOR__NONE    = 0;
const GAME_PLAYER__COLOR__BLACK   = 1;
const GAME_PLAYER__COLOR__WHITE   = 2;

class Player
{
    constructor(iColor, iType)
    {
        this.iColor       = iColor; // [Integer] Color representing what team this player is on
        this.bMoved       = false;  // [Boolean] Determines if this player has made a move
        this.iType        = iType;  // [Integer] Type representing the type of player controlling this object (see GAME_PLAYER__TYPE)
        this.oCPU         = null;   // [ChessCPU object] Object controlling the player
        if (GAME_PLAYER__TYPE__COMPUTER == iType)
        {
            this.oCPU = new ChessCPU(this);
        }
    }

    ////////////////////////////////////////////
    //     Player.move                        //
    // Function:                              //
    //     Intended for computer players      //
    //     Human players will just use the UI //
    // Return value:                          //
    //     None                               //
    ////////////////////////////////////////////
    move(oPiece, oLocation)
    {
        this.bMoved = true;

        var piece_destination = game_chessboard_instance.getPieceFromPosition(oLocation.x, oLocation.y);
        
        switch (this.getColor())
        {
            case GAME_PLAYER__COLOR__BLACK:
            {
                game_chess_instance.bBlack_moved = true;
                
                switch (piece_destination.getColor())
                {
                    case GAME_CHESSPIECE__COLOR__BLACK:
                    {
                        // This piece is on the same team as me, do nothing
                        // unless the piece is castling
                        
                        break;
                    }
                        
                    case GAME_CHESSPIECE__COLOR__WHITE:
                    {
                        // This is an enemy piece, capture it
                        game_chessboard_instance.capturePiece(oPiece, piece_destination);
                        break;
                    }
                        
                    case GAME_CHESSPIECE__COLOR__NONE:
                    {
                        // This is an empty space, swap places
                        game_chessboard_instance.swapPieces(oPiece, piece_destination);
                        break;
                    }
                    default:
                    {
                        break;
                    }
                } // End of switch (oPiece.getColor())
                
                break;
            } // End of case GAME_PLAYER__COLOR__BLACK
                
            case GAME_PLAYER__COLOR__WHITE:
            {
                game_chess_instance.bWhite_moved = true;

                switch (piece_destination.getColor())
                {
                    case GAME_CHESSPIECE__COLOR__BLACK:
                    {
                        // This is an enemy piece, capture it
                        game_chessboard_instance.capturePiece(oPiece, piece_destination);
                        break;
                    }
                        
                    case GAME_CHESSPIECE__COLOR__WHITE:
                    {
                        // This piece is on the same team as me, do nothing
                        // unless the piece is castling
                        break;
                    }
                        
                    case GAME_CHESSPIECE__COLOR__NONE:
                    {
                        // This is an empty space, swap places
                        game_chessboard_instance.swapPieces(oPiece, piece_destination);
                        break;
                    }
                    default:
                    {
                        break;
                    }
                } // End of switch (oPiece.getColor())
                
                break;
            } // End of case GAME_PLAYER__COLOR__WHITE

            case GAME_PLAYER__COLOR__NONE:
            default:
            {
                console.log("Player has invalid color 'NONE'");
                break;
            }
        } // End of switch (this.iColor)
        
    } // End of move(oPiece, oLocation)

    ////////////////////////////////////////////////
    // Player.getColor                            //
    // Function:                                  //
    //     Returns what color the player is using //
    // Return value:                              //
    //     Number (See GAME_CHESSPIECE__COLOR)    //
    ////////////////////////////////////////////////
    getColor()
    {
        return this.iColor;
    }

    ////////////////////////////////////
    // Player.getType                 //
    // Function:                      //
    //     Returns the iType variable //
    // Return value:                  //
    //     Number                     //
    ////////////////////////////////////
    getType()
    {
        return this.iType;
    }

    /////////////////////////////////////
    // Player.hasMoved                 //
    // Function:                       //
    //     Returns the bMoved variable //
    // Return value:                   //
    //     Boolean                     //
    /////////////////////////////////////
    hasMoved()
    {
        return this.bMoved;
    }

    //////////////////////////////////////////
    // Player.makeMove                      //
    // Function:                            //
    //     Sets the bMoved variable to true //
    // Return value:                        //
    //     Boolean                          //
    //////////////////////////////////////////
    makeMove()
    {
        this.bMoved = true;
    }
        
    /////////////////////////////////////////
    // Player.setComputerObject            //
    // Function:                           //
    //     Sets the computer player object //
    // Return value:                       //
    //     None                            //
    /////////////////////////////////////////
    setComputerObject(oCPU)
    {
        this.oCPU = oCPU;
    }

    ////////////////////////////////////////////////
    // Player.isHuman                             //
    // Function:                                  //
    //     Determines if the player type is human //
    // Return value:                              //
    //     Boolean                                //
    ////////////////////////////////////////////////
    isHuman()
    {
        return this.iType == GAME_PLAYER__TYPE__HUMAN;
    }
    
    ///////////////////////////////////////////////////////
    // Player.getCurrentPieces()                         //
    // Function:                                         //
    //     Returns all the living pieces this player has //
    // Return value:                                     //
    //     Array                                         //
    ///////////////////////////////////////////////////////
    getCurrentPieces()
    {
        var oReturn = null;
        
        switch (this.getColor())
        {
            case GAME_CHESSPIECE__COLOR__BLACK:
            {
                oReturn = game_chessboard_instance.getBlackPieces();
                break;
            }
                
            case GAME_CHESSPIECE__COLOR__WHITE:
            {
                oReturn = game_chessboard_instance.getWhitePieces();
                break;
            }
                
            case GAME_CHESSPIECE__COLOR__NONE:
            default:
            {
                console.log("Invalid piece color");
                break;
            }
            
        } // End of switch (this.getColor())

        return oReturn;
    } // End of Player.getCurrentPieces()

    //////////////////////////////////////////////////////////////////////////////
    // Player.getValidMoves()                                                   //
    // Function:                                                                //
    //     Finds all the valid moves the pieces, that this player has, can make //
    // Return value:                                                            //
    //     Array<{ ChessPiece, Array<x,y> }>                                    //
    //////////////////////////////////////////////////////////////////////////////
    getValidMoves()
    {
        var current_piece_list = this.getCurrentPieces();
        var valid_move_list = [];
        
        if (current_piece_list != null)
        {
            for (var iPieceIndex = 0; iPieceIndex < current_piece_list.length; iPieceIndex++)
            {
                valid_move_list.push
                (
                    {
                        piece: current_piece_list[iPieceIndex],
                        moves: current_piece_list[iPieceIndex].getValidMoves()
                    }
                );
            }
        }

        return valid_move_list;
    } // End of Player.getValidMoves()

    ////////////////////////////////////
    // Player.runCPU()                //
    // Function:                      //
    //     Runs the CPU state machine //
    // Return value:                  //
    //     None                       //
    ////////////////////////////////////
    runCPU()
    {
        this.oCPU.run();
    } // End of Player.runCPU()
    
    ////////////////////////////////////////////////////////////////////////////
    // Player.isComputerPlayer()                                              //
    // Function:                                                              //
    //     Returns the comparison of the player type and computer enumeration //
    // Return value:                                                          //
    //     Number                                                             //
    ////////////////////////////////////////////////////////////////////////////
    isComputerPlayer()
    {
        return this.iType == GAME_PLAYER__TYPE__COMPUTER;
    } // End of Player.isComputerPlayer()

    ////////////////////////////////////////////////////////////
    // Player.getKing                                         //
    // Function:                                              //
    //     Gets the King chess piece belonging to this player //
    // Return value                                           //
    //     ChessPiece                                         //
    ////////////////////////////////////////////////////////////
    getKing()
    {
        return game_chessboard_instance.getPieceByTypeAndColor(GAME_CHESSPIECE__TYPE__KING, this.getColor());
    } // End of Player.getKing

    ////////////////////////////////////////////////////////////////
    // Player.getTeamString()                                     //
    // Function:                                                  //
    //     Returns the team the player is on but in string format //
    // Return value:                                              //
    //     String                                                 //
    ////////////////////////////////////////////////////////////////
    getTeamString()
    {
        var strReturn = null;
        
        switch (this.getColor())
        {
            case GAME_CHESSPIECE__COLOR__BLACK: { strReturn = "Black"; break; }
            case GAME_CHESSPIECE__COLOR__WHITE: { strReturn = "White"; break; }
            case GAME_CHESSPIECE__COLOR__NONE:
            default:
            {
                strReturn = "ERROR";
                break;
            }
            
        } // End of switch (this.getColor())

        return strReturn;
        
    } // End of Player.getTeamString()
    
} // End of class Player