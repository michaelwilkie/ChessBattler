/////////////////////////////////////
// ui_button.js                    //
//     Component for button events //
/////////////////////////////////////
"use strict";

class UI_Button extends UI_Component
{
    constructor(text, x, y, w, h,
                imgsrc                  = null,
                text_color              = ui_default_text_color,
                button_background_color = ui_default_background_color,
                font                    = ui_default_font,
                fontsize                = ui_default_fontsize,
                background_color        = ui_default_background_color)
    {
        super();
        this.img                        = image_createImageObject(imgsrc);
        this.x                          = x;
        this.y                          = y;
        this.width                      = w;
        this.height                     = h;
        this.button_background_color    = button_background_color;
        this.text_label                 = new UI_Label
        (
            text,
            x, y,
            w - 2 * 20, h - 2 * 20, // putting 20px padding on the outsides of the label
            font, fontsize,
            text_color, background_color
        );
        this.text_label.text_alignment  = "center";
        this.bClicked                   = false;
    }
    /////////////////////////////////////////////////////////
    //                        draw                         //
    // Function:                                           //
    //     Invert the color of the button if it is clicked //
    //     Fill in the button background, Draw the text    //
    // Return value:                                       //
    //     None                                            //
    /////////////////////////////////////////////////////////
    draw(xoffset=0, yoffset=0)
    {
        var button_background_color = this.button_background_color;
        var text_color              = this.text_label.text_color;
        var old_text_color          = this.text_label.text_color;        
        
        if (this.bClicked)
        {
            button_background_color = colorNameToHex(this.button_background_color);
            text_color              = colorNameToHex(this.text_label.text_color);

            button_background_color = invertColor(button_background_color);
            text_color              = invertColor(text_color);
        }

        ui_fillBox
        (
            this.x + xoffset,
            this.y + yoffset,
            this.width,
            this.height,
            button_background_color
        );

        // This is kind of spaghetti, I shouldn't have to set the color manually here
        this.text_label.text_color = text_color;
        this.text_label.draw
        (
            xoffset + this.width  / 2,      // text offset x
            yoffset + this.height / 2 + 10  // text offset y
        );

        // Preserving the original text color
        // There has to be a less spaghetti way of doing this
        this.text_label.text_color = old_text_color;
    }
    //////////////////////////////////////////////////////////////////////////////
    //                              update                                      //
    // Function:                                                                //
    //     I have a serious design flaw here.                                   //
    //     This is supposed to be the simple update function for the UI_Button. //
    //     But it is only called from the scrollbar component.                  //
    //     I did decide that components are responsible for their children.     //
    //     but I don't want to make special parameters whether something's in   //
    //     a scroll component or maybe another exceptional scenario.            //
    //                                                                          //
    //     Currently, the update function is expecting to be passed in offsets  //
    //     as if it were inside another component (which it usually should be). //
    //                                                                          //
    // Return value:                                                            //
    //     None                                                                 //
    //////////////////////////////////////////////////////////////////////////////
    update(xoffset=0, yoffset=0)
    {
        // Do I have to put this conditional here?
        // Shouldn't the parent be responsible for this?
        if (this.bDrawable)
        {
            var adjusted_mouse_position = {x: xoffset, y: yoffset};
            if (mdownleft && checkPointCollision(this, adjusted_mouse_position))
            {
                if (mdownleft != mlastdownleft)
                {
                    this.bClicked = true;
                }
            }
            else
            {
                this.bClicked = false;
            }
        }
    }
    onClick()
    {
        // this should be defined where the instance is defined
    }
}