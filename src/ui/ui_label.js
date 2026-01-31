////////////////////////////////////////////////////////////
// ui_label.js                                            //
//     This class is for displaying basic text on the UI. //
//     Maybe include different shapes for boundaries to   //
//     be displayed.                                      //
////////////////////////////////////////////////////////////
"use strict";

class UI_Label extends UI_Component
{
    constructor(text, x, y, width, height, 
    font             = ui_default_font, 
    fontsize         = ui_default_fontsize, 
    text_color       = ui_default_text_color, 
    background_color = ui_default_background_color,
    text_alignment   = ui_default_text_alignment)
    {
        super();
        this.text             = text            ;
        this.x                = x               ;
        this.y                = y               ;
        this.width            = width           ;
        this.height           = height          ;
        this.font             = font            ;
        this.fontsize         = fontsize        ;
        this.text_color       = text_color      ;
        this.background_color = background_color;
        this.text_alignment   = text_alignment  ;
    }
    getText()
    {
        return this.text;
    }
    setText(text)
    {
        this.text = text;
    }
    draw(text_offset_x, text_offset_y)
    {
        ui_drawText
        (
            this.text, 
            this.x + text_offset_x, 
            this.y + text_offset_y, 
            this.text_color, 
            this.text_alignment, 
            this.font, 
            this.fontsize
        );
    }
    update()
    {
        // nothing to do here
        // defined so no null exceptions are thrown when components are asked to call their update function
    }
}