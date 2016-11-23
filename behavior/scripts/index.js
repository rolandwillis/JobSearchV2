'use strict'
const firstOfEntityRole = function(message, entity, role) {
  role = role || 'generic';

  const slots = message.slots
  const entityValues = message.slots[entity]
  const valsForRole = entityValues ? entityValues.values_by_role[role] : null

  return valsForRole ? valsForRole[0] : null
}

exports.handle = (client) => {
  // Create steps
    
    const greet = client.createStep({
    satisfied() {
     return Boolean(client.getConversationState().greetedUser) ||  Boolean(client.getConversationState().jobLocation) || Boolean(client.getConversationState().jobRole) ;
    },
    extractInfo(){
        const jobrole = firstOfEntityRole(client.getMessagePart(), 'jobrole');
         const location = firstOfEntityRole(client.getMessagePart(), 'location');
         if(jobrole)
         {
           	client.updateConversationState({
		    jobRole: jobrole
		  })
         }
         if(location)
         {
                console.log("Setting Location to " + location.value);
           	client.updateConversationState({
		    jobLocation: location
		  })
         }
    },
    prompt() {
      client.addResponse('greeting/offerservice')
      client.updateConversationState({
          greetedUser:true,
    })
      client.done()
    }
  })
    
  const getJobRole = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().jobRole)
    },
    extractInfo()
    {
         const jobrole = firstOfEntityRole(client.getMessagePart(), 'jobrole');
         const location = firstOfEntityRole(client.getMessagePart(), 'location');
         if(jobrole)
         {
           	client.updateConversationState({
		    jobRole: jobrole
		  })
         }
         if(location)
         {
                console.log("Setting Location to " + location.value);
           	client.updateConversationState({
		    jobLocation: location
		  })
         }
    },
    prompt() {
      client.addResponse('request/jobrole')
      client.done()
    }
  })
  
    const getLocation = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().jobLocation)
    },
    extractInfo()
    {
         const joblocation = firstOfEntityRole(client.getMessagePart(), 'location');
         if(joblocation)
         {
           	client.updateConversationState({
		    jobLocation: joblocation
		  })
                console.log("Location defined as :" + joblocation.value);
         }
    },
    prompt() {
      client.addResponse('request/location')
      client.done()
    }
  })
    
        const provideResults = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().resultsSent)
    },

    prompt() {
        let searchResults = {
            location : client.getConversationState().jobLocation.value,
            jobcount : "2",
            jobrole: client.getConversationState().jobRole.value,
            searchlink:"http://google.co.uk?q=" + client.getConversationState().jobRole.value + "jobs%20in%20" + client.getConversationState().jobLocation.value
        }
        
      client.addResponse('provide/searchresults',searchResults)
       	client.updateConversationState({
                    jobRole:null,
                    jobLocation:null,
                    greetedUser:false,
		    resultsSent: true
		  })
      client.done()
    }
  })

  const goodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye/final')
      client.done()
    }
  })

  client.runFlow({
    classifications: {
      // map inbound message classifications to names of streams
        'greeting/generic':'ensureSteps',
        'provide/searchresults':'ensureSteps',
        'respond/jobrole':'ensureSteps',
        'request/jobinfo':'ensureSteps',
        'goodbye':'end'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'ensureSteps',
      ensureSteps: [greet,getJobRole,getLocation,provideResults],
      end: [goodbye],
    },
  })
}
