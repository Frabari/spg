# TEMPLATE FOR RETROSPECTIVE (Team P11)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done --> 10 stories committed, 9 done
- Total points committed vs done --> 43 points committed, 38 points done
- Nr of hours planned vs spent (as a team) --> 112h hour planned and 109h spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD: our definition includes

### Detailed statistics

| Story                                | # Tasks | Points | Hours est. | Hours actual |
| -------------------------------------| ------- | ------ | ---------- | ------------ |
| Transversal stories #0               | 17      | -      | 47         | 46h 50m      |
| Confirm booking #14                  | 9       | 5      | 17         | 18h 30m      |
| Acknowledge delivery #15             | 3       | 2      | 7          | 7h 30m       |
| Booking change #16                   | 4       | 5      | 10         | 10h 30m      |
| Confirm preparation #17              | 1       | 1      | 4          | 2            |
| Confirm pick up preparation #18      | 3       | 3      | 6          | 6            |
| Confirmation #19                     | 1       | 2      | 1          | 2            |
| Check pick up schedule  #20          | 2       | 2      | 5          | 7h 30m       |
| Missed pick up  #21                  | 1       | 5      | 1          | 1            |
| Select farmers #22                   | 3       | 5      | 6          | 0            |
| Notification #23                     | 2       | 13     | 7          | 7            |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation) --> average estimated: 109/46= 2.37 , standard deviation estimated : 1.812
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table --> 1.027

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated --> 10
  - Total hours spent --> 10
  - Nr of automated unit test cases → 6
  - Coverage (if available)--> 71.5% 
- E2E testing:
  - Total hours estimated --> 10
  - Total hours spent --> 6
- Code review
  - Total hours estimated --> 10
  - Total hours spent --> 17
- Technical Debt management:
  - Total hours estimated--> 10
  - Total hours spent--> 7
  - Hours estimated for remediation by SonarQube--> 0
  - Hours estimated for remediation by SonarQube only for the selected and planned  issues--> 0
  - Hours spent on remediation--> 0
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") →  0.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) → AAA

## ASSESSMENT

- What caused your errors in estimation (if any)?
  Some tasks required more time than we estimated due to some difficulties found during their development.
 
- What lessons did you learn (both positive and negative) in this sprint?
  We must prepare the data for the presentation in a better way.

- Which improvement goals set in the previous retrospective were you able to achieve?
  We improved the management of virtual clock, but this led to a worst usability flow for testing and presentation purposes.
  The validations needs to be improved but many of them are done and work in a correct way.

- Which ones were you not able to achieve? Why?
  

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  We should improve the Sonar Coverage, adding more test and checking those implemented yet.
  Moreover a better coordination between all member of the group is needed.

> Propose one or two

- One thing you are proud of as a Team!!
  We are proud of all good feedback that we received during the demos.
  
