# TEMPLATE FOR RETROSPECTIVE (Team P11)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done --> 7 stories committed, 7 done
- Total points committed vs done --> 35 points committed, 35 points done
- Nr of hours planned vs spent (as a team) --> 113h hour  30m planned and about 112h 50 m spent

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD: our definition includes

### Detailed statistics

| Story                                | # Tasks | Points | Hours est. | Hours actual |
| -------------------------------------| ------- | ------ | ---------- | ------------ |
| Transversal stories #0               | 11      | -      | 35h 30m     | 39           |
| Book #7                              | 8       | 8      | 16         | 20h 30m       |
| Insufficient Balance Reminder #8     | 3       | 3      | 4          | 4h 50m        |
| Report availability #9               | 8       | 8      | 11         | 10h 30m       |
| Checks order pending cancelation #10 | 8       | 8      | 18         | 16           |
| Browse availability #11              | 4       | 3      | 12         | 8            |
| Schedule bag delivery #12            | 6       | 3      | 11         | 10           |
| Schedule pick-up #13                 | 4       | 2      | 6          | 4            |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation) --> average estimated: 113/52= 2.17 , standard deviation estimated : 1.34
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table --> 1.006

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated --> 7
  - Total hours spent --> 7
  - Nr of automated unit test cases → 17
  - Coverage (if available)--> 82.8%
- E2E testing:
  - Total hours estimated --> 7
  - Total hours spent --> 7
- Code review
  - Total hours estimated --> 10
  - Total hours spent --> 12
- Technical Debt management:
  - Total hours estimated--> 5
  - Total hours spent--> 7
  - Hours estimated for remediation by SonarQube--> 0
  - Hours estimated for remediation by SonarQube only for the selected and planned  issues--> 0
  - Hours spent on remediation--> 0
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") →  0.2%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) → AAA

## ASSESSMENT

- What caused your errors in estimation (if any)?
  We spent more time than what we estimated on some tasks and less on others, but the total balanced to the original value.

- What lessons did you learn (both positive and negative) in this sprint?
We learnt to exchange feedback during the work in order to update the other group's member about the development of their tasks.

- Which improvement goals set in the previous retrospective were you able to achieve?
  We managed to estimate the tasks better and using dedicated tasks for testing and other chore activities.

- Which ones were you not able to achieve? Why?
  Our only goal was met.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
We would like to dedicate more time to improving user experience flow and validations.

> Propose one or two

- One thing you are proud of as a Team!!
  The team's harmony.
  The team's chemistry.
