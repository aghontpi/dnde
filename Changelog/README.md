# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.0.0-alpha.2] - (Oct 25,2021)

### Added

- Add logo (9638669)
- add custom fonts to support on the fly changes to inline editor. (beae200)
- add custom font popover to controlled popover (3767b36)
- Add scroll to body attributes (bcbc8f6)
- Add fonts add/remove feature to body config (02741d4)
- add custom fonts init (889de11)
- add UndoRedo for changes in body config tab (5f5028e)
- Add 'Mod title' to body/html attributes (e2ce37e)
- add body attributes to new ui (15e0fc5)
- add Image for new sectionV2 layout (aa2696c)
- new editor design (22d0f48)
- add Mod line height (f60368e)
- add prettier config (3b94f6f)

### Changes

- Update readme for alpha.2 release (d5317e8)
- refactor fonts for all 'text-tags' to use 'font-family: ...listofall-font-family-configued-and-extra-added'; (3024a04)
- Update usefont hook to support dynamic fonts (8eb23d8)
- use minWidth style attributes instead of 'dropdownMatchSelectWidth' (ae435e0)
- remove inline editor font dropdown width wrap code style update (c595b1f) - Contributed by @[FROSTIN](https://github.com/FR0ST1N)
- removed default fonts (203efe1) - Contributed by @[FROSTIN](https://github.com/FR0ST1N)
- sort font list (8d214ca) - Contributed by @[FROSTIN](https://github.com/FR0ST1N)
- Modify localStorage to only contain last item to recover from crash. (2061500)
- Update Import logic for mjml Processor (a0c3103)
- set default email title as dnde-editor (14e93ac)
- untill dummy drag and drop icon is created, showing the actual image being dragged (8e47f16)
- usememo causes cpu overhead on mouseHover, removed it (878ec5d)
- column config shows previous section's config, changed info messages to new ui. (e191e8f)
- Change how visibility & path state variables are handled in 'useVisibility Hook' for body attributes. (964d2e8)
- Merge pull request #15 from Alignment Mod Refactor (90828d4) - Contributed by @[Eswaramoorthy Karthikeyan](https://github.com/EswaramoorthyKarthikeyan)
- change interface name to begin with capital letter and component type from any to ReactNode. (7985402)
- Change layout of tabs 'top' to 'right' (f6f9443)
- remove error handling mechanism of storeToLocalStorage. rnd and handle it differently since browsers can not handle more than 5MB to local storage (a065b80)
- Alignment changes updated using prettier (5530d1c)
- Bug in antd Drawer inbuilt hook (7ad4d91)
- onMouseOver optimisation (7c7aba5)
- change error message for new layout (b65bcf9)
- handle active hover with stopPropagation instead of mouseEnter and mouseLeave Events (18e5566)
- remove plus sign and increase height of the placeholder indicator showing when the item should be placed. (e6709a6)
- Align options looping (7e1234d) - Contributed by @[Eswaramoorthy Karthikeyan](https://github.com/EswaramoorthyKarthikeyan)
- new indicator to show name of element being hovered. (1006d11)
- update initial state loading (0ee6ea5)
- use hashRouter instead of browser router. (e1aae44)
- dotted to dashed while hover and dragover (b231de1)
- logger output similar to console in array representation, it is difficult to track variables (dbeeb09)
- remove generating preview when exporting as html (4be5864)

### Fixes

- fix crash, item should have children before acesssing children length (ad7aa28)
- Fix crash in lineHeight (d539d64)
- fix for #13 & #5 (5f8f5e0)

## [v0.0.0-alpha.1] - (Oct 20,2021)

### Added

- changes to list page (26f7407)
- change default routing page '/' instead of '/list' (909999d)
- hide sendmail, copy preview for builds, hide editor for devices with screenwidth 1200px (e93e516)
- handle invlaid response (69e7adc)
- landing/list page changes, change font of app throught. (0998afc)
- add options for html2canvas (1d85e3f)
- change padding of default drag and drop image (fc1019b)
- crash #bug regorted (93abb22)
- add restore from lcoal feature, (85bfc5f)
- Preview - center the images, regardless of width, since that can change. (d13185a)
- compare by using underscore, instead of forloop (0b884c6)
- clone config on new load instead of passing it as reference (ec2af25)
- perfomance improvement in dev build (0f6e854)
- use logger instead of console, to control log messages (fc79046)
- load initial undo state when template is first loading (9701bfe)
- prevent text element link navigation in editor mode (02334d8)
- list page (7bddc91)
- list page header design (5461b30)
- reset undoredo on new load (a1c967f)
- add bunch of fonts from google fonts (edc79d7)
- link tag update to editor (0a43350)
- refactor getIndexOfElementInParent (a698508)
- add error boundary to unable to copy. (e8897dd)
- load the template from api (a7588f8)
- integrating /w backend (f8e9de0)
- background image for section listen for visibility instead of active element. (01b738b)
- preview generation (3f4f35a)
- btoa cant handle latin1, included a libary that does. (d6a3b4b)
- when undo/redo remove user selection (9b810ea)
- add border width, border style, border color (aef12ba)
- move importJson from api logic inside useeffect (6f1f253)
- update custom headStyle to include removing default applied underline to a tag (ae8bd75)
- width/height properties to utilize visible callback (9e555c1)
- remvoe padding to divider by default (9192164)
- imported templates processing (91920ce)
- different, but more responsive implementation of getValue (a9c86b7)
- new 3 column layout (df4d3a9)
- prerequiste for loading template from api (afcec97)
- slug to routing, new route -> load new template design (ceaa36c)
- add redux and redux toolkit (832a8b1)
- new template design (129c03e)
- preview design (4344f60)
- react router dom -> list/navigate (b9bf2a2)

## Changes

- update icosn of social (12e27e8)
- indicator for html rerenders (3af3a04)
- content inconsitent, revert back to original except remove cyclic mjmldependency (39afdeb)
- change default html content (a508dc9)
- add social icon (0d24156)
- editor height adjustment (dd2a814)
- fixed position undo redo (70891bc)
- preview for alpha build image (1511ef9)

## [0.0.0-alpha] - (Oct 16,2021)

- Initial alpha release, all functionalities included.
