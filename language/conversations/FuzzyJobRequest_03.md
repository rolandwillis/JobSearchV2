---
title: FuzzyJobRequest_03
timestamp: 2016-11-23T15:01:59.682225424Z
---

hi
* greeting/generic

< hi, how can I help?
* greeting/offerservice

got any jobs mate?
* request/jobinfo_generic

< What kind of job were you after?
* request/jobrole

[engineering](jobrole) type roles
* response/jobrole

< what area should I search?
* request/location

[Bristol](location)
* response/location

< I found [4](jobcount) [engineering](jobrole) jobs near [Bristol](location). Look here >> [http://google.co.uk](searchlink)
* provide/searchresults

thanks
* thanks

< no problem.
* goodbye/temporal
