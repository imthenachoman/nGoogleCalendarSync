var OTHER_CALENDAR_EMAIL = "example@example.com";

function calendarUpdated(e)
{
  // the calendar ID from the trigger event object
  var calendarID = e.calendarId;
  
  var scriptProperties = PropertiesService.getScriptProperties();
  
  // get the sync token
  var syncToken = scriptProperties.getProperty("syncToken");
  
  // if we don't have one, let user know
  // we need a sync token to get the events that changed
  if(!syncToken)
  {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), "ERROR: No `syncToken`. Please run `initilize` first.", "ERROR: No `syncToken`. Please run `initilize` first." );
  }
  else
  {
    // get the other calendar
    var otherCalendar = CalendarApp.getCalendarById(OTHER_CALENDAR_EMAIL);
    
    // get all the events that changed since the last sync
    var changedEvents = Calendar.Events.list(calendarID, {"syncToken" : syncToken});
    
    // if we have items
    while(changedEvents.items.length)
    {
      // get one
      var eventDetails = changedEvents.items.shift();
      
      // if the event is cancelled then...
      if(eventDetails.status == "cancelled")
      {
        // TBD
      }
      else
      {
        // there are lots of calendar events
        // an event title could be changed
        // an event could be moved
        // to do: determine the change type and handle accordingly
        // for now, just create a new event on the other calendar
        otherCalendar.createEvent("busy", new Date(eventDetails.start.dateTime), new Date(eventDetails.end.dateTime));
      }
      
      // if there are no more items
      // if there are more pages, then get them
      // developer note: how busy is someone that they have more than one page of event changes on each trigger run
      if(changedEvents.items.length == 0 && changedEvents.nextPageToken)
      {
        changedEvents = Calendar.Events.list(calendarID, {"syncToken" : syncToken, "pageToken" : changedEvents.nextPageToken});
      }
    }
    
    // save the sync token for the next update
    scriptProperties.setProperty("syncToken", changedEvents.nextSyncToken);
  } 
}

function testCalendarUpdated()
{
  calendarUpdated({"calendarId" : Session.getEffectiveUser().getEmail()});
}

// initilize this project
// get a next sync token so we can get updated events when the calendar is updated
function initilize()
{
  // get my email address
  // same as the calendar ID
  var myEmail = Session.getEffectiveUser().getEmail();
  
  // get all the events
  var allEvents = Calendar.Events.list(myEmail);
  
  // if we have pages, go through them
  while(allEvents.nextPageToken)
  {
    // get the next page
    allEvents = Calendar.Events.list(myEmail, {"pageToken" : allEvents.nextPageToken});
  }
  
  // at this point we have gone through all of the pages and have a sync token
  // so save it for future reference
  PropertiesService.getScriptProperties().setProperty("syncToken", allEvents.nextSyncToken);
}
