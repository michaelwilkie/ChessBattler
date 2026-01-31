/////////////////////////////////////////////////////////////////
// ui_scroll_component.js                                      //
//     Any list of user-interface items that do not fit on the //
//     screen will have available to them a scrollbar          //
/////////////////////////////////////////////////////////////////
"use strict";

class UI_Scroll_Component extends UI_Component
{
    // width and height are not limited to screen width and height
    constructor(x, y, width, height, innerwidth, innerheight)
    {
        super();

        this.x                    = x     ;
        this.y                    = y     ;
        this.width                = width ;
        this.height               = height;

        this.current_horizontal_x = x ; // for scrollbar click drag 
        this.current_horizontal_y = y ; // for scrollbar click drag 

        this.current_vertical_x   = x ; // for scrollbar click drag 
        this.current_vertical_y   = y ; // for scrollbar click drag 

        this.innerwidth           = innerwidth ;
        this.innerheight          = innerheight;

        this.clickedOnHorizontal  = false;
        this.clickedOnVertical    = false;

        this.selectedObject       = null; // for dragging and dropping objects

        this.horizontal_scrollbar = this.initialize_horizontal_scrollbar();
        this.vertical_scrollbar   = this.initialize_vertical_scrollbar  ();
    }
    initialize_horizontal_scrollbar()
    {
        // I'm going to be dividing by this number
        // so no dividing by 0 allowed
        if (this.innerwidth == 0)
        {
            return null;
        }

        var scrollbar_x = this.x;
        var scrollbar_y = this.y - ui_scrollbar_height + this.height;

        //
        //  +---------------------------+
        //  |       inner width         |
        //  |                           |
        //  +--------------+            |
        //  v actual width v            v
        // +======WINDOW=====+----------+ <---+
        // |                 |invisible |  W  |
        // |   Visible area  |area invis|  I  |
        // |                 |ible area |  N  |
        // |                 |invisible |  D  |
        // | scrollbar       |area invis|  O  |
        // | [=======]       |ible area |  W  |
        // +=================+----------+ <---+
        //
        // scrollbar width is some ratio
        //  between actual width and inner width
        //
        var width_ratio = this.width / this.innerwidth;
        if (width_ratio >= 1)
        {
            // Don't really need a scrollbar if I can fit everything
            return null;
        }
        var scrollbar_width = this.width * width_ratio;

        var scrollbar_height = ui_scrollbar_height;

        return {
            x     : scrollbar_x     ,
            y     : scrollbar_y     ,
            width : scrollbar_width ,
            height: scrollbar_height
        };
    }
    initialize_vertical_scrollbar()
    {
        // I'm going to be dividing by this number
        // so no dividing by 0 allowed
        if (this.innerheight == 0)
        {
            return null;
        }

        var scrollbar_x = this.x - ui_scrollbar_width + this.width;
        var scrollbar_y = this.y;

        //
        // +===========WINDOW==========+ <------+---------------+
        // |                          _|        |               |
        // |        Visible area     | |        |               |
        // |                         | | +------+------+   +----+-------+
        // |            scrollbar--> | | |actual height|   |inner height|
        // |                         |_| +------+------+   +----+-------+
        // |                           |        |               |
        // +===========================+ <------+               |
        // | invisible area invisible  |                        |
        // | area invisible area invis |                        |
        // | ible area invisible area  |                        |
        // +---------------------------+ <----------------------+
        // scrollbar height is some ratio
        //  between actual height and inner height
        //
        var height_ratio = this.height / this.innerheight;
        if (height_ratio >= 1)
        {
            // Don't really need a scrollbar if I can fit everything
            return null;
        }

        var scrollbar_height = this.height * height_ratio;

        var scrollbar_width = ui_scrollbar_width;

        return {
            x     : scrollbar_x     ,
            y     : scrollbar_y     ,
            width : scrollbar_width ,
            height: scrollbar_height
        };
    }
    update()
    {
        //////////////////////////////////////////////////////////
        // Press down   : Checking for tiles I clicked          //
        // Down         : Checking if I'm grabbing a scrollbar  //
        // Press up     : Saving position of scrollbar          //
        // Scroll up    : Move the scrollbar up                 //
        // Scroll down  : Move the scrollbar down               //
        //////////////////////////////////////////////////////////

        ///////////////////////////////////////////////
        // Accounting for the scroll bar being moved //
        ///////////////////////////////////////////////
        var xoffset = 0;
        var yoffset = 0;
        if (this.horizontal_scrollbar != null)
        {
            xoffset = this.horizontal_scrollbar.x;
        }
        if (this.vertical_scrollbar != null)
        {
            yoffset = this.vertical_scrollbar.y;
        }

        var adjusted_mouse_position = {x: mousestartpos.x + xoffset, y: mousestartpos.y + yoffset};

        ///////////////////////////////////////////
        // Only allow interaction if I'm visible //
        ///////////////////////////////////////////
        if (this.bDrawable)
        {

            // Down
            if (mdownleft)
            {
                if (DEBUG_MODE) console.log('ui_scroll_component: ' + 'clicking');
                //////////////////////////////////////
                // Clicked the horizontal scrollbar //
                //////////////////////////////////////
                if (checkPointCollision(this.horizontal_scrollbar, mousestartpos))
                {
                    this.clickedOnHorizontal = true;
                }
                ////////////////////////////////////
                // Clicked the vertical scrollbar //
                ////////////////////////////////////
                else if (checkPointCollision(this.vertical_scrollbar, mousestartpos))
                {
                    this.clickedOnVertical = true;
                }
            }
            else
            {
                // I am adding an exception to mouse wheel events so I don't have to duplicate the bounds checking code
                if (!mwheel)
                {
                    this.clickedOnHorizontal = false;
                    this.clickedOnVertical   = false;
                }
            }
            if (this.clickedOnHorizontal)
            {
                // I use this.current_horizontal_x to save the scrollbar's starting position
                this.horizontal_scrollbar.x = this.current_horizontal_x + (mousepos.x - mousestartpos.x);
                
                this.make_sure_horizontal_scrollbar_is_in_bounds();
            }
            else if (this.clickedOnVertical)
            {
                // I use this.current_horizontal_y to save the scrollbar's starting position
                this.vertical_scrollbar.y = this.current_vertical_y + (mousepos.y - mousestartpos.y);

                this.make_sure_vertical_scrollbar_is_in_bounds();
            }

            // Press up
            if (mlastdownleft && !mdownleft 
            && this.vertical_scrollbar != null
            && this.horizontal_scrollbar != null)
            {
                this.current_horizontal_x = this.horizontal_scrollbar.x ;
                this.current_horizontal_y = this.horizontal_scrollbar.y ;
                this.current_vertical_x   = this.vertical_scrollbar.x   ;
                this.current_vertical_y   = this.vertical_scrollbar.y   ;
            }
        }

        // Code handling 'clickedOnVertical' also does bounds checking so I will use that instead
        if (mwheeldown)
        {
            this.vertical_scrollbar.y += 20;
            this.make_sure_vertical_scrollbar_is_in_bounds();
        }
        if (mwheelup)
        {
            this.vertical_scrollbar.y -= 20;
            this.make_sure_vertical_scrollbar_is_in_bounds();
        }

        this.component_list.forEach
        (
            function(elem)
            {
                elem.update(adjusted_mouse_position.x, adjusted_mouse_position.y);
            }
        )
    }
    draw()
    {
        if (this.bDrawable)
        {
            // The area inside the scroll region
            ui_fillBox(this.x, this.y, this.width, this.height,"rgba(123, 123, 123, 0.5)");
        
            var scroll_bar_component = this;
            var xoffset = 0;
            var yoffset = 0;

            if (this.horizontal_scrollbar != null)
            {
                xoffset = -this.horizontal_scrollbar.x;
            }
            if (this.vertical_scrollbar != null)
            {
                yoffset = -this.vertical_scrollbar.y;
            }

            this.component_list.forEach(function(component)
            {
                if (component instanceof UI_Component)
                {
                    component.draw(xoffset, yoffset);
                }
                else
                {
                    component.draw_on_UI(xoffset, yoffset);
                    ui_drawBox
                    (
                        component.pos.x + xoffset, 
                        component.pos.y + yoffset, 
                        component.width          , 
                        component.height         , 
                        "black"
                    );
                }
            });
            if (this.selectedObject != null)
            {
                ui_drawBox
                (
                    this.selectedObject.pos.x + xoffset, /* x          */
                    this.selectedObject.pos.y + yoffset, /* y          */
                    this.selectedObject.width          , /* width      */
                    this.selectedObject.height         , /* height     */
                    "red"                              , /* line color */ 
                    4                                    /* line width */ 
                );
            }
            ////////////////////
            // The scrollbars //
            ////////////////////

            // Horizontal scrollbar
            if (this.horizontal_scrollbar != null)
            {
                ui_fillBox
                (
                    this.horizontal_scrollbar.x     , 
                    this.horizontal_scrollbar.y     , 
                    this.horizontal_scrollbar.width , 
                    this.horizontal_scrollbar.height,
                    "rgba(10, 10, 10, 0.7)"
                );
            }
            // Vertical scrollbar
            if (this.vertical_scrollbar != null)
            {
                ui_fillBox
                (
                    this.vertical_scrollbar.x     , 
                    this.vertical_scrollbar.y     , 
                    this.vertical_scrollbar.width , 
                    this.vertical_scrollbar.height,
                    "rgba(10, 10, 10, 0.7)"
                );
            }

        } // end of if (this.bDrawable)

        // Culling function
        ui_invertedClearRect(this.x, this.y, this.width, this.height);
    }
    /////////////////////////////////////////////////
    // make_sure_horizontal_scrollbar_is_in_bounds //
    // Function:                                   //
    //     Keep it in bounds ¯\_(ツ)_/¯            //
    // Return value:                               //
    //     None                                    //
    /////////////////////////////////////////////////
    make_sure_horizontal_scrollbar_is_in_bounds()
    {
        // this.x being the x position of the scroll area container
        if (this.horizontal_scrollbar.x < this.x)
        {
            this.horizontal_scrollbar.x = this.x;
        }
        if (this.horizontal_scrollbar.x + this.horizontal_scrollbar.width > this.x + this.width)
        {
            this.horizontal_scrollbar.x = this.x + this.width - this.horizontal_scrollbar.width;
        }
    }
    ///////////////////////////////////////////////
    // make_sure_vertical_scrollbar_is_in_bounds //
    // Function:                                 //
    //     Keep it in bounds ¯\_(ツ)_/¯          //
    // Return value:                             //
    //     None                                  //
    ///////////////////////////////////////////////
    make_sure_vertical_scrollbar_is_in_bounds()
    {
        // this.y being the y position of the scroll area container
        if (this.vertical_scrollbar.y < this.y)
        {
            this.vertical_scrollbar.y = this.y;
        }
        if (this.vertical_scrollbar.y + this.vertical_scrollbar.height > this.y + this.height)
        {
            this.vertical_scrollbar.y = this.y + this.height - this.vertical_scrollbar.height;
        }
    }
}