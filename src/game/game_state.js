//////////////////////////////////////////////////////////
// game_state.js                                        //
// To contain instances of various snippets of the game //
//////////////////////////////////////////////////////////

// The structure of a chess state should be simple so that algorithms processing 
// I will adopt a bitwise representation of a chessboard
//
//     1  2  3  4  5  6  7  8
//    |__|__|__|__|__|__|__|__| 1
//    |__|__|__|__|__|__|__|__| 2
//    |__|__|__|__|__|__|__|__| 3
//    |__|__|__|__|__|__|__|__| 4
//    |__|__|__|__|__|__|__|__| 5
//    |__|__|__|__|__|__|__|__| 6
//    |__|__|__|__|__|__|__|__| 7
//    |__|__|__|__|__|__|__|__| 8
//
class ChessState
{
    constructor(p_oChess_board, p_iTurn, p_iState)
    {
        this.oChess_board = p_oChess_board;
        this.iTurn        = p_iTurn;
        this.iState       = p_iState;
    }

    ///////////////////////////////////////////////
    //     ChessState.copyState                  //
    // Function:                                 //
    //     Copies the current state of the board //
    // Return value:                             //
    //     State                                 //
    ///////////////////////////////////////////////
    copyState()
    {
        
        this.oChess_board = game_chess_board_instance.createDeepCopy();
    }
};