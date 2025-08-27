# CHANGELOG.md

## 2.1.0
Added features:
* Complete TypeScript definitions for all library functionality, including TaskSession interfaces, Agent extensions, and comprehensive type coverage for API parameters and responses.
* Build system integration to automatically include TypeScript definitions in distribution packages.
* Support for both CommonJS and ES module imports with proper type declarations.

Compatibility updates:
* Updated minimum Node.js requirement to version 18.0.0 to address compatibility issues with modern build tools.
* Updated build dependencies to latest stable versions, including Babel, webpack, and Jest.
* Resolved build system compatibility issues with recent Node.js versions.

## 2.0.0
Added functions:
* `agent.updateContact` method to update a task contact created from a template.
* `agent.listTaskTemplates` method to load a list of task templates that belong to a connect instance.
* `agent.getTaskTemplate` method to load a template data, including fields, default values and constraints.

Other changes:
* `agent.createTask` method supports new parameteres and allows to create templated tasks. See README.md for more details.
* `connect.ReferenceType` new reference types supported.
