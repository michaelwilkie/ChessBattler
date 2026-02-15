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

    ///////////////////////////////
    // GameTime.getCurrentTime   //
    // Function:                 //
    //     Gets the current time //
    // Return value:             //
    //     TimeStamp             //
    ///////////////////////////////
    getCurrentTime()
    {
        return this.now;
    }

    ////////////////////////////////////
    // GameTime.getCurrentTimeSeconds //
    // Function:                      //
    //     Gets the current time      //
    // Return value:                  //
    //     TimeStamp                  //
    ////////////////////////////////////
    getCurrentTimeSeconds()
    {
        return this.now / 1000;
    }

    ////////////////////////////////////////////////////////////
    // GameTime.getFutureTimeSeconds                          //
    // Function:                                              //
    //     Gets the time a certain number of seconds from now //
    // Return value:                                          //
    //     TimeStamp                                          //
    ////////////////////////////////////////////////////////////
    getFutureTimeSeconds(time_seconds)
    {
        // this.now contains time in milliseconds
        return this.now + (time_seconds * 1000);
    }

    ///////////////////////////////////////////////////////////////
    // GameTime.hasExpired                                       //
    // Function:                                                 //
    //     Returns true if the this.now has passed up time_stamp //
    //     or in this case, is a negative difference             //
    // Return value:                                             //
    //     Boolean                                               //
    ///////////////////////////////////////////////////////////////
    hasExpired(time_stamp)
    {
        return (this.now - time_stamp) > 0;
    }

    ///////////////////////////////////////////////////////////////////////////////////
    // GameTime.timeElapsedSince                                                     //
    // Function:                                                                     //
    //     Returns the difference between the current time and the variable provided //
    // Return value:                                                                 //
    //     TimeStamp                                                                 //
    ///////////////////////////////////////////////////////////////////////////////////
    timeElapsedSince(time_val)
    {
        return this.now - time_val;
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