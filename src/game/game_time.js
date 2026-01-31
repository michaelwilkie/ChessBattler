//////////////////////////////////////////////
// game_time.js                             //
// Creating a time-based animation system   //
//////////////////////////////////////////////
"use strict";

class GameTime
{
    constructor()
    {
        this.start              = Date.now()            ; // [milliseconds] time program started, should not change
        this.now                = this.start            ; // [milliseconds] current time of the program
        this.then               = this.now              ; // [milliseconds] time of the program last frame
        this.delta              = 0                     ; // [milliseconds] time difference between current frame and last frame
        this.update_frame_timer = 1000 / game_core.fps  ; // [milliseconds] time to update the next frame
        this.last_frame_update  = 0                     ; // [milliseconds] last time frame was updated
    }

    // https://www.viget.com/articles/time-based-animation/
    // https://jsfiddle.net/greypants/9d2Dn/
    tick()
    {
        this.now    = Date.now();
        this.delta  = (this.now - this.then) / 1000; // [seconds] time since last frame
        this.then   = this.now;
    }
    timeToUpdate()
    {
        if (this.now > this.last_frame_update + this.update_frame_timer)
        {
            this.last_frame_update = this.now;
            return true;
        }
        else
        {
            return false;
        }
    }
} // End of class GameTime