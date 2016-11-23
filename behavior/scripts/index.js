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
  const getJobRole = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().jobRole)
    },
    extractInfo()
    {
         const jobrole = firstOfEntityRole(client.getMessagePart(), 'jobrole');
         if(jobrole)
         {
           	client.updateConversationState({
		    jobRole: jobrole
		  })
         }
    },
    prompt() {
      client.addResponse('prompt/specify_jobrole')
      client.done()
    }
  })
  
    const getLocation = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().jobLocation)
    },
    extractInfo()
    {
         const joblocation = firstOfEntityRole(client.getMessagePart(), 'city');
         if(joblocation)
         {
           	client.updateConversationState({
		    jobLocation: joblocation
		  })
         }
    },
    prompt() {
      client.addResponse('prompt/specify_city')
      client.done()
    }
  })
    
        const provideResults = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().resultsSent)
    },

    prompt() {
        let searchResults = {
            city : client.getConversationState().jobLocation.value,
            jobcount : "2",
            jobrole: client.getConversationState().jobRole.value,
            jobboardlink:"http://google.co.uk?q=" + client.getConversationState().jobRole.value
        }
        
      client.addResponse('information_response/available_jobs',searchResults)
       	client.updateConversationState({
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
        'information_request/available_jobs':'ensureSteps',
        'response/specify_jobrole':'ensureSteps'
    },
    autoResponses: {
      // configure responses to be automatically sent as predicted by the machine learning model
    },
    streams: {
      main: 'ensureSteps',
      ensureSteps: [getJobRole,getLocation,provideResults],
      end: [goodbye],
    },
  })
}
