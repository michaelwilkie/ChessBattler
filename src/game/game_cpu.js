//////////////////////
// game_cpu.js      //
// CPU Player class //
//////////////////////
"use strict";

// Player IDs, just a way to differentiate the cpu players
const GAME_CPU__PLAYER1_ID = 1; // CPU Player 1
const GAME_CPU__PLAYER2_ID = 2; // CPU Player 2

// CPU States
const GAME_CPU__STATE__INITIALIZE       = 0;
const GAME_CPU__STATE__WAITING_FOR_TURN = 1;
const GAME_CPU__STATE__MY_TURN          = 2;

var GAME_CPU__TASK_LIST = [];

class ChessCPU
{
    constructor(oPlayer)
    {
        this.iState           = GAME_CPU__STATE__INITIALIZE; // [Number] Tracks the state of the CPU
        this.rules_list       = []                         ; // [Array ] List of rules governing this CPU
        this.oPlayer          = oPlayer                    ; // [Player object] Reference to the player class object that will be interfacing with the game's state machine
        this.delay_timeout_id = null                       ; // [Number] Reference to the setTimeout function this will be used to cause a delay
    } // End of constructor()

    ///////////////////////////////////////////
    // ChessCPU.run                          //
    // Function:                             //
    //     Runs the state machine of the CPU //
    // Return Value:                         //
    //     None                              //
    ///////////////////////////////////////////
    async run()
    {
        switch(this.iState)
        {
            case GAME_CPU__STATE__INITIALIZE      : { this.stateInitialize()    ; break; } 
            case GAME_CPU__STATE__WAITING_FOR_TURN: { this.stateWaitingForTurn(); break; }
            case GAME_CPU__STATE__MY_TURN         : { this.stateMyTurn()        ; break; }
            default:
            {
                console.log("Invalid CPU State: " + this.iState);
                break;
            }
        } // End of switch(this.iState)
        
    } // End of ChessCPU.run

    /////////////////////////////////////////////////////////////////////
    // ChessCPU.stateInitialize                                        //
    // Function:                                                       //
    //     Initalizes the state of the CPU player based on their color //
    // Return value:                                                   //
    //     None                                                        //
    /////////////////////////////////////////////////////////////////////
    stateInitialize()
    {
        var player_color = this.oPlayer.getColor();
        
        switch (player_color)
        {
            // The game has started, white player goes first
            case GAME_PLAYER__COLOR__BLACK:
            {
                // Black player will go 2nd, so go to waiting
                this.iState = GAME_CPU__STATE__WAITING_FOR_TURN;
                break;
            }
                
            case GAME_PLAYER__COLOR__WHITE:
            {
                // White player goes first, so go to my turn
                this.iState = GAME_CPU__STATE__MY_TURN;
                break;
            }
                
            case GAME_PLAYER__COLOR__NONE:
            default:
            {
                console.log("Invalid player color: "  + GAME_CHESSPIECE__COLOR__STRING_LIST[this.oPlayer.getColor()]);
                break;
            }
                
        } // End of switch (this.oPlayer.getColor())
        
    } // End of ChessCPU.stateInitialize

    ///////////////////////////////////
    // ChessCPU.stateWaitingForTurn  //
    // Function:                     //
    //     Waiting for CPU's turn    //
    // Return value:                 //
    //     None                      //
    ///////////////////////////////////
    stateWaitingForTurn()
    {
        // What team am I on
        switch (this.oPlayer.getColor())
        {
            case GAME_PLAYER__COLOR__WHITE:
            {
                // Whose turn is it
                switch (game_chess_instance.iState)
                {
                    case GAME_CHESS__STATE__TURN_WHITE: { this.iState = GAME_CPU__STATE__MY_TURN; break; } // It's my turn, time to stop waiting
                    case GAME_CHESS__STATE__TURN_BLACK: {                                         break; } // It's the other player's turn, so do nothing
                    default:                       { console.log("Invalid case: " + this.iState); break; } // Error case
                } // End of switch (this.iState)
                
                break;
            }
                
            case GAME_PLAYER__COLOR__BLACK:
            {
                // Whose turn is it
                switch (game_chess_instance.iState)
                {
                    case GAME_CHESS__STATE__TURN_WHITE: {                                         break; } // It's the other player's turn, so do nothing
                    case GAME_CHESS__STATE__TURN_BLACK: { this.iState = GAME_CPU__STATE__MY_TURN; break; } // It's my turn, time to stop waiting
                    default:                       { console.log("Invalid case: " + this.iState); break; } // Error case
                } // End of switch (this.iState)
                
                break;
            }
                
            case GAME_PLAYER__COLOR__NONE:
            default:
            {
                break;
            }
                
        } // End of switch (oPlayer.getColor())
        
    } // End of ChessCPU.stateWaitingForTurn

    ////////////////////////////////
    // ChessCPU.stateMyTurn       //
    // Function:                  //
    //     Handles the CPU's turn //
    // Return value:              //
    //     None                   //
    ////////////////////////////////
    stateMyTurn()
    {
        // Make my move
        this.move();

        // Start waiting for my next turn
        this.iState = GAME_CPU__STATE__WAITING_FOR_TURN;
    } // End of ChessCPU.stateMyTurn
    
    //////////////////////////////////////////////////////////////////////////////////////
    // ChessCPU.move                                                                    //
    // Function:                                                                        //
    //     Interfaces with the Player object Move function, performs a move as a player //
    // Return value:                                                                    //
    //     None                                                                         //
    //////////////////////////////////////////////////////////////////////////////////////
    move()
    {
        if (this.delay_timeout_id == null)
        {
            // Grabbing a reference to the CPU object before going into the timeout function
            var this_object = this;
            
            // Delay the move briefly to show a "human" reaction time
            this.delay_timeout_id = setTimeout(function()
            {
                var random_move = this_object.getRandomMove();
                this_object.oPlayer.move(random_move.piece, random_move.location);

                // Reset the reference to the timeout to null
                this_object.delay_timeout_id = null;
                
            }, TIME_1_SECOND);
        } // End of if (this.delay_timeout_id == null)
        
    } // End of ChessCPU.move
    
    ////////////////////////////////////////////////////
    // ChessCPU.getRandomMove                         //
    // Function:                                      //
    //     Gets a random move from the list of pieces //
    // Return value:                                  //
    //     Object: {ChessPiece, {x,y}}                //
    ////////////////////////////////////////////////////
    getRandomMove()
    {
        var oReturn = null;

        // Remember: getValidMoves returns a list of type: 
        // {
        //     piece: ChessPiece,
        //     moves: Array<{x,y}>
        // }
        var valid_move_list = this.oPlayer.getValidMoves();
        
        if (valid_move_list != null)
        {
            // game_randomNumber function returns inclusively between two bounds, so subtracting 1 from array length as maximum
            var random_piece_index = game_randomNumber(0, valid_move_list.length - 1);
            var random_piece_tuple = valid_move_list[random_piece_index];

            // Make sure the moves list can be accessed
            if (random_piece_tuple.moves != null)
            {
                // Make sure the piece I select CAN make any moves
                while(0 == random_piece_tuple.moves.length)
                {
                    random_piece_index = game_randomNumber(0, valid_move_list.length - 1);
                    random_piece_tuple = valid_move_list[random_piece_index];
                }

                var random_position_index = game_randomNumber(0, random_piece_tuple.moves.length - 1);
                var random_position = random_piece_tuple.moves[random_position_index];

                // The random position should NOT be undefined
                if (random_position === undefined)
                {
                    throw "CPU " +  this.oPlayer.getTeamString() + ": Cannot get random move, location is undefined";
                }
                
                oReturn = {piece: random_piece_tuple.piece, location: random_position};
            }
            else
            {
                console.log("Error: Invalid moves object");
            }
        }
        else
        {
            console.log("No valid moves to make: " + GAME_CHESSPIECE__COLOR__STRING_LIST[this.oPlayer.getColor()]);
        }

        return oReturn;
            
    } // End of ChessCPU.getRandomMove()
    
} // End of class ChessCPU