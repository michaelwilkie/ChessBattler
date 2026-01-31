///////////////////////////////////////////////////////
// game_cpu_rule.js                                  //
// Defines rule objects that CPU players will follow //
///////////////////////////////////////////////////////
"use strict";

/*
* Base Rule = A rule that applies to all chess pieces that results in a move
* Rule = A rule that applies to one or more pieces that may or may not result in a move
*
* A rule can be split up into these components
* Rule = [Subject] + [Condition] + [Task]
*
*
* Subject   = The object that the rule is based on
* Condition = What determines whether the rule will be followed
* Task      = Determines what will be done if the condition is met
*
* 
* If [Condition] true for [Subject] then do [Task]
* Examples:
*     Base Rule:
*     Rule: If Pawn can attack then attack
*           [Subject]   = Pawn
*           [Condition] = Can attack
*           [Task]      = attack
* 
*     Rule: If Move has least amount of Enemy responses then Move
*           [Subject]   = Move
*           [Condition] = least amount of Enemy responses
*           [Task]      = Move
* 
*     Rule Move random
*           [Subject]   = None (random piece)
*           [Condition] = None
*           [Task]      = Move random piece to a random valid location
* 
*/
class ChessCPU_Rule
{
    constructor(CPU_Player)
    {
        this.CPU_Player  = CPU_Player; // [ChessCPU Object] The CPU that will be governed by this rule
        this.o_subject   = null      ; // [Object         ] The object (player, CPU, chess piece) that the rule will be based around
        this.b_condition = null      ; // [Boolean        ] Condition that determines whether the task will be performed
        this.o_task      = null      ; // [Function       ] The operation that will be performed in regards to the subject
    } // End of constructor()

    addRule(o_subject, b_condition, o_task)
    {
        this.setSubject  (o_subject  );
        this.setCondition(b_condition);
        this.setTask     (o_task     );
    } // End of addRule()

    setSubject(o_subject)
    {
        this.o_subject = o_subject;
    }

    setCondition(b_condition)
    {
        this.b_condition = b_condition;
    }

    setTask(o_task)
    {
        this.o_task = o_task;
    }
    
} // End of class ChessCPU_Rule