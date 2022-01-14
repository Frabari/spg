# TEMPLATE FOR RETROSPECTIVE (Team P11)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done --> 7 stories committed, 7 done
- Total points committed vs done --> 63 points committed, 63 points done
- Nr of hours planned vs spent (as a team) --> 112h planned and 111h spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD: our definition includes

### Detailed statistics

| Story                                | # Tasks | Points | Hours est. | Hours actual |
| -------------------------------------| ------- | ------ | ---------- | ------------ |
| Transversal stories #0               | 23      | -      | 76h 30m    | 83h          |
| Telegram update products availability| 6       | 21     | 10h 30m    | 10h          |
| Check unretrieved food               | 3       | 13     | 7h         | 1h           |
| Alert frequent missed pickups        | 3       | 8      | 4h         | 4h           |
| Client order suspension              | 3       | 8      | 6h         | 6h           |
| Telegram balance                     | 1       | 5      | 3h         | 3h           |
| Telegram Confirmation                | 1       | 3      | 2h         | 2h           |
| Telegram reminder                    | 1       | 5      | 3h         | 2h           |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation) --> average spent: 112/41= 2.73 , standard deviation spent: 2.48
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table --> 1.009

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated --> 5
  - Total hours spent --> 7
  - Nr of automated unit test cases → 8
  - Coverage (if available)--> 71.7%
- E2E testing:
  - Total hours estimated --> 0
  - Total hours spent --> 0
- Code review
  - Total hours estimated --> 8
  - Total hours spent --> 10
- Technical Debt management:
  - Total hours estimated--> 8
  - Total hours spent--> 10
  - Hours estimated for remediation by SonarQube--> 0
  - Hours estimated for remediation by SonarQube only for the selected and planned  issues--> 0
  - Hours spent on remediation--> 0
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") →  0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) → AAA

## ASSESSMENT

- What caused your errors in estimation (if any)?
We had some issues running Docker in different operating systems that took us a lot of time in order to make it work, and this had an impact on the effort spent for other estimated tasks.
 
- What lessons did you learn (both positive and negative) in this sprint?
We had less communication in this sprint and this led to a bit of confusion on some tasks that were partially done twice by different people.
We focused on better preparing the data and the flow needed for the presentation.

- Which improvement goals set in the previous retrospective were you able to achieve?
We managed to have a more organized presentation with a better execution of the application and its telegram integration.

- Which ones were you not able to achieve? Why?
The issues we had in this sprint didn't give us enough time to better focus on the many validations that there are in the application, that were still acceptable at least for presentation purposes.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
We should try to uniform the design and graphics of different pages and of notifications/toasts/alerts.
When someone has a problem of any nature (technical or logical) when developing, should immediately ask others for help, so that encountered problems can be resolved sooner and faster, without getting breathless on the day of the delivery.
The Sonar Coverage didn't grow much, in fact we had to write more tests and improve it. 

- One thing you are proud of as a Team!!
We always received good feedback from the stakeholders and only minor issues and when there is a problem there is always someone that can intervene to help and eventually find a solution.

