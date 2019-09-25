# API Wrapper Project

This project is simply meant to be an organizing project for useful utilities related to developing extensions and the embedding API. It makes the assumption that you have cloned it next to the api-platform-js, api-external-js, and api-internal-contract-js projects and provides a Visual Studio Code [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) for organization.

An outline of the modules we use can be found on the wiki [here](https://mytableau.tableaucorp.com/x/gQekCQ).


## Quick Start

After cloning this repository, do the following:

1. Make sure you have yarn & NodeJS installed.
2. If you haven't yet, clone the `api-platform-js`, `api-external-js`, & `api-internal-contract-js` repos in the parent directory of this project.
  - `cd ..`
  - `git clone https://gitlab.tableausoftware.com/extensibility/api-external-js`
  - `git clone https://gitlab.tableausoftware.com/extensibility/api-platform-js`
  - `git clone https://gitlab.tableausoftware.com/extensibility/api-internal-contract-js`
  - `cd api-js-wrapper`
3. `yarn install`
4. Open the `api-js-wrapper.code-workspace` workspace file in Visual Studio Code. **Note**: this requires version 1.18+ of Visual Studio Code.
5. `yarn link-projects` - Uses the `yarn-link` command to have the external and platform modules use the local version of the internal project.
6. `yarn yarn-cmd build` - Runs yarn build in api-platform-js, api-external-js and api-internal-contract-js.
7. `yarn dev` - Runs `compile-watch` and `dev-server` concurrently so you can serve your content and get things rebuilt whenever changes occcur.

You can open trex files from api-js-wrapper/examples/manifests and they should work correctly.


## Local Development Workflow

### Setup
This section assumes that you will be making changes to all three projects (internal, external, and platform).  This will most commonly be the case, 
especially when adding a new feature.  If you only need to touch one of these projects, this workflow can be simplified accordingly.  For example,
if you only needed to fix a bug in api-external-js, you could skip the portion about linking api-platform-js.

1. Follow the Quick Start section above such that you have a running dev server. To test, open Tableau, add a new Extension to a dashboard, and select one of the test extensions (i.e. api-js-wrapper/examples/manifests/simple.trex).
2. Run `yarn git-cmd pull` if you don't have the latest changes.
3. `yarn git-cmd checkout -b myUsername/branchNameForMyChange` - This will create a new branch off of the master branch where you can make changes.  This happens in each of the three project repositories.  If you only need to change one project, you can create the branch in that project directly.
4. Now, make a change in one of the TypeScript files, and watch the projects automatically recompile. As a test, you could change the definition of the name getter in `api-external-js/src/ApiShared/Impl/SheetImpl.ts`.  Then, reload the simple.trex extension to see the changes in Desktop.

### Local linking to new versions of api-internal-contract.js
A common practice is to use yarn link to test a local version of api-internal-contract.js. However, there is a nice new tool that works very well. Follow the instructions here: https://gitlab.tableausoftware.com/browser-clients/npm-pack-here. One item to note: Do not edit the dependency version in platform or external manually. Use the commands with npm-pack to update the dependency version.

### Link Server and Desktop builds to local version of api-platform-js
In order to test the Tabelau products with your local changes before publishing the module to artifactory, you will need to use yarn link (or yarn add for Server) to point Desktop and Server to your local version
of api-platform-js, which is the only module they consume directly.  Ensure that module is built.

This is the same workflow that you use for developing hybrid dialogs locally, so please follow the documentation created by the Hybrid Dialogs team: 
[Hybrid Dialog Local Development Workflow](https://mytableau.tableaucorp.com/x/ohVbC).

Follow the setup steps for both Server and Desktop, using the package @tableau/api-platform-js as the local module you are linking.

After you have completed that, you will be able to run both Server and Desktop, with each product pointing to the local version of the api-platform-js that you are making changes to.


### Submitting your changes to GitLab

When your changes are complete with tests, you are ready to submit your change for review. You'll need to do these steps in each of the three projects where you have made changes.

1. `cd ../api-external-js` - or internal or platform (depending on where your changes are).
2. Update the version number in the package.json file, following semver.
3. Add/remove your changes via `git add` and/or `git rm`.
4. `git commit -m "some descriptive message about your change"` to commit your changes to that local branch.
5. `git push origin myUsername/branchNameForMyChange` to push your local changes to the remote.
6. Create a merge request through the GitLab web UI - you'll be merging myUsername/branchNameForMyChange into master.
7. Have someone review and approve the change and then merge the changes. This will publish a new version of the module to artifactory.


### Submitting your changes to the Monolith

At this point, we have a newly published module with our changes in Artifactory.  We need to now stop using the linked modules we setup previously, and tell the monolith
to start consuming the new module in Artifactory.

1. Similar to how you previously linked the modules, follow the same guide to unlink: [Hybrid Dialog Local Development Workflow](https://mytableau.tableaucorp.com/display/devcode/Hybrid+Dialog+Local+Development+Workflow).
2. P4 edit the following:
    a. `\modules\web\plugin-host-desktop\package.json`
    b. `\modules\web\plugin-host-desktop\yarn.lock`
    c. `\workgroup\vqlweb\scriptsharp\package.json`
    d. `\workgroup\vqlweb\scriptsharp\yarn.lock`
3. Update the version of the api-platform-js module to the newly published version in the two package.json files from above.
4. Build, validate, then submit your changes.

## Other Useful Scripts

- `yarn git-cmd {command}` - Runs a generic git command in all three of the projects.
- `yarn yarn-cmd {command}` - Runs a generic yarn command in all three of the projects.
- `yarn bundle-platform-and-external` - This script takes the outputs of the 3 projects and bundles all of them together, calling the desktop bootstrap function when loaded. Essentially, this is what we ship to customers to include before we have the ability to inject things in desktop.
- `yarn compile-watch` - Runs `yarn compile-watch` in all the submodules of this project so you get things to rebuild and package whenever you make changes.
- `yarn dev-server` - Runs a localhost server on port 7755 which will serve the extensions libs and the examples in this repo.
- `yarn unlink-projects` - Uses `yarn unlink` to undo the linking which was performed in `yarn link-projects`.

## Extensions Release Guide
Currently this is a manual process.

We will review if we should release a new public version of the library every month. This corresponds to the Prep release cycle that happens on the first Tuesday. Releases will not show internal churn. They will be sequential based on semantic versioning.

1. **Collect** a list of changes since the last release. This can be found by looking at all commits to master since the last release.  This could also include TFS only items - for example, a bug fix in c++ code that didn't require any TypeScript changes. Send this list to Dave for making release notes for the public docs site.
2. **Download** the desired build of the @tableau/api-external-js project from Artifactory, and extract the contents (7zip works well).
3. In github/dev branch, **copy** the files in the <extracted_package_path>/dist-extensions folder into the lib folder of the extensions-api project.
4. In github/dev branch, **delete** the old tableau-extensions-1.latest.js (and its min counterpart) and replace it with the a file of the same name but with the new version's contents. If we are going to version 2 of external, change tableau-extensions-1.latest.js to tableau-extensions-2.latest.js. 
5. In github/dev branch, **move** the previous version(s) of the libraries from extensions-api/lib to extensions-api/lib/previous.
6. In github/dev branch, **copy** all of the contents of <extracted_package_path>/docs-extensions to extensions-api/docs. Overwrite the existing files and folders.
7. `npm update @tableau/extensions-api-types` with registry pointing to our internal prod artifactory so that we can test the samples **before** we publish the types to NPM.
8. **Verify** all of the existing samples work properly with the new version of the api-external library and types library against the versions of desktop and server that we are about to release. This purpose of this exercise is to lightly validate the samples work with the new library. **Ideally they should have already been updated and tested with corresponding changes to the external API anyway.**
    a. Javascript Samples are located at Public Github (extensions-api)/Samples/
    b. Typescript Samples are located at Public Github (extensions-api)/Samples-Typescript
9. Run `yarn release-types-npm` command from api-external-js to publish the latest types module to npm. Currently btaylor, jdance, and asekar have permission to publish to npm.
10. Update the github project to point to the newly published @tableau/extensions-api-types on npm.
11. Submit a new **pull request** from dev to master for the public repo and merge when ready. Doc changes should already be done and merged to dev by this point.
12. After the merge, **create a new release and tag** on GitHub in the form 'vX.Y.Z', i.e. 'v1.1.0'.
13. If this is a patch release for previous Tableau release, follow the steps in *Branching* below in the `api-platform-js` and `api-internal-contract-js`.

## Versioning and Branching Strategy

The Typescript modules are
```
api-external-js
api-internal-contract-js
api-platform-js
extensions-api-types
```
`api-external-js` is included in the extension application, and will be made available on a CDN. `api-platform-js` is bundled with Tableau (both desktop or server). `api-internal-contract-js` is packaged with both `api-external-js` and `api-platform-js`.
`extensions-api-types` is a sub-module under `api-external-js` and is included with our Extensions SDK to aid in developing extensions using Typescript.

At the time that the near branch moves to the next release, we perform the following steps. The details of which are described in the next sections:
1. Create a branch for the release for `api-platform-js`, `api-internal-contract-js`, `api-external-js`, and `api-js-wrapper`.
2. Create a release tag for `api-platform-js`, `api-internal-contract-js`, `api-external-js`, and `api-js-wrapper`.

### Versioning 

At the 2018.2 release, the external library will bump to version 1.0.0. That version will increment as we make changes in that library or in the internal-contract library. We use semantic versioning. (See https://semver.org/) Semantic versioning uses a major, minor, and patch version scheme. The major number changes when a breaking change is made. The minor number changes when new capabilities are added, and the patch number is changed for bug fixes. Our goal is to use semantic versioning for both `api-external-js` and `api-internal-contract-js` modules, and "Nerv" versioning for `api-platform-js`. (See https://mytableau.tableaucorp.com/display/devft/Maintenance+Development+in+Nerv). To allow for patches in maintenance releases in `api-platform-js`, we increment the minor number on every change, and every release. However, if we need to "backport" a change made in `api-internal-contract-js`, we just update the version used to the latest minor version that includes that change. Notice that if the needed change was introduced after a major update, we will need to backport that change to a branch that is made off the previous version. For example, suppose that we introduced a fix in 2.2, but need to back port that to a release that uses 1.5. In that case we need to create a branch at version 1.5, port the changes and update to 1.6 (or 1.5.1).

The version used for a specific Tableau release can be found by looking in `modules/web/plugin-host-desktop/package.json` for that release, or by looking at the version in the appropriate release branch.

In summary:
* `api-platform-js` : Nerv versioning. A maintenance release branches from the appropriate version and adds a patch number.
* `api-internal-contract-js` : Semantic versioning. A maintenance release takes the first minor version that includes the needed change. 
* `api-external-js` : Semantic versioning. There are no maintenance releases or backporting. `api-external-js` can be released on github as needed. Format: `<major>.<minor>.<patch>+<build>`
* `extensions-api-types` : Semantic versioning. There are no maintenance releases or backporting. Follows the major and minor version of `api-external-js`

When updating a new version of `api-external-js`, semantic versioning will be followed based on the 'last released version'. A version updating script is provided for convenience. This script also updates the version number of `extensions-api-types`
```
    > yarn ver --[major | minor | fix] --types(Optional)
```

Full version process (which the script follows):
* Check github for our last released version number `released` e.g. 1.0.0
* Check current version of `api-external-js` (left of `build` number) `current` e.g. 1.1.0+3
* Increment `build` number for every revision. This number resets to zero anytime the semver version would change.
* Legend for version changes: (`released`, `current`) -> `new current`
* If your revision **breaks** the `released` api: If the delta between **major** versions is zero, adjust the **major** version +1. Set **minor** and patch to zero.
  * e.g. (1.0.0, 1.0.0+4) -> 2.0.0+0, (1.0.0, 1.0.1+4) -> 2.0.0+0, (1.0.0, 1.1.0+4) -> 2.0.0+0, (1.0.0, 2.0.0+4) -> 2.0.0+5
* If your revision **adds functionality** to the `released` api: If the delta between **major** and **minor** versions is zero, adjust the **minor** version +1. Set **patch** to zero. 
  * e.g. (1.0.0, 1.0.0+4) -> 1.1.0+0, (1.0.0, 1.0.1+4) -> 1.1.0+0, (1.0.0, 1.1.0+4) -> 1.1.0+5, (1.0.0, 2.0.0+4) -> 2.0.0+5
* If your revision **is a patch** to the `released` api: If the delta between **major**, **minor** and **patch** versions is zero, adjust the **patch** version +1.
  * e.g. (1.0.0, 1.0.0+4) -> 1.0.1+0, (1.0.0, 1.0.1+4) -> 1.0.1+5, (1.0.0, 1.1.0+4) -> 1.1.0+5, (1.0.0, 2.0.0+4) -> 2.0.0+5

Full version process of Types (which the script follows):
* This follows the same process as above, excepting **patch**.
* Bump up the **patch** version by 1, every time there are source changes under public_npm_modules/extensions-api-types

### Version Handling

We have version handling code in `api-internal-contract-js` that checks the version of the internal-contract embedded in external, and the version embedded in the platform code. If the external has a major version greater than the platform, we throw an error. If the external has a major version smaller than the platform, we go through some upgrade/downgrade functions to convert commands and/or pres-models to their appropriate formats for the external version. However, the version of `api-internal-contract-js` is not visible to the developer or user, so the version of `api-external-js` must reflect changes to the contract.

For a more in-depth discussion about versioning, see: [Extension Versioning](https://tableau.sharepoint.com/:w:/r/sites/Development/DeveloperPlatform/_layouts/15/Doc.aspx?sourcedoc=%7BF9AF78BA-4DA5-4462-999F-EA7AB4637599%7D&file=Extension%20Versioning.docx&action=default&mobileredirect=true)

### Branching

We do **not** create new branches for every Tableau release. This will be done on-demand when necessary to patch a previous release. This likely only affects the internal APIs.

When we create a release branch, we use that current release name. (For example: `2018-2-release`.)

We use the GitLab "Release branches with GitLab flow" method for release branching, (see 
https://docs.gitlab.com/ee/workflow/gitlab_flow.html#release-branches-with-gitlab-flow) and follow the 11 rules of GitLab flow. (See https://about.gitlab.com/2016/07/27/the-11-rules-of-gitlab-flow/). For releases, the key points are:
- (item 6) Tags are set by the user, not by CI.
- (item 7) Releases are based on tags.
- (item 10) Fix bugs in master first and release branches second.

There are two options for creating branches and tags: commandline or using the gitlab UI. Do the following for the platform and internal-contract repositories.
Option 1 - Commandline branch and tag:
1. Create a branch with the appropriate name
- `git checkout -b yyyy-n-release`
- `git push --set-upstream origin yyyy-n-release`
2. Create a tag for that branch
- git tag -a yyyy-n-release-tag -m "Create release version yyyy-n-release"
- git push origin --tag
- (make sure the tag name and branch name are different, git can be confused by references with the same names)

Option 2 - Using the giblab UI:
1. Create a branch with the appropriate name
-  https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-new-branch-from-a-project-s-dashboard
2. Create a tag for that branch
- https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-new-tag

As changes need to be made to that branch, we can use the cherry pick approach from master to branch.
https://docs.gitlab.com/ee/user/project/merge_requests/cherry_pick_changes.html

## Support for InternetExplorer 11

InternetExplorer 11 does not support ECMAScript 6, so we need a polyfill for any es6 functionality that we use.
Rather than pull in all of core-js, we pull in only those functions that we use. Currently, there is no great
way to automatically test any future changes that we make. While we have plans to automatically test against IE11 in the future, the following guidelines will help us not introduce regressions.

1.  In tsconfig.json, only specify es5 for the library, and then pull in additional specific es2015 functionality as needed. This will give us compile errors for any new functionality that we add. Unfortunately, notice that es2015.core includes Number, Math, Object, and Array, so any additional dependencies on es6 functionality there won't be caught at compile-time.
2. As we add new functionality, specify in tsconfig.json the specific functionality upon which you are depending. For example, if we use Promise, Array.find and Object.assign, the compilerOptions.lib should have: `"es2015.promise", "es2015.core" // Array.find, Object.assign`. Specify the functions you depend upon in es2015.core in the comments.
3. Do a local test with IE11 before checkin. Unfortunately, we cannot have this in the normal build, because it won't work on Macintosh and Linux. To do a local test with IE11, do the following:
a. `yarn add karma-ie-launcher --dev` # add karma-ie-launcher to package.json
b. Add "IE" to the list of browsers in package.json   `"jasmine": {"browsers": ["ChromeHeadless", "IE"]}`
c. `yarn build`
4. Add any specific function polyfills needed to the list in the appropriate project to get tests to pass. Please add them all in the same location(s). You will find the polyfills needed for each project in `JsApiPlatform.js`, `ExtensionsApi.ts`, and `JsApiInternalContract.ts` (or search for "polyfills"). Here are the pollyfill imports for api-external-js in ExtensionsApi.ts:
```
  // The following polyfills are needed for IE11
  import 'core-js/fn/promise';
  import 'core-js/fn/array/find';
  import 'core-js/fn/object/assign';
```

## Examples

There are several examples in the examples directory whch can be used for local testing of extension functionality. These are:

1. simple.trex: A minimal extension, all it does is initialize and grab the name of a dashboard.  This is useful for testing bootstrapping code.
2. local.trex: Collection of most API calls, useful for testing individual API features.
3. uiExample.trex: tests all features of the UI namespace.
4. autoTest.trex: A test suite that runs through many API calls and displays the result. This is useful for automated testing on different browsers and platforms. This should be used with ExtensionAutoTest.twbx.
5. autoTestNoData.trex: A duplicate of autoText.trex, but without specifying full data access so it can run without
special permissions on server (but will fail the getUnderlyingDataAsync test).