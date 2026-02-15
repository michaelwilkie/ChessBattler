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

const GAME_CPU__WAIT_TIME               = TIME_1_SECOND; // [Number] Time in seconds that a CPU will wait so the player can see the CPU "thinking" before making a move

var GAME_CPU__TASK_LIST = [];

class ChessCPU
{
    constructor(oPlayer)
    {
        this.iState                 = GAME_CPU__STATE__INITIALIZE   ; // [Number] Tracks the state of the CPU
        this.rules_list             = []                            ; // [Array ] List of rules governing this CPU
        this.oPlayer                = oPlayer                       ; // [Player object] Reference to the player class object that will be interfacing with the game's state machine
        this.delay_timeout_id       = null                          ; // [Number] Reference to the setTimeout function this will be used to cause a delay
        this.cpu_delay_timer        = 0                             ; // [Number] Timer for the CPU "think" time, see GAME_CPU__WAIT_TIME
        this.cpu_delay_timer_flag   = 0                             ; // [Number] Flag signalling whether the cpu_delay_timer has started
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

    //////////////////////////////////////////////////////////////////////////
    // ChessCPU.stateMyTurn                                                 //
    // Function:                                                            //
    //      Handles the CPU's turn                                          //
    //      Have the computer wait a predetermined amount time              //
    //         to give the player time to react to where the CPU moves next //
    // Return value:                                                        //
    //     None                                                             //
    //////////////////////////////////////////////////////////////////////////
    stateMyTurn()
    {
        // Determine if the timer has NOT started
        if (0 == this.cpu_delay_timer_flag)
        {
            // The timer has NOT started

            // Set the timer delay flag so that we do not reenter this conditional while the timer has started
            this.cpu_delay_timer_flag = 1;

            // Start the timer by capturing the current time
            this.cpu_delay_timer = game_core.time.getCurrentTime();

        } // if (0 == this.cpu_delay_timer_flag)
        else
        {
            // The timer has started

            // Determine if it has expired
            if (game_core.time.hasExpired(this.cpu_delay_timer + GAME_CPU__WAIT_TIME))
            {
                // Timer has expired

                // Reset the delay timer flag
                this.cpu_delay_timer_flag = 0;

                // Make my move
                this.move();

                // Start waiting for my next turn
                this.iState = GAME_CPU__STATE__WAITING_FOR_TURN;

            } // End of if (game_core.time.hasExpired(this.cpu_delay_timer + GAME_CPU__WAIT_TIME))

        } // End of else (of if (0 == this.cpu_delay_timer_flag))

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
        var random_move = this.getRandomMove();
        this.oPlayer.move(random_move.piece, random_move.location);   
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