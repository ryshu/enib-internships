---
id: api-services-fsm
title: Internships
---

Details of methods to handle **internship** service. The internship service is a finite-state machine used to handle all case of internship state in the application.

All this service turn around the following schema:

![finite-state machine schema](../img/fsm.png)

## INTERNSHIP_MODE

| Name | Value | Comment |
| ---- | ----- | ------- |
| WAITING | waiting | Internship wait to be published |
| PUBLISHED | published | Internship is published |
| ATTRIBUTED_STUDENT | attributed_student | Internship is attributed to a student |
| AVAILABLE_CAMPAIGN | available_campaign | Internship is available to be attributed in a campaign |
| ATTRIBUTED_MENTOR | attributed_mentor | Internship is attributed to a mentor |
| RUNNING | running | Student is actually in progress |
| VALIDATION | validation | Student is actually in validation |
| ARCHIVED | archived | Student is actually archived |

## INTERNSHIP_RESULT

| Name | Value | Comment |
| ---- | ----- | ------- |
| VALIDATED | validated | Internship is validated |
| NON_VALIDATED | non-validated | Internship ins't validated |
| UNKNOWN | unknown | Internship result is unknown |
| CANCELED | canceled | Internship have been canceled |

## InternshipHandler

The internship handler is an object used to manage and be able to change every state of an internship

### new InternshipHandler()

Initialize and internship state handler using, as first params, the internship to initialize
Return object himself to be able to chain methods

### #.toWaiting()

Change current internship state to waiting state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

### #.toPublished()

Change current internship state to published state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

### #.toAttributedStudent()

Change current internship state to attributed student state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

#### Params

This function take the student id as param

### #.toCampaignAvailable()

Change current internship state to available in campagne state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

#### Params

This function take the campaign id as param

### #.toAttributedMentor()

Change current internship state to attributed mentor state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

#### Params

This function take the mentor id as param

### #.toRunning()

Change current internship state to running state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

#### Params

This function take the end date of internship as param

### #.toValidation()

Change current internship state to validation state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

### #.archive()

Change current internship state to archived state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
Return object himself to be able to chain methods

#### Params

This function take the result of the internship as param
See [INTERNSHIP_RESLUT](#INTERNSHIP_RESLUT) for more detail about result

### #.save()

Update selected internship in database and sync both.
Return object himself to be able to chain methods

### #.toJSON()

Return object with only all his own propreties

### #.state

Getter, retrieve current internship state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail

### #.nextState

Getter, retrieve next internship state
See [INTERNSHIP_MODE](#INTERNSHIP_MODE) for more detail
