# CHANGELOG.md

## 2.0.0
Added functions:
* `agent.updateContact` method to update a task contact created from a template.
* `agent.listTaskTemplates` method to load a list of task templates that belong to a connect instance.
* `agent.getTaskTemplate` method to load a template data, including fields, default values and constraints.

Other changes:
* `agent.createTask` method supports new parameteres and allows to create templated tasks. See README.md for more details.
* `connect.ReferenceType` new reference types supported.
