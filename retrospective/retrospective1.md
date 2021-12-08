TEMPLATE FOR RETROSPECTIVE (Team P11)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done -->  6 stories committed vs 6 stories done
- Total points committed vs done --> 42 points committed vs 42 points done
- Nr of hours planned vs spent (as a team) -> 109 hours planned vs 95h 45m spent

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD:
The frontend testing environment has been prepared in expectation of the complete API logic that we need in order to exhaustively test all the branch conditions in our custom hooks.

### Detailed statistics

| Story                      | # Tasks | Points | Hours est. | Hours actual |
|----------------------------|---------|--------|------------|--------------|
| Transversal tasks #0       | 22      | -      | 39         | 34.15        |
| Enter client order #1      | 6       | 8      | 20         | 18           |
| Enter new client #2        | 8       | 8      | 15         | 12.30        |
| Browse product in shop #3  | 9       | 13     | 19         | 15           |
| Product given to client #4 | 2       | 5      | 5          | 3.30         |
| Wallet top-up #5           | 3       | 3      | 8          | 8            |
| Registration #6            | 1       | 5      | 3          | 4.30
  

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)--> average estimated: 109/49 = 2.22 , average actual: 95.45/49 = 1.95 , standard deviation estimated = 1.006 , standard deviation actual = 1.197 
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table--> 109/95.45= 1.14 

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated --> 8h
  - Total hours spent --> 7h
  - Nr of automated unit test cases --> 13 automated unit test cases
  - Coverage (if available) --> 50,2 % (+80 % backend side, see DoD note for frontend side)
- E2E testing:
  - Total hours estimated --> 4h
  - Total hours spent --> 3h 30m
- Code review 
  - Total hours estimated --> 6h
  - Total hours spent --> 8h
- Technical Debt management: 
We enforced technical debt management through automated linting, formatting and Sonar pull request checks so the estimated TD time was part of the corresponding feature tasks
  ~~- Total hours estimated~~
  ~~- Total hours spent~~
  - Hours estimated for remediation by SonarQube --> 0 h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues --> impossible to retrieve for us
  - Hours spent on remediation --> 2 h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") --> 0,2 %
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) --> reliability: A, security: A, maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 

  We had some minor organizational issues.

- What lessons did you learn (both positive and negative) in this sprint? 

  This sprint taught us we should dedicate more time and effort to keep other team members updated about ongoing work and tasks progress. This is also useful to rapidly receive help from other team members in case of need.

- Which improvement goals set in the previous retrospective were you able to achieve? 

  We were able to better manage our work environment, dividing tasks by leveraging the personal skills of all the team members. We reduced the size of the tasks and the amount of people assigned to a task. 

- Which ones you were not able to achieve? Why?

	We are fairly satisfied with out improvements even though we can still improve the organization of tasks.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

 We would like to better organize non-development activities in more targeted tasks to improve assignments and time management.

> Propose one or two

- One thing you are proud of as a Team!!

	We are happy that we are learning new skills and sharing experiences with other team members.
