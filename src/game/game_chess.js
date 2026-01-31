//////////////////////////////////////////////////////
// game_chess.js                                    //
// Keeps track of how the chess game is progressing //
//////////////////////////////////////////////////////
"use strict";

const GAME_CHESS__TURN__WHITE                = 0; // White's turn to move, encompasses TURN_WHITE and TURN_WHITE_IN_CHECK
const GAME_CHESS__TURN__BLACK                = 1; // Black's turn to move, encompasses TURN_BLACK and TURN_BLACK_IN_CHECK

const GAME_CHESS__STATE__INITIALIZE          = 0; // Board will be initialized and progress to white's turn
const GAME_CHESS__STATE__TURN_WHITE          = 1; // White's turn to make a move, don't use this to tell if it is this players' turn, use GAME_CHESS__TURN__WHITE
const GAME_CHESS__STATE__TURN_BLACK          = 2; // Black's turn to make a move, don't use this to tell if it is this players' turn, use GAME_CHESS__TURN__WHITE
const GAME_CHESS__STATE__TURN_WHITE_IN_CHECK = 3; // White is in danger of losing
const GAME_CHESS__STATE__TURN_BLACK_IN_CHECK = 4; // Black is in danger of losing
const GAME_CHESS__STATE__CHECK_MATE_BLACK    = 5; // Black loses
const GAME_CHESS__STATE__CHECK_MATE_WHITE    = 6; // White loses

class Chess
{
    constructor()
    {
        this.iState        = GAME_CHESS__STATE__INITIALIZE; // [Number] Current state of the game
        this.iStatePrevious= GAME_CHESS__STATE__INITIALIZE; // [Number] Previous state of the game
        this.iTurn         = GAME_CHESS__TURN__WHITE      ; // [Number] Enumerator, tracks whose turn it is
        this.bGame_over    = false                        ; // [Boolean] Determines if the game is finished (can also use iState)
        this.oPlayer_White = null                         ; // [Player Object] Player controlling white
        this.oPlayer_Black = null                         ; // [Player Object] Player controlling black
    }

    ///////////////////////////////
    //     Chess.setPlayerWhite  //
    // Function:                 //
    //     Sets the white player //
    // Return value:             //
    //     None                  //
    ///////////////////////////////
    setPlayerWhite(oPlayer)
    {
        this.oPlayer_White = oPlayer;
    } // End of setPlayerWhite()

    ///////////////////////////////
    //     Chess.setPlayerBlack  //
    // Function:                 //
    //     Sets the black player //
    // Return value:             //
    //     None                  //
    ///////////////////////////////
    setPlayerBlack(oPlayer)
    {
        this.oPlayer_Black = oPlayer;
    } // End of setPlayerBlack()

    ////////////////////////////////////////
    //     Chess.stateRun                 //
    // Function:                          //
    //     Main state transition function //
    // Return value:                      //
    //     None                           //
    ////////////////////////////////////////
    stateRun()
    {
        switch (this.iState)
        {
            case GAME_CHESS__STATE__INITIALIZE:{this.stateInitialize(); break;} // End of case GAME_CHESS__STATE__INITIALIZE
            case GAME_CHESS__STATE__TURN_WHITE:{this.stateWhiteTurn() ; break;} // End of case GAME_CHESS__STATE__TURN_WHITE
            case GAME_CHESS__STATE__TURN_BLACK:{this.stateBlackTurn() ; break;} // End of case GAME_CHESS__STATE__TURN_BLACK
            default:
            {
                console.log("Invalid case: " + this.iState);
                this.stateInitialize();

                break;
            }
        } // End of switch (this.iState)

        // Determine if this player is a computer
        if (this.oPlayer_White.isComputerPlayer())
        {
            this.oPlayer_White.runCPU();
        }

        // Determine if this player is a computer
        if (this.oPlayer_Black.isComputerPlayer())
        {
            this.oPlayer_Black.runCPU();
        }

        if (this.iState != this.iStatePrevious)
        {
            html_label_setPlayerTurn(this.iState);
        }

    } // End of stateRun()

    //////////////////////////////////////////
    //     Chess.stateInitialize            //
    // Function:                            //
    //     Initializes the chess game state //
    // Return value:                        //
    //     None                             //
    //////////////////////////////////////////
    stateInitialize()
    {
        if (GAME_CHESSBOARD__STATUS__READY != game_chessboard_instance.iState)
        {
            chess_board_instance.setupBoard();
            console.log("Chess board setup state");
        }
        else
        {
            this.stateWhiteTurn__Entry();
        }
    } // End of stateInitialize()

    ///////////////////////////////////////////////////////////////////////////////////////
    //     Chess.stateWhiteTurn                                                          //
    // Function:                                                                         //
    //     State for white's turn, waits until white moves to transition to black's turn //
    // Return value:                                                                     //
    //     None                                                                          //
    ///////////////////////////////////////////////////////////////////////////////////////
    stateWhiteTurn()
    {
        if (this.oPlayer_White.hasMoved())
        {
            switch(this.whichKingInCheck())
            {
                case GAME_CHESSPIECE__COLOR__NONE : { /* No king is in check */        break; }
                case GAME_CHESSPIECE__COLOR__BLACK: { this.stateBlackInCheck__Entry(); break; }
                case GAME_CHESSPIECE__COLOR__WHITE: { this.stateWhiteInCheck__Entry(); break; }

                default:
                {
                    console.log("Invalid king in check");
                    break;
                }
            }

            this.stateBlackTurn__Entry();
        } // End of if (this.oPlayer_White.hasMoved())

    } // End of stateWhiteTurn()

    ///////////////////////////////////////////////////////////////////////////////////////
    //     Chess.stateBlackTurn                                                          //
    // Function:                                                                         //
    //     State for black's turn, waits until black moves to transition to white's turn //
    // Return value:                                                                     //
    //     None                                                                          //
    ///////////////////////////////////////////////////////////////////////////////////////
    stateBlackTurn()
    {
        if (this.oPlayer_Black.hasMoved())
        {
            switch(this.whichKingInCheck())
            {
                case GAME_CHESSPIECE__COLOR__NONE : { /* No king is in check */        break; }
                case GAME_CHESSPIECE__COLOR__BLACK: { this.stateBlackInCheck__Entry(); break; }
                case GAME_CHESSPIECE__COLOR__WHITE: { this.stateWhiteInCheck__Entry(); break; }

                default:
                {
                    console.log("Invalid king in check");
                    break;
                }
            }

            this.stateWhiteTurn__Entry();
        } // End of if (this.oPlayer_Black.hasMoved())

    } // End of stateBlackTurn()

    /////////////////////////////////////////
    // Chess.stateBlackKingInCheck()       //
    // Function:                           //
    //     State for a Black King in Check //
    // Return value:                       //
    //     None                            //
    /////////////////////////////////////////
    stateBlackKingInCheck()
    {
        if (this.oPlayer_Black.hasMoved())
        {
            switch(this.whichKingInCheck())
            {
                case GAME_CHESSPIECE__COLOR__NONE : { /* No king is in check */        break; }
                case GAME_CHESSPIECE__COLOR__BLACK: { this.stateBlackInCheck__Entry(); break; }
                case GAME_CHESSPIECE__COLOR__WHITE: { this.stateWhiteInCheck__Entry(); break; }

                default:
                {
                    console.log("Invalid king in check");
                    break;
                }
            }

        } // End of if (this.oPlayer_Black.hasMoved())

    } // End of Chess.stateBlackKingInCheck()

    /////////////////////////////////////////
    // Chess.stateWhiteKingInCheck()       //
    // Function:                           //
    //     State for a White King in Check //
    // Return value:                       //
    //     None                            //
    /////////////////////////////////////////
    stateWhiteKingInCheck()
    {
        if (this.oPlayer_White.hasMoved())
        {
            switch(this.whichKingInCheck())
            {
                case GAME_CHESSPIECE__COLOR__NONE : { /* No king is in check */        break; }
                case GAME_CHESSPIECE__COLOR__BLACK: { this.stateBlackInCheck__Entry(); break; }
                case GAME_CHESSPIECE__COLOR__WHITE: { this.stateWhiteInCheck__Entry(); break; }

                default:
                {
                    console.log("Invalid king in check");
                    break;
                }
            }

        } // End of if (this.oPlayer_White.hasMoved())

    } // End of stateWhiteKingInCheck()

    stateWhiteTurn__Entry()
    {
        this.iState = GAME_CHESS__STATE__TURN_WHITE;
        this.iTurn  = GAME_CHESS__TURN__WHITE;
        this.resetPlayerMoveStates();

        console.log("Transitioning to the Turn White state");
    }

    stateBlackTurn__Entry()
    {
        this.iState = GAME_CHESS__STATE__TURN_BLACK;
        this.iTurn  = GAME_CHESS__TURN__BLACK;
        this.resetPlayerMoveStates();

        console.log("Transitioning to the Turn Black state");
    }

    stateBlackInCheck__Entry()
    {
        this.iState = GAME_CHESS__STATE__BLACK_IN_CHECK;
        this.iTurn = GAME_CHESS__TURN__BLACK;
        this.resetPlayerMoveStates();

        console.log("Transitioning to the Black In Check State");
    }

    stateWhiteInCheck__Entry()
    {
        this.iState = GAME_CHESS__STATE__WHITE_IN_CHECK;
        this.iTurn = GAME_CHESS__TURN__WHITE;
        this.resetPlayerMoveStates();

        console.log("Transitioning to the White In Check State");
    }

    resetPlayerMoveStates()
    {
        this.oPlayer_White.bMoved = false;
        this.oPlayer_Black.bMoved = false;
    }

    ////////////////////////////////////
    //     Chess.getCurrentPlayerTurn //
    // Function:                      //
    //     Gets current player's turn //
    // Return value:                  //
    //     Number                     //
    ////////////////////////////////////
    getCurrentPlayerTurn()
    {
        return this.iTurn;
    } // End of getCurrentPlayerTurn()

    //////////////////////////////////////////////////////////////////////
    // Chess.isHumanTurn                                                //
    // Function:                                                        //
    //     Returns true if a the current turn belongs to a human player //
    // Return value:                                                    //
    //     Boolean                                                      //
    //////////////////////////////////////////////////////////////////////
    isHumanTurn()
    {
        var bReturn = false;

        switch (this.iState)
        {
            case GAME_CHESS__STATE__TURN_WHITE: { bReturn = this.oPlayer_White.isHuman(); break; } // End of case GAME_CHESS__STATE__TURN_WHITE
            case GAME_CHESS__STATE__TURN_BLACK: { bReturn = this.oPlayer_Black.isHuman(); break; } // End of case GAME_CHESS__STATE__TURN_BLACK
            case GAME_CHESS__STATE__INITIALIZE:
            default:
            {
                bReturn = false;
                break;
            }
        } // End of switch (this.iState)

        return bReturn;
    } // End of Chess.isHumanTurn()

    //////////////////////////////////////////////////////////////////////////////
    // Chess.humanMove                                                          //
    // Function:                                                                //
    //     Function for a human to interface with the player class using the UI //
    // Return value:                                                            //
    //     None                                                                 //
    //////////////////////////////////////////////////////////////////////////////
    humanMove()
    {
        switch (this.getCurrentPlayerTurn())
        {
            case GAME_CHESS__TURN__WHITE:
            {
                if (GAME_PLAYER__TYPE__HUMAN == this.oPlayer_White.getType())
                {
                    this.oPlayer_White.makeMove();
                }

                break;
            }
            case GAME_CHESS__TURN__BLACK:
            {
                if (GAME_PLAYER__TYPE__HUMAN == this.oPlayer_Black.getType())
                {
                    this.oPlayer_Black.makeMove();
                }
                break;
            }
            default:
            {
                break;
            }
        } // End of switch (current_player_turn)

    } // End of humanMove()

    /////////////////////////////////////////////////////////////////////////
    // Chess.isKingInCheck                                                 //
    // Function:                                                           //
    //     Checks if either king is in check and transitions to that state //
    // Return value:                                                       //
    //     Number (color of the king that's in check)                      //
    /////////////////////////////////////////////////////////////////////////
    whichKingInCheck()
    {
        var iReturn = GAME_CHESSPIECE__COLOR__NONE;

        var bKing_in_check = false;
        var oPlayer_White_chess_pieces_list = this.oPlayer_White.getCurrentPieces();
        var oPlayer_Black_chess_pieces_list = this.oPlayer_Black.getCurrentPieces();

        // No particular order to whose king should be checked first

        // Determining if the black king is in check
        for(var iChessPieceIndex = 0; iChessPieceIndex < oPlayer_White_chess_pieces_list; iChessPieceIndex++)
        {
            var chess_piece = oPlayer_White_chess_pieces_list[iChessPieceIndex];

            if (chess_piece.hasKingInCheck())
            {
                iReturn = GAME_CHESSPIECE__COLOR__BLACK;

                // Time to break out of the function
                bKing_in_check = true;

                break;
            }
        }

        // Determine if there is already a king in check before looking at the white king
        if (!bKing_in_check)
        {
            // Determine if white king is in check
            for(var iChessPieceIndex = 0; iChessPieceIndex < oPlayer_Black_chess_pieces_list; iChessPieceIndex++)
            {
                var chess_piece = oPlayer_Black_chess_pieces_list[iChessPieceIndex];

                if (chess_piece.hasKingInCheck())
                {
                    iReturn = GAME_CHESSPIECE__COLOR__WHITE;

                    // Time to break out of the function
                    bKing_in_check = true;

                    break;
                }
            } // End of for(var iChessPieceIndex = 0; iChessPieceIndex < oPlayer_White_chess_pieces_list; iChessPieceIndex++)

        } // End of if (!bReturn)

        return iReturn;
    } // End of Chess.isKingInCheck()

} // End of class Chess