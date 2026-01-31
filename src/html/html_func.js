////////////////////////////////////
// html_func.js                   //
// Functions that handle the html //
////////////////////////////////////
"use strict";

const HTML_START_GAME__STATE__NOT_STARTED = 0;
const HTML_START_GAME__STATE__STARTED     = 1;

//////////////////////////////////////////////////////////////////
//     html_initialized                                         //
// Function:                                                    //
//     Initalizes all global variables related to HTML elements //
// Return value:                                                //
//     None                                                     //
//////////////////////////////////////////////////////////////////
function html_initialize()
{
    // Enable dragging and dropping for the list items
    html_updateListEventListeners();

    // Set the html game state variable
    html_start_game_button_state = HTML_START_GAME__STATE__NOT_STARTED;

    // Set the start text
    html_setStartButtonText();

    return;
} // End of html_initialize()

////////////////////////////////////////////////////////////////////////
//     html_updateListEventListeners                                  //
// Function:                                                          //
//     Add event listeners to all the elements to make them draggable //
// Return value:                                                      //
//     None                                                           //
////////////////////////////////////////////////////////////////////////
function html_updateListEventListeners()
{
    // Grab a reference from the list html element
    let ul_ai_priority_list = document.querySelectorAll('#ul_ai_priority_list > li')

    // Add event listeners to all the elements to make them draggable
    ul_ai_priority_list.forEach(item => {
      $(item).prop('draggable', true)
      item.addEventListener('dragstart'   , html_dragStart);
      item.addEventListener('drop'        , html_dropped);
      item.addEventListener('dragenter'   , html_cancelDefault);
      item.addEventListener('dragover'    , html_cancelDefault);
    });
} // End of html_updateListEventListeners()

///////////////////////////////////////////////////////////////////
//     html_initializeButtonState                                //
// Function:                                                     //
//     Initalizes the text in the button_start_game HTML element //
// Return value:                                                 //
//     None                                                      //
///////////////////////////////////////////////////////////////////
function html_setStartButtonText()
{
    switch(html_start_game_button_state)
    {
        case HTML_START_GAME__STATE__NOT_STARTED: { document.querySelector('#button_start_game').innerText = "Start Game"  ; break;}
        case HTML_START_GAME__STATE__STARTED    : { document.querySelector('#button_start_game').innerText = "Restart Game"; break;}
        default                                 : { document.querySelector('#button_start_game').innerText = "Start Game"  ; break;}
    } // End of switch(html_start_game_button_state)
} // End of html_setStartButtonText()

////////////////////////////////////////////////////////
//     html_button_startGame                          //
// Function:                                          //
//     Hanlder for the button_start_game html element //
// Return value:                                      //
//     None                                           //
////////////////////////////////////////////////////////
function html_button_startGame()
{
    game_initializePlayers();

    switch(html_start_game_button_state)
    {
        case HTML_START_GAME__STATE__NOT_STARTED:
        {
            html_start_game_button_state = HTML_START_GAME__STATE__STARTED;
            console.log("html_start_game_button: Transition from 'Not Started' to the 'Started' state");
            break;
        }

        case HTML_START_GAME__STATE__STARTED:
        {
            html_start_game_button_state = HTML_START_GAME__STATE__NOT_STARTED;
            console.log("html_start_game_button: Transition from 'Started' to the 'Not Started' state");
            break;
        }

        default:
        {
            html_start_game_button_state = HTML_START_GAME__STATE__NOT_STARTED;
            console.log("Invalid start game button state: " + html_start_game_button_state);
            console.log("html_start_game_button: Transition from 'Not Started' to the 'Started' state");
            break;
        }
    } // End of switch(html_start_game_button_state)

    html_setStartButtonText();
} // End of html_button_startGame()

/////////////////////////////////////////////////////////////////
//     html_label_setPlayerTurn                                //
// Function:                                                   //
//     Updates the label html element to show whose turn it is //
//     See GAME_CHESS__STATE                                   //
// Return value:                                               //
//     None                                                    //
/////////////////////////////////////////////////////////////////
function html_label_setPlayerTurn(iGame_chess_state)
{
    switch (iGame_chess_state)
    {
        case GAME_CHESS__STATE__INITIALIZE          : { $("#label_player_turn").val("Waiting for the game to start"  ); break; }
        case GAME_CHESS__STATE__TURN_WHITE          : { $("#label_player_turn").val("White's turn"                   ); break; }
        case GAME_CHESS__STATE__TURN_BLACK          : { $("#label_player_turn").val("Black's turn"                   ); break; }
        case GAME_CHESS__STATE__TURN_WHITE_IN_CHECK : { $("#label_player_turn").val("White's turn, Check"            ); break; }
        case GAME_CHESS__STATE__TURN_BLACK_IN_CHECK : { $("#label_player_turn").val("Black's turn, Check"            ); break; }
        case GAME_CHESS__STATE__CHECK_MATE_BLACK    : { $("#label_player_turn").val("White wins, Check mate"         ); break; }
        case GAME_CHESS__STATE__CHECK_MATE_WHITE    : { $("#label_player_turn").val("Black wins, Check mate"         ); break; }
        default:
        {
            $("#label_player_turn").val("Invalid game state");
            break;
        }
    } // End of switch (iGame_chess_state)

} // End of html_label_setPlayerTurn()

///////////////////////////////////////////////////////////////////
//     html_textarea_putSelectedEntity                           //
// Function:                                                     //
//     Publishes chess_board_instance.oSelected_chess_piece info //
//     to the "debug_textarea" html element                      //
// Return value:                                                 //
//     None                                                      //
///////////////////////////////////////////////////////////////////
function html_textarea_putSelectedEntity()
{
    $('#debug_textarea_selectedpiece').val(
        GAME_CHESSPIECE__TYPE__STRING_LIST[game_chessboard_instance.oSelected_chess_piece.getType()] +
        ": " +
        "x: " + game_chessboard_instance.oSelected_chess_piece.getPosition().x + ", " +
        "y: " + game_chessboard_instance.oSelected_chess_piece.getPosition().y
    );
} // End of html_textarea_putSelectedEntity()

///////////////////////////////////////////////////////////////
//     html_textarea_putMousePosition                        //
// Function:                                                 //
//     Publishes mousepos and which square the mouse is over //
//     Publishes which box the mouse is hovering over        //
// Return value:                                             //
//     None                                                  //
///////////////////////////////////////////////////////////////
function html_textarea_putMousePosition(transposed_x, transposed_y)
{
    $('#debug_textarea_mousepos').val(
        "x: "     + mousepos.x   + ", " +
        "y: "     + mousepos.y   + "\n" +
        "Box X: " + transposed_x + ", " +
        "Box Y: " + transposed_y + "\n"
    );
} // End of html_textarea_putMousePosition()

///////////////////////////////////////////////////////////////
//     html_dragStart                                        //
// Function:                                                 //
//     Keeps track of the text when the box is being dragged //
// Return value:                                             //
//     None                                                  //
// Source:                                                   //
// https://codepen.io/PJCHENder/pen/PKBVRO/                  //
///////////////////////////////////////////////////////////////
function html_dragStart(e)
{
  var index = $(e.target).index()
  e.dataTransfer.setData('text/plain', index)
} // End of html_dragStart()

/////////////////////////////////////////////////////////////
//     html_dropped                                        //
// Function:                                               //
//     Swaps the dragged box with the one its dropped onto //
// Return value:                                           //
//     None                                                //
// Source:                                                 //
// https://codepen.io/PJCHENder/pen/PKBVRO/                //
/////////////////////////////////////////////////////////////
function html_dropped(e) 
{
    html_cancelDefault(e)
  
    // get new and old index
    let oldIndex = e.dataTransfer.getData('text/plain');
    let target = $(e.target);
    let newIndex = target.index();
  
    // remove dropped items at old place
    let dropped = $(this).parent().children().eq(oldIndex).remove();

    // insert the dropped items at new place
    if (newIndex < oldIndex)
    {
        target.before(dropped);
    }
    else
    {
        target.after(dropped);
    }
} // End of html_dropped()

//////////////////////////////////////////////////////////////////
//     html_cancelDefault                                       //
// Function:                                                    //
//     Prevents highlighting effects from interrupting the drag //
// Return value:                                                //
//     None                                                     //
// Source:                                                      //
// https://codepen.io/PJCHENder/pen/PKBVRO/                     //
//////////////////////////////////////////////////////////////////
function html_cancelDefault(e)
{
    e.preventDefault();
    e.stopPropagation();
    
    return false
} // End of html_cancelDefault()

/////////////////////////////////////////////
//     html_ComputerPlayerCheckbox         //
// Function:                               //
//     Hides or shows the cpu program list //
// Return value:                           //
//     None                                //
/////////////////////////////////////////////
function html_ComputerPlayerCheckbox(e)
{
    var html_p1_checkbox = document.getElementById("checkbox_player1");
    var html_p2_checkbox = document.getElementById("checkbox_player2");

    var html_ai_1_list = document.getElementById("ul_ai_1_priority_list");
    var html_ai_2_list = document.getElementById("ul_ai_2_priority_list");
    
    if (html_p1_checkbox.checked) { html_ai_1_list.style.display = "block"; }
    else                          { html_ai_1_list.style.display = "none" ; }

    if (html_p2_checkbox.checked) { html_ai_2_list.style.display = "block"; }
    else                          { html_ai_2_list.style.display = "none" ; }
} // End of html_ComputerPlayerCheckbox()