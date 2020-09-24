# nGoogleCalendarSync
Creates "busy" events on a destination calendar from a source calendar. 

This is still a WIP.

The goal is create "busy" events on another calendar when events are added to one calendar.

For example, say you have two calendars: a personal one (`example@gmail.com`) and a work one (`example@example.com`) -- when an invite is added to your personal one (`example@gmail.com`) then a "busy" event should be created on your work one (`example@example.com`).

For this script to work, the source Google account has to have edit access to the calendar of the destination account. This can be done by sharing the destination calendar with the source account and giving it `Make changes to events` permissions.

# To Use

1. Create a new GAS project
2. Copy the contents of `Code.js` into the new GAS project
3. Enable `Calendar` in `Advanced Google Services` 
4. Set `OTHER_CALENDAR_EMAIL` to the email address of the destination account
5. Run the `initilize` function
6. Create a trigger that runs `calendarUpdated` on calendar update for the source account

# Current Limitations

- Right now the script does not delete events from the destination calendar when they are deleted from the source calendar
- There are many types of calendar changes (e.g. changing the title, moving it, adding a description, etc...). Right now the code does not determine the change type and will create a new event on the destination for any/all changes. Eventually I'll figure out how to determine the event change type and do something accordingly.

# Notes

- Thanks to [@AlyssaM_InfoSec](https://twitter.com/AlyssaM_InfoSec) for [the idea](https://twitter.com/IMTheNachoMan/status/1308944324294565888?s=20).
