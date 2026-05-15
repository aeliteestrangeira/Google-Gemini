(function () {
  "use strict";

  var collapsedTemplate = "";
  var initialChatContentTemplate = "";
  var CLOSE_ICON_DEFAULT = "side_nav";
  var CLOSE_ICON_HOVER = "side_nav_collapse";
  var NOTEBOOKS_ICON_EXPANDED = "keyboard_arrow_down";
  var NOTEBOOKS_ICON_COLLAPSED = "keyboard_arrow_right";
  var SETTINGS_MENU_WRAPPER_ID = "gemini-settings-menu-expanded-overlay";
  var SETTINGS_MENU_STYLE_ID = "gemini-settings-menu-expanded-style";
  var SETTINGS_MENU_EXPANDED_BOX_STYLE = "inset: auto auto 48px 246px; width: 1120px; height: 599px; align-items: flex-start; justify-content: flex-end;";
  var SETTINGS_MENU_COLLAPSED_BOX_STYLE = "inset: auto auto 88px 10px; width: 1356px; height: 559px; align-items: flex-start; justify-content: flex-end;";
  var SETTINGS_MENU_COLLAPSED_PANEL_CLASS = "mat-mdc-menu-panel collapsed desktop-settings-menu ia-redesign lm-menu-theme mat-menu-above mat-menu-after mat-menu-panel-animations-disabled ng-star-inserted";
  var THEME_SUBMENU_EXPANDED_BOX_STYLE = "inset: 325px auto auto 538px; width: 828px; height: 322px; align-items: flex-start; justify-content: flex-start;";
  var THEME_SUBMENU_COLLAPSED_BOX_STYLE = "inset: 285px auto auto 302px; width: 1064px; height: 362px; align-items: flex-start; justify-content: flex-start;";
  var THEME_SUBMENU_ID = "mat-menu-panel-3";
  var HELP_SUBMENU_EXPANDED_BOX_STYLE = "inset: 469px auto auto 538px; width: 828px; height: 178px; align-items: flex-start; justify-content: flex-start;";
  var HELP_SUBMENU_COLLAPSED_BOX_STYLE = "inset: 429px auto auto 302px; width: 1064px; height: 218px; align-items: flex-start; justify-content: flex-start;";
  var HELP_SUBMENU_ID = "mat-menu-panel-2";
  var PERSONAL_INTELLIGENCE_STYLES_ID = "gemini-personal-intelligence-styles";
  var PERSONAL_INTELLIGENCE_ACTIVE_CLASS = "gemini-personal-intelligence-active";
  var PERSONAL_INTELLIGENCE_TOP_CONTROLS_STYLE_ID = "gemini-personal-intelligence-top-controls-style";
  var SAVED_INFO_STYLES_ID = "gemini-saved-info-styles";
  var EDIT_MEMORY_DIALOG_WRAPPER_ID = "gemini-edit-memory-dialog-overlay";
  var EDIT_MEMORY_DIALOG_STYLE_ID = "gemini-edit-memory-dialog-style";
  var EDIT_MEMORY_DIALOG_EXTRACTED_STYLES_ID = "gemini-edit-memory-dialog-extracted-styles";
  var EDIT_MEMORY_SUBMIT_LOADING_DURATION = 1000;
  var EDIT_MEMORY_INPUT_MIN_HEIGHT = 24;
  var SAVED_INFO_STORAGE_KEY = "gemini-local-saved-info-memories";
  var SAVED_INFO_MEMORY_ENABLED_STORAGE_KEY = "gemini-local-saved-info-memory-enabled";
  var MEMORY_TEXT_DISPLAY_LIMIT = 82;
  var MEMORY_TEXT_TRUNCATED_SUFFIX = "...";
  var MEMORY_ACTIONS_MENU_WRAPPER_ID = "gemini-memory-actions-menu-overlay";
  var MEMORY_ACTIONS_MENU_STYLE_ID = "gemini-memory-actions-menu-style";
  var MEMORY_ACTIONS_MENU_PANEL_ID = "mat-menu-panel-13";
  var DELETE_MEMORY_DIALOG_WRAPPER_ID = "gemini-delete-memory-dialog-overlay";
  var DELETE_MEMORY_DIALOG_STYLE_ID = "gemini-delete-memory-dialog-style";
  var DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID = "gemini-delete-all-memories-dialog-overlay";
  var SAVED_INFO_SNACKBAR_WRAPPER_ID = "gemini-saved-info-snackbar-overlay";
  var SAVED_INFO_SNACKBAR_STYLE_ID = "gemini-saved-info-snackbar-style";
  var SAVED_INFO_SNACKBAR_DURATION = 3000;

  function getSideNavContainer() {
    return document.querySelector("bard-sidenav-container[data-test-id='bard-sidenav-container'], bard-sidenav-container");
  }

  function getOpenButton() {
    return document.querySelector(
      "side-nav-sparkle-button button.side-nav-sparkle-button[aria-label='Abrir barra lateral'], " +
      "button[data-test-id='side-nav-sparkle-button'][aria-label='Abrir barra lateral']"
    );
  }

  function rememberCollapsedTemplate() {
    var container = getSideNavContainer();

    if (!collapsedTemplate && container) {
      collapsedTemplate = container.outerHTML;
    }
  }

  function rememberInitialChatContentTemplate() {
    var content = document.querySelector("bard-sidenav-content");

    if (!initialChatContentTemplate && content && !content.querySelector("personal-intelligence-page, saved-info-page")) {
      initialChatContentTemplate = content.outerHTML;
    }
  }

  function ensureCloseButtonStyles() {
    if (document.getElementById("gemini-sidenav-close-hover-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "gemini-sidenav-close-hover-style";
    style.textContent = [
      "bard-sidenav .sidenav-with-history-container {",
      "  position: relative;",
      "}",
      "bard-sidenav button.close-sidenav-button.close-sidenav-button-desktop,",
      "bard-sidenav button[aria-label='Fechar barra lateral'] {",
      "  position: absolute !important;",
      "  top: var(--gem-sys-spacing--s, 8px) !important;",
      "  inset-inline-end: 14px !important;",
      "  z-index: 100 !important;",
      "  pointer-events: auto !important;",
      "  visibility: visible !important;",
      "  opacity: 1 !important;",
      "  cursor: pointer !important;",
      "}",
      "bard-sidenav button.close-sidenav-button.close-sidenav-button-desktop mat-icon,",
      "bard-sidenav button[aria-label='Fechar barra lateral'] mat-icon {",
      "  pointer-events: none;",
      "}",
      "bard-sidenav button.close-sidenav-button.close-sidenav-button-desktop:hover mat-icon.mat-ligature-font[fonticon]::before,",
      "bard-sidenav button.close-sidenav-button.close-sidenav-button-desktop:focus-visible mat-icon.mat-ligature-font[fonticon]::before,",
      "bard-sidenav button[aria-label='Fechar barra lateral']:hover mat-icon.mat-ligature-font[fonticon]::before,",
      "bard-sidenav button[aria-label='Fechar barra lateral']:focus-visible mat-icon.mat-ligature-font[fonticon]::before {",
      "  content: 'side_nav_collapse' !important;",
      "}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function ensureSettingsMenuStyles() {
    if (document.getElementById(SETTINGS_MENU_STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");
    style.id = SETTINGS_MENU_STYLE_ID;
    style.textContent = [
      "#" + SETTINGS_MENU_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1200;",
      "  pointer-events: none;",
      "}",
      "#" + SETTINGS_MENU_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "  z-index: inherit;",
      "  pointer-events: none;",
      "}",
      "#" + SETTINGS_MENU_WRAPPER_ID + " .cdk-overlay-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "  pointer-events: auto;",
      "}",
      "#" + SETTINGS_MENU_WRAPPER_ID + " .cdk-overlay-connected-position-bounding-box {",
      "  position: absolute;",
      "  display: flex;",
      "  pointer-events: none;",
      "}",
      "#" + SETTINGS_MENU_WRAPPER_ID + " .cdk-overlay-pane,",
      "#" + SETTINGS_MENU_WRAPPER_ID + " .mat-mdc-menu-panel {",
      "  pointer-events: auto;",
      "}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function getSettingsMenuWrapper() {
    return document.getElementById(SETTINGS_MENU_WRAPPER_ID);
  }

  function getSettingsButton(target) {
    return target && target.closest
      ? target.closest("bard-sidenav button[data-test-id='mavatar-footer-settings-button'], bard-sidenav button[aria-label='Configurações']")
      : null;
  }

  function getPersonalIntelligenceMenuItem(target) {
    return target && target.closest
      ? target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " a[href='/u/4/personalization-settings'], #" + SETTINGS_MENU_WRAPPER_ID + " a[href$='/personalization-settings']")
      : null;
  }

  function getSavedInfoLink(target) {
    return target && target.closest
      ? target.closest("personal-intelligence-page a[href='/u/4/saved-info'], personal-intelligence-page a[href$='/saved-info'], personal-intelligence-page a[routerlink='/saved-info']")
      : null;
  }

  function getNewChatButton(target) {
    return target && target.closest
      ? target.closest("bard-sidenav gem-nav-list-item[data-test-id='new-chat-button'] a, bard-sidenav gem-nav-list-item[data-test-id='new-chat-button'] button, bard-sidenav gem-nav-list-item[data-test-id='new-chat-button']")
      : null;
  }

  function getSavedInfoAddButton(target) {
    return target && target.closest
      ? target.closest("saved-info-page button.create-memory-button")
      : null;
  }

  function getDeleteAllMemoriesButton(target) {
    return target && target.closest
      ? target.closest("saved-info-page button.delete-all-memories-button")
      : null;
  }

  function getMemoryActionsButton(target) {
    return target && target.closest
      ? target.closest("saved-info-page button.memory-actions-button")
      : null;
  }

  function getMemoryActionDeleteButton(target) {
    return target && target.closest
      ? target.closest("#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " button.delete-button[data-test-id='delete-button']")
      : null;
  }

  function getMemoryActionEditButton(target) {
    return target && target.closest
      ? target.closest("#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " button.edit-button[data-test-id='edit-button']")
      : null;
  }

  function getDeleteMemoryDialogWrapper() {
    return document.getElementById(DELETE_MEMORY_DIALOG_WRAPPER_ID);
  }

  function getDeleteAllMemoriesDialogWrapper() {
    return document.getElementById(DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID);
  }

  function getDeleteMemoryCancelButton(target) {
    return target && target.closest
      ? target.closest("#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button[data-test-id='cancel-button'] button")
      : null;
  }

  function getDeleteMemoryConfirmButton(target) {
    return target && target.closest
      ? target.closest("#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button[data-test-id='confirm-button'] button")
      : null;
  }

  function getDeleteAllMemoriesCancelButton(target) {
    var button = target && target.closest
      ? target.closest("#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button")
      : null;

    return button && button.textContent.indexOf("Cancelar") !== -1 ? button : null;
  }

  function getDeleteAllMemoriesConfirmButton(target) {
    var button = target && target.closest
      ? target.closest("#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button")
      : null;

    return button && button.textContent.indexOf("Excluir tudo") !== -1 ? button : null;
  }

  function getSavedInfoSnackbarWrapper() {
    return document.getElementById(SAVED_INFO_SNACKBAR_WRAPPER_ID);
  }

  function getEditMemoryDialogWrapper() {
    return document.getElementById(EDIT_MEMORY_DIALOG_WRAPPER_ID);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getSavedMemories() {
    var parsed;

    try {
      parsed = JSON.parse(window.localStorage.getItem(SAVED_INFO_STORAGE_KEY) || "[]");
    } catch (error) {
      parsed = [];
    }

    return Array.isArray(parsed)
      ? parsed.filter(function (memory) {
        return typeof memory === "string" && memory.trim().length > 0;
      })
      : [];
  }

  function setSavedMemories(memories) {
    window.localStorage.setItem(SAVED_INFO_STORAGE_KEY, JSON.stringify(memories));
  }

  function addSavedMemory(memory) {
    var text = String(memory || "").trim();
    var memories;

    if (!text) {
      return;
    }

    memories = getSavedMemories();
    memories.push(text);
    setSavedMemories(memories);
  }

  function getMemoryDisplayText(memory) {
    var text = String(memory || "").trim();

    if (text.length <= MEMORY_TEXT_DISPLAY_LIMIT) {
      return text;
    }

    return text.slice(0, MEMORY_TEXT_DISPLAY_LIMIT).trimEnd() + MEMORY_TEXT_TRUNCATED_SUFFIX;
  }

  function deleteSavedMemory(index) {
    var memories = getSavedMemories();

    if (index < 0 || index >= memories.length) {
      return;
    }

    memories.splice(index, 1);
    setSavedMemories(memories);
  }

  function updateSavedMemory(index, memory) {
    var text = String(memory || "").trim();
    var memories = getSavedMemories();

    if (!text || index < 0 || index >= memories.length) {
      return;
    }

    memories[index] = text;
    setSavedMemories(memories);
  }

  function ensureSavedInfoSnackbarStyle() {
    var style;

    if (document.getElementById(SAVED_INFO_SNACKBAR_STYLE_ID)) {
      return;
    }

    style = document.createElement("style");
    style.id = SAVED_INFO_SNACKBAR_STYLE_ID;
    style.textContent = [
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1600;",
      "  pointer-events: none;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .cdk-global-overlay-wrapper {",
      "  position: absolute;",
      "  inset: 0;",
      "  display: flex;",
      "  pointer-events: none;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .cdk-overlay-pane {",
      "  pointer-events: auto;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .mat-mdc-snack-bar-container {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  box-sizing: border-box;",
      "  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);",
      "  margin: 8px;",
      "  --mat-snack-bar-container-shape: var(--gem-sys-shape--corner-large);",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .mdc-snackbar__surface {",
      "  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: flex-start;",
      "  box-sizing: border-box;",
      "  padding-left: 0;",
      "  padding-right: var(--gem-sys-spacing--m, 16px);",
      "  min-width: 344px;",
      "  max-width: 672px;",
      "  color: var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface, #fff));",
      "  border-radius: var(--mat-snack-bar-container-shape, var(--gem-sys-shape--corner-large, 16px));",
      "  background-color: var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface, #202124));",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .delete-all-snackbar .mdc-snackbar__surface {",
      "  width: 376px;",
      "  min-width: 376px;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .container {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: space-between;",
      "  min-height: 3.75rem;",
      "}",
      "#" + SAVED_INFO_SNACKBAR_WRAPPER_ID + " .label {",
      "  width: 100%;",
      "  flex-grow: 1;",
      "  box-sizing: border-box;",
      "  margin: 0;",
      "  color: var(--lumi-sys-color--surface, #fff);",
      "  padding: var(--gem-sys-spacing--m, 16px) var(--gem-sys-spacing--xs, 4px) var(--gem-sys-spacing--m, 16px) var(--gem-sys-spacing--xxl, 32px);",
      "  font-family: Google Sans Flex, Google Sans, Helvetica Neue, sans-serif;",
      "  font-size: var(--gem-sys-typography-type-scale--body-m-font-size, 14px);",
      "  font-weight: var(--gem-sys-typography-type-scale--body-m-font-weight, 400);",
      "  letter-spacing: var(--gem-sys-typography-type-scale--body-m-font-tracking, 0);",
      "  line-height: var(--gem-sys-typography-type-scale--body-m-line-height, 20px);",
      "  font-variation-settings: var(--gds-type-scale-default-wdth), var(--gds-type-scale-default-slnt), var(--gds-type-scale-default-rond);",
      "  white-space: nowrap;",
      "  overflow: hidden;",
      "  text-overflow: ellipsis;",
      "  max-width: 520px;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function getSavedInfoSnackbarTemplate(message, variant) {
    var variantClass = variant ? " " + variant : "";

    return [
      "<div class=\"cdk-overlay-container\">",
      "<div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: flex-start; align-items: flex-end;\">",
      "<div id=\"cdk-overlay-1\" class=\"cdk-overlay-pane\" style=\"position: static; margin-left: 0px; margin-bottom: 0px;\">",
      "<mat-snack-bar-container class=\"mdc-snackbar mat-mdc-snack-bar-container custom-snackbar lm-enabled mat-snack-bar-container-enter",
      variantClass,
      "\">",
      "<div class=\"mdc-snackbar__surface mat-mdc-snackbar-surface\"><div class=\"mat-mdc-snack-bar-label\"><div aria-live=\"off\" id=\"mat-snack-bar-container-live-0\"><div>",
      "<bard-simple-snack-bar _nghost-ng-c2690432418=\"\" class=\"lm-enabled ng-star-inserted\"><div _ngcontent-ng-c2690432418=\"\" class=\"container\">",
      "<div _ngcontent-ng-c2690432418=\"\" matsnackbarlabel=\"\" data-test-id=\"label\" class=\"mat-mdc-snack-bar-label mdc-snackbar__label label\">",
      escapeHtml(message),
      "</div>",
      "<!----></div></bard-simple-snack-bar><!----></div></div></div></div></mat-snack-bar-container></div></div></div>"
    ].join("");
  }

  function closeSavedInfoSnackbar() {
    var wrapper = getSavedInfoSnackbarWrapper();

    if (wrapper) {
      window.clearTimeout(wrapper.geminiSavedInfoSnackbarTimer);
      wrapper.remove();
    }
  }

  function showSavedInfoSnackbar(message, variant) {
    var wrapper;

    ensureSavedInfoSnackbarStyle();
    closeSavedInfoSnackbar();

    wrapper = document.createElement("div");
    wrapper.id = SAVED_INFO_SNACKBAR_WRAPPER_ID;
    wrapper.innerHTML = getSavedInfoSnackbarTemplate(message || "Informa\u00e7\u00f5es salvas", variant || "");
    document.body.appendChild(wrapper);
    wrapper.geminiSavedInfoSnackbarTimer = window.setTimeout(closeSavedInfoSnackbar, SAVED_INFO_SNACKBAR_DURATION);
  }

  function getEditMemoryDialogTemplate() {
    return "<div class=\"cdk-overlay-container\"><div class=\"cdk-overlay-backdrop cdk-overlay-backdrop-noop-animation cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing\"></div><div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: center; align-items: center;\"><div id=\"cdk-overlay-5\" class=\"cdk-overlay-pane mat-mdc-dialog-panel\" style=\"width: calc(-48px + 100vw); max-width: 600px; position: static;\"><div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div><mat-dialog-container tabindex=\"-1\" class=\"mat-mdc-dialog-container mdc-dialog cdk-dialog-container mdc-dialog--open _mat-animation-noopable mat-mdc-dialog-container-with-actions\" id=\"mat-mdc-dialog-0\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"mat-mdc-dialog-title-0\"><div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\"><div class=\"mat-mdc-dialog-surface mdc-dialog__surface\"><edit-memory-dialog _nghost-ng-c4208921684=\"\" class=\"mat-mdc-dialog-component-host ng-star-inserted\"><h1 _ngcontent-ng-c4208921684=\"\" mat-dialog-title=\"\" class=\"mat-mdc-dialog-title mdc-dialog__title gds-title-l\" id=\"mat-mdc-dialog-title-0\">O que você quer que o Gemini memorize?</h1><mat-dialog-content _ngcontent-ng-c4208921684=\"\" class=\"mat-mdc-dialog-content mdc-dialog__content\"><mat-form-field _ngcontent-ng-c4208921684=\"\" appearance=\"outline\" subscriptsizing=\"dynamic\" class=\"mat-mdc-form-field edit-memory-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary ng-valid ng-touched\"><!----><div class=\"mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label\"><!----><div class=\"mat-mdc-form-field-flex\"><div matformfieldnotchedoutline=\"\" class=\"mdc-notched-outline mdc-notched-outline--no-label ng-star-inserted\"><div class=\"mat-mdc-notch-piece mdc-notched-outline__leading\"></div><div class=\"mat-mdc-notch-piece mdc-notched-outline__notch\"><!----><!----><!----></div><div class=\"mat-mdc-notch-piece mdc-notched-outline__trailing\"></div></div><!----><!----><!----><div class=\"mat-mdc-form-field-infix\"><!----><textarea _ngcontent-ng-c4208921684=\"\" rows=\"1\" matinput=\"\" cdktextareaautosize=\"\" aria-label=\"Inserir nova memória\" placeholder=\"Por exemplo: &quot;Prefiro respostas curtas e concisas&quot;\" class=\"cdk-textarea-autosize mat-mdc-input-element edit-memory-input mat-mdc-form-field-textarea-control mat-mdc-form-field-input-control mdc-text-field__input ng-pristine ng-valid cdk-text-field-autofill-monitored ng-touched\" id=\"mat-input-0\" aria-invalid=\"false\" aria-required=\"false\" maxlength=\"10000\" style=\"height: 24px;\">    </textarea></div><!----><!----></div><!----></div><div aria-atomic=\"true\" aria-live=\"polite\" class=\"mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align mat-mdc-form-field-subscript-dynamic-size\"><!----><div class=\"mat-mdc-form-field-hint-wrapper ng-star-inserted\"><!----><div class=\"mat-mdc-form-field-hint-spacer\"></div></div><!----></div></mat-form-field></mat-dialog-content><mat-dialog-actions _ngcontent-ng-c4208921684=\"\" align=\"end\" class=\"mat-mdc-dialog-actions mdc-dialog__actions mat-mdc-dialog-actions-align-end\"><button _ngcontent-ng-c4208921684=\"\" mat-button=\"\" mat-dialog-close=\"\" color=\"primary\" class=\"mdc-button mat-mdc-button-base mat-mdc-button mat-primary _mat-animation-noopable\" mat-ripple-loader-uninitialized=\"\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" type=\"button\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\">Cancelar</span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span></button><button _ngcontent-ng-c4208921684=\"\" mat-flat-button=\"\" data-test-id=\"submit-button\" color=\"primary\" class=\"mdc-button mat-mdc-button-base edit-memory-submit-button mdc-button--unelevated mat-mdc-unelevated-button mat-primary mat-mdc-button-disabled _mat-animation-noopable\" mat-ripple-loader-uninitialized=\"\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" mat-ripple-loader-disabled=\"\" disabled=\"true\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c4208921684=\"\" class=\"ng-star-inserted\">Enviar</span><!----><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span></button></mat-dialog-actions></edit-memory-dialog><!----></div></div></mat-dialog-container><div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div></div></div></div>";
  }

  function getDeleteAllMemoriesButtonTemplate() {
    return [
      "<!---->",
      "<button _ngcontent-ng-c4015516841=\"\" mat-stroked-button=\"\" class=\"mdc-button mat-mdc-button-base delete-all-memories-button mdc-button--outlined mat-mdc-outlined-button desktop mat-unthemed _mat-animation-noopable ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" style=\"\">",
      "<span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span>",
      "<mat-icon _ngcontent-ng-c4015516841=\"\" role=\"img\" fonticon=\"delete\" class=\"mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"delete\"></mat-icon>",
      "<span class=\"mdc-button__label\"><span _ngcontent-ng-c4015516841=\"\">Excluir tudo</span></span>",
      "<!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span>",
      "</button>",
      "<!----><!---->"
    ].join("");
  }

  function getMemoryItemTemplate(memory, index) {
    return [
      "<div _ngcontent-ng-c4015516841=\"\" class=\"memory ng-star-inserted\">",
      "<div _ngcontent-ng-c4015516841=\"\" class=\"memory-text gds-body-l\" style=\"white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;\"> ",
      escapeHtml(getMemoryDisplayText(memory)),
      " </div>",
      "<button _ngcontent-ng-c4015516841=\"\" mat-icon-button=\"\" aria-label=\"Abre um menu de contexto da informa\u00e7\u00e3o.\" class=\"mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-menu-trigger desktop memory-actions-button mat-unthemed _mat-animation-noopable ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" mat-ripple-loader-centered=\"\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-memory-index=\"",
      String(index),
      "\">",
      "<span class=\"mat-mdc-button-persistent-ripple mdc-icon-button__ripple\"></span>",
      "<mat-icon _ngcontent-ng-c4015516841=\"\" role=\"img\" fonticon=\"more_vert\" class=\"mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"more_vert\"></mat-icon>",
      "<!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span>",
      "</button>",
      "<!----><mat-menu _ngcontent-ng-c4015516841=\"\" class=\"ng-star-inserted\"><!----></mat-menu><!---->",
      "</div>"
    ].join("");
  }

  function getSavedMemoriesSectionTemplate(memories) {
    if (!memories.length) {
      return [
        "<!---->",
        "<div _ngcontent-ng-c4015516841=\"\" class=\"empty-state ng-star-inserted\">",
        "<span _ngcontent-ng-c4015516841=\"\">Voc\u00ea ainda n\u00e3o pediu para o Gemini salvar suas informa\u00e7\u00f5es</span>",
        "</div>",
        "<!---->"
      ].join("");
    }

    return [
      "<div _ngcontent-ng-c4015516841=\"\" class=\"memories-groups ng-star-inserted\" style=\"\">",
      "<div _ngcontent-ng-c4015516841=\"\" class=\"memories-group ng-star-inserted\">",
      "<!----><div _ngcontent-ng-c4015516841=\"\" class=\"memories-container\">",
      memories.map(getMemoryItemTemplate).join("<!---->"),
      "<!----></div></div><!----><!----></div><!----><!---->"
    ].join("");
  }

  function syncSavedInfoPage() {
    var page = document.querySelector("saved-info-page");
    var actionButtonsContainer = page ? page.querySelector(".action-buttons-container") : null;
    var memoriesSection = page ? page.querySelector("[data-test-id='memories-section']") : null;
    var deleteButton = actionButtonsContainer ? actionButtonsContainer.querySelector(".delete-all-memories-button") : null;
    var memories = getSavedMemories();

    closeMemoryActionsMenu();

    if (!page) {
      return;
    }

    if (actionButtonsContainer) {
      if (memories.length && !deleteButton) {
        actionButtonsContainer.insertAdjacentHTML("beforeend", getDeleteAllMemoriesButtonTemplate());
      } else if (!memories.length && deleteButton) {
        deleteButton.remove();
      }
    }

    if (memoriesSection) {
      memoriesSection.innerHTML = getSavedMemoriesSectionTemplate(memories);
    }

    syncSavedInfoMemoryToggle();
  }

  function getMemoryActionsMenuWrapper() {
    return document.getElementById(MEMORY_ACTIONS_MENU_WRAPPER_ID);
  }

  function ensureMemoryActionsMenuStyle() {
    var style;

    if (document.getElementById(MEMORY_ACTIONS_MENU_STYLE_ID)) {
      return;
    }

    style = document.createElement("style");
    style.id = MEMORY_ACTIONS_MENU_STYLE_ID;
    style.textContent = [
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1300;",
      "  pointer-events: none;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "  pointer-events: none;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .cdk-overlay-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "  pointer-events: auto;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .cdk-overlay-connected-position-bounding-box {",
      "  position: absolute;",
      "  display: flex;",
      "  pointer-events: none;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .cdk-overlay-pane,",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .mat-mdc-menu-panel {",
      "  pointer-events: auto;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .mat-mdc-menu-panel {",
      "  min-width: 160px;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .mat-mdc-menu-content {",
      "  padding: 8px 0;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .mat-mdc-menu-item {",
      "  width: 100%;",
      "  min-height: 48px;",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 12px;",
      "  border: 0;",
      "  background: transparent;",
      "  color: inherit;",
      "  padding: 0 16px;",
      "  text-align: left;",
      "  cursor: pointer;",
      "}",
      "#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .mat-mdc-menu-item:hover {",
      "  background: rgba(60, 64, 67, .08);",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function closeMemoryActionsMenu() {
    var wrapper = getMemoryActionsMenuWrapper();

    if (wrapper) {
      wrapper.remove();
    }

    document.querySelectorAll("saved-info-page button.memory-actions-button[aria-expanded='true']").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-controls");
      button.classList.remove("cdk-focused", "cdk-mouse-focused");
    });
  }

  function getMemoryActionsMenuBoxStyle(button) {
    var rect = button.getBoundingClientRect();
    var left = Math.max(8, Math.min(Math.round(rect.left), window.innerWidth - 314));
    var top = Math.max(8, Math.min(Math.round(rect.bottom + 4), window.innerHeight - 112));
    var width = Math.max(160, Math.round(window.innerWidth - left));
    var height = Math.max(112, Math.round(window.innerHeight - top));

    return "inset: " + top + "px auto auto " + left + "px; width: " + width + "px; height: " + height + "px; align-items: flex-start; justify-content: flex-start;";
  }

  function getMemoryActionsMenuTemplate(button) {
    var index = button.getAttribute("data-memory-index") || "0";

    return [
      "<div class=\"cdk-overlay-container\">",
      "<div class=\"cdk-overlay-backdrop cdk-overlay-backdrop-noop-animation cdk-overlay-transparent-backdrop cdk-overlay-backdrop-showing\"></div>",
      "<div class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\" style=\"",
      getMemoryActionsMenuBoxStyle(button),
      "\">",
      "<div id=\"cdk-overlay-22\" class=\"cdk-overlay-pane\" style=\"position: static;\">",
      "<div tabindex=\"-1\" role=\"menu\" class=\"mat-mdc-menu-panel mat-menu-after mat-menu-below mat-menu-panel-animations-disabled ng-star-inserted\" id=\"",
      MEMORY_ACTIONS_MENU_PANEL_ID,
      "\" style=\"transform-origin: left top;\">",
      "<div class=\"mat-mdc-menu-content\">",
      "<button _ngcontent-ng-c4015516841=\"\" mat-menu-item=\"\" mattooltip=\"Editar esta informa\u00e7\u00e3o\" aria-label=\"Editar esta informa\u00e7\u00e3o\" data-test-id=\"edit-button\" data-memory-index=\"",
      escapeHtml(index),
      "\" class=\"mat-mdc-menu-item mat-focus-indicator mat-mdc-tooltip-trigger edit-button\" role=\"menuitem\" tabindex=\"0\" aria-disabled=\"false\">",
      "<mat-icon _ngcontent-ng-c4015516841=\"\" role=\"img\" fonticon=\"edit\" class=\"mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"edit\"></mat-icon>",
      "<span class=\"mat-mdc-menu-item-text\"><span _ngcontent-ng-c4015516841=\"\">Editar</span></span>",
      "<div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!---->",
      "</button>",
      "<!---->",
      "<button _ngcontent-ng-c4015516841=\"\" mat-menu-item=\"\" mattooltip=\"Excluir esta informa\u00e7\u00e3o\" aria-label=\"Excluir esta informa\u00e7\u00e3o\" data-test-id=\"delete-button\" data-memory-index=\"",
      escapeHtml(index),
      "\" class=\"mat-mdc-menu-item mat-focus-indicator mat-mdc-tooltip-trigger delete-button\" role=\"menuitem\" tabindex=\"0\" aria-disabled=\"false\">",
      "<mat-icon _ngcontent-ng-c4015516841=\"\" role=\"img\" fonticon=\"delete\" class=\"mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"delete\"></mat-icon>",
      "<span class=\"mat-mdc-menu-item-text\"><span _ngcontent-ng-c4015516841=\"\">Excluir</span></span>",
      "<div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!---->",
      "</button>",
      "<!---->",
      "</div></div></div></div></div>"
    ].join("");
  }

  function openMemoryActionsMenu(button) {
    var wrapper;

    if (!button) {
      return;
    }

    ensureMemoryActionsMenuStyle();
    closeMemoryActionsMenu();

    wrapper = document.createElement("div");
    wrapper.id = MEMORY_ACTIONS_MENU_WRAPPER_ID;
    wrapper.innerHTML = getMemoryActionsMenuTemplate(button);
    document.body.appendChild(wrapper);

    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", MEMORY_ACTIONS_MENU_PANEL_ID);
    button.classList.add("cdk-focused", "cdk-mouse-focused");
  }

  function ensureDeleteMemoryDialogStyle() {
    var style;

    if (document.getElementById(DELETE_MEMORY_DIALOG_STYLE_ID)) {
      return;
    }

    style = document.createElement("style");
    style.id = DELETE_MEMORY_DIALOG_STYLE_ID;
    style.textContent = [
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1500;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1500;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .cdk-global-overlay-wrapper {",
      "  position: absolute;",
      "  inset: 0;",
      "  display: flex;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .cdk-global-overlay-wrapper {",
      "  position: absolute;",
      "  inset: 0;",
      "  display: flex;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-surface {",
      "  border-radius: 32px;",
      "  width: 600px;",
      "  height: 133px;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-surface {",
      "  border-radius: 32px;",
      "  width: 600px;",
      "  height: 133px;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-title {",
      "  padding: 24px 24px 0;",
      "  margin: 0;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-title {",
      "  padding: 24px 24px 0;",
      "  margin: 0;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-content {",
      "  padding: 0 24px;",
      "  min-height: 0;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-content {",
      "  padding: 0 24px;",
      "  min-height: 0;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-actions {",
      "  box-sizing: border-box;",
      "  width: 100%;",
      "  height: 68px;",
      "  padding: 16px 16px 16px 24px;",
      "  gap: 8px;",
      "  justify-content: flex-end;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-actions {",
      "  box-sizing: border-box;",
      "  width: 100%;",
      "  height: 68px;",
      "  padding: 16px 16px 16px 24px;",
      "  gap: 8px;",
      "  justify-content: flex-end;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button button {",
      "  border: 0;",
      "  border-radius: 999px;",
      "  background: #f1f1f1;",
      "  color: #1f1f1f;",
      "  min-height: 36px;",
      "  height: 36px;",
      "  padding: 0;",
      "  cursor: pointer;",
      "  white-space: nowrap;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button {",
      "  border: 0;",
      "  border-radius: 999px;",
      "  background: #f1f1f1;",
      "  color: #1f1f1f;",
      "  min-height: 36px;",
      "  height: 36px;",
      "  padding: 0;",
      "  cursor: pointer;",
      "  white-space: nowrap;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button[data-test-id='cancel-button'] button {",
      "  width: 84.41px;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button[data-test-id='confirm-button'] button {",
      "  width: 67.92px;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button:first-of-type button {",
      "  width: 103.14px;",
      "}",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button:nth-of-type(2) button {",
      "  width: 84.41px;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button button:hover,",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button:hover {",
      "  background: #e9e9e9;",
      "}",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button button .mdc-button__label,",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button .mdc-button__label,",
      "#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " gem-button button .gds-body-m,",
      "#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " gem-button button .gds-body-m {",
      "  color: #1f1f1f;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function getDeleteMemoryDialogTemplate(index) {
    return [
      "<div class=\"cdk-overlay-container\">",
      "<div class=\"cdk-overlay-backdrop cdk-overlay-backdrop-noop-animation cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing\"></div>",
      "<div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: center; align-items: center;\">",
      "<div id=\"cdk-overlay-27\" class=\"cdk-overlay-pane mat-mdc-dialog-panel lumi-dialog\" style=\"width: calc(-48px + 100vw); max-width: 600px; position: static;\">",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "<mat-dialog-container tabindex=\"-1\" class=\"mat-mdc-dialog-container mdc-dialog cdk-dialog-container mdc-dialog--open _mat-animation-noopable mat-mdc-dialog-container-with-actions\" id=\"mat-mdc-dialog-10\" role=\"dialog\" aria-modal=\"false\" aria-label=\"Excluir estas informa\u00e7\u00f5es\">",
      "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\"><div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">",
      "<message-dialog _nghost-ng-c2311401154=\"\" class=\"mat-mdc-dialog-component-host ng-star-inserted\">",
      "<h1 _ngcontent-ng-c2311401154=\"\" mat-dialog-title=\"\" data-test-id=\"message-dialog-title\" class=\"mat-mdc-dialog-title mdc-dialog__title\" id=\"mat-mdc-dialog-title-10\">Excluir instru\u00e7\u00f5es?</h1>",
      "<mat-dialog-content _ngcontent-ng-c2311401154=\"\" class=\"mat-mdc-dialog-content mdc-dialog__content\">",
      "<span _ngcontent-ng-c2311401154=\"\" data-test-id=\"message-dialog-content\" class=\"message-dialog-content\"></span><!---->",
      "</mat-dialog-content>",
      "<mat-dialog-actions _ngcontent-ng-c2311401154=\"\" align=\"end\" class=\"mat-mdc-dialog-actions mdc-dialog__actions mat-mdc-dialog-actions-align-end\">",
      "<!---->",
      "<gem-button _ngcontent-ng-c2311401154=\"\" theme=\"lm\" type=\"tonal\" data-test-id=\"cancel-button\" _nghost-ng-c3985705569=\"\" class=\"gem-button gem-button-badge-size-small gem-button-size-small gem-button-type-tonal lm-enabled ng-star-inserted\">",
      "<!----><button _ngcontent-ng-c3985705569=\"\" matbadgeposition=\"after\" class=\"mdc-button mat-mdc-button-base mat-badge mat-tonal-button mat-unthemed _mat-animation-noopable mat-badge-overlap mat-badge-above mat-badge-after mat-badge-small mat-badge-hidden ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\">",
      "<span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c3985705569=\"\" class=\"gem-button-content ng-star-inserted\"><!----><span _ngcontent-ng-c3985705569=\"\" class=\"gds-body-m\"> Cancelar </span><!----></span><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span>",
      "</button><!----><!----></gem-button><!---->",
      "<gem-button _ngcontent-ng-c2311401154=\"\" cdkfocusinitial=\"\" theme=\"lm\" type=\"tonal\" data-test-id=\"confirm-button\" data-memory-index=\"",
      escapeHtml(String(index)),
      "\" _nghost-ng-c3985705569=\"\" class=\"gem-button gem-button-badge-size-small gem-button-size-small gem-button-type-tonal lm-enabled ng-star-inserted\">",
      "<!----><button _ngcontent-ng-c3985705569=\"\" matbadgeposition=\"after\" class=\"mdc-button mat-mdc-button-base mat-badge mat-tonal-button mat-unthemed _mat-animation-noopable mat-badge-overlap mat-badge-above mat-badge-after mat-badge-small mat-badge-hidden ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\">",
      "<span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c3985705569=\"\" class=\"gem-button-content ng-star-inserted\"><!----><span _ngcontent-ng-c3985705569=\"\" class=\"gds-body-m\"> Excluir </span><!----></span><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span>",
      "</button><!----><!----></gem-button><!----><!----><!---->",
      "</mat-dialog-actions>",
      "</message-dialog><!----></div></div></mat-dialog-container>",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "</div></div></div>"
    ].join("");
  }

  function closeDeleteMemoryDialog() {
    var wrapper = getDeleteMemoryDialogWrapper();

    if (wrapper) {
      wrapper.remove();
    }
  }

  function getDeleteAllMemoriesDialogTemplate() {
    return [
      "<div class=\"cdk-overlay-container\">",
      "<div class=\"cdk-overlay-backdrop cdk-overlay-backdrop-noop-animation cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing\"></div>",
      "<div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: center; align-items: center;\">",
      "<div id=\"cdk-overlay-29\" class=\"cdk-overlay-pane mat-mdc-dialog-panel lumi-dialog\" style=\"width: calc(-48px + 100vw); max-width: 600px; position: static;\">",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "<mat-dialog-container tabindex=\"-1\" class=\"mat-mdc-dialog-container mdc-dialog cdk-dialog-container mdc-dialog--open _mat-animation-noopable mat-mdc-dialog-container-with-actions\" id=\"mat-mdc-dialog-12\" role=\"dialog\" aria-modal=\"false\" aria-label=\"Excluir todas as instru\u00e7\u00f5es\">",
      "<div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\"><div class=\"mat-mdc-dialog-surface mdc-dialog__surface\">",
      "<message-dialog _nghost-ng-c2311401154=\"\" class=\"mat-mdc-dialog-component-host ng-star-inserted\">",
      "<h1 _ngcontent-ng-c2311401154=\"\" mat-dialog-title=\"\" data-test-id=\"message-dialog-title\" class=\"mat-mdc-dialog-title mdc-dialog__title\" id=\"mat-mdc-dialog-title-12\">Excluir todas as instru\u00e7\u00f5es?</h1>",
      "<mat-dialog-content _ngcontent-ng-c2311401154=\"\" class=\"mat-mdc-dialog-content mdc-dialog__content\">",
      "<span _ngcontent-ng-c2311401154=\"\" data-test-id=\"message-dialog-content\" class=\"message-dialog-content\"></span><!---->",
      "</mat-dialog-content>",
      "<mat-dialog-actions _ngcontent-ng-c2311401154=\"\" align=\"end\" class=\"mat-mdc-dialog-actions mdc-dialog__actions mat-mdc-dialog-actions-align-end\">",
      "<gem-button _ngcontent-ng-c2311401154=\"\" theme=\"lm\" type=\"tonal\" data-test-id=\"button.dataTestId\" _nghost-ng-c3985705569=\"\" class=\"gem-button gem-button-badge-size-small gem-button-size-small gem-button-type-tonal lm-enabled ng-star-inserted\"><!----><button _ngcontent-ng-c3985705569=\"\" matbadgeposition=\"after\" class=\"mdc-button mat-mdc-button-base mat-badge mat-tonal-button mat-unthemed _mat-animation-noopable mat-badge-overlap mat-badge-above mat-badge-after mat-badge-small mat-badge-hidden ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" jslog=\"305700;track:generic_click,impression;BardVeMetadataKey:[null,null,null,null,null,null,null,[&quot;&quot;]]\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c3985705569=\"\" class=\"gem-button-content ng-star-inserted\"><!----><span _ngcontent-ng-c3985705569=\"\" class=\"gds-body-m\"> Excluir tudo </span><!----></span><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span></button><!----><!----></gem-button>",
      "<gem-button _ngcontent-ng-c2311401154=\"\" theme=\"lm\" type=\"tonal\" data-test-id=\"button.dataTestId\" _nghost-ng-c3985705569=\"\" class=\"gem-button gem-button-badge-size-small gem-button-size-small gem-button-type-tonal lm-enabled ng-star-inserted\"><!----><button _ngcontent-ng-c3985705569=\"\" matbadgeposition=\"after\" class=\"mdc-button mat-mdc-button-base mat-badge mat-tonal-button mat-unthemed _mat-animation-noopable mat-badge-overlap mat-badge-above mat-badge-after mat-badge-small mat-badge-hidden ng-star-inserted\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" jslog=\"305700;track:generic_click,impression;BardVeMetadataKey:[null,null,null,null,null,null,null,[&quot;&quot;]]\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c3985705569=\"\" class=\"gem-button-content ng-star-inserted\"><!----><span _ngcontent-ng-c3985705569=\"\" class=\"gds-body-m\"> Cancelar </span><!----></span><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span><span class=\"mat-ripple mat-mdc-button-ripple\"></span></button><!----><!----></gem-button><!----><!----><!----><!----><!---->",
      "</mat-dialog-actions>",
      "</message-dialog><!----></div></div></mat-dialog-container>",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "</div></div></div>"
    ].join("");
  }

  function closeDeleteAllMemoriesDialog() {
    var wrapper = getDeleteAllMemoriesDialogWrapper();

    if (wrapper) {
      wrapper.remove();
    }
  }

  function openDeleteAllMemoriesDialog() {
    var wrapper;

    ensureEditMemoryDialogExtractedStyles();
    ensureDeleteMemoryDialogStyle();
    closeDeleteAllMemoriesDialog();

    wrapper = document.createElement("div");
    wrapper.id = DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID;
    wrapper.innerHTML = getDeleteAllMemoriesDialogTemplate();
    document.body.appendChild(wrapper);
  }

  function openDeleteMemoryDialog(index) {
    var wrapper;

    ensureEditMemoryDialogExtractedStyles();
    ensureDeleteMemoryDialogStyle();
    closeDeleteMemoryDialog();
    closeMemoryActionsMenu();

    wrapper = document.createElement("div");
    wrapper.id = DELETE_MEMORY_DIALOG_WRAPPER_ID;
    wrapper.innerHTML = getDeleteMemoryDialogTemplate(index);
    document.body.appendChild(wrapper);
  }

  function ensureEditMemoryDialogStyle() {
    var style;

    if (document.getElementById(EDIT_MEMORY_DIALOG_STYLE_ID)) {
      return;
    }

    style = document.createElement("style");
    style.id = EDIT_MEMORY_DIALOG_STYLE_ID;
    style.textContent = [
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " {",
      "  position: fixed;",
      "  inset: 0;",
      "  z-index: 1400;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-container {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop {",
      "  position: absolute;",
      "  inset: 0;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .cdk-global-overlay-wrapper {",
      "  position: absolute;",
      "  inset: 0;",
      "  display: flex;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-surface {",
      "  max-height: calc(100vh - 48px);",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-dialog-content {",
      "  overflow-y: auto;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .mat-mdc-form-field-infix {",
      "  width: 100%;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " textarea.edit-memory-input {",
      "  resize: none;",
      "  width: 100%;",
      "  min-height: 24px;",
      "  line-height: 24px;",
      "  overflow-x: hidden;",
      "  overflow-y: hidden;",
      "  white-space: pre-wrap !important;",
      "  overflow-wrap: anywhere;",
      "  word-break: break-word;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .edit-memory-submit-button .mdc-button__label {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .edit-memory-submit-button mat-progress-spinner {",
      "  display: inline-flex;",
      "  color: currentColor;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .edit-memory-submit-button mat-progress-spinner circle {",
      "  stroke: currentColor;",
      "}",
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .edit-memory-submit-button .mdc-circular-progress__indeterminate-container {",
      "  animation: gemini-edit-memory-spinner-rotate 1.4s linear infinite;",
      "  transform-origin: center;",
      "}",
      "@keyframes gemini-edit-memory-spinner-rotate {",
      "  to {",
      "    transform: rotate(360deg);",
      "  }",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureEditMemoryDialogExtractedStyles() {
    var headTemplate = window.GEMINI_EDIT_MEMORY_DIALOG_HEAD_TEMPLATE || "";
    var template = document.createElement("template");
    var marker;

    if (!headTemplate || document.getElementById(EDIT_MEMORY_DIALOG_EXTRACTED_STYLES_ID)) {
      return;
    }

    marker = document.createElement("meta");
    marker.id = EDIT_MEMORY_DIALOG_EXTRACTED_STYLES_ID;
    document.head.appendChild(marker);

    template.innerHTML = headTemplate;
    Array.prototype.slice.call(template.content.children).forEach(function (node) {
      node.setAttribute("data-gemini-edit-memory-dialog-style", "");
      document.head.appendChild(node);
    });
  }

  function closeEditMemoryDialog() {
    var wrapper = getEditMemoryDialogWrapper();
    var submitButton = wrapper ? wrapper.querySelector("button.edit-memory-submit-button[data-test-id='submit-button']") : null;

    if (submitButton) {
      window.clearTimeout(submitButton.geminiEditMemoryLoadingTimer);
    }

    if (wrapper) {
      wrapper.remove();
    }
  }

  function getEditMemorySubmitSpinnerTemplate() {
    return [
      "<!---->",
      "<mat-progress-spinner _ngcontent-ng-c4208921684=\"\" role=\"progressbar\" tabindex=\"-1\"",
      " mode=\"indeterminate\" diameter=\"20\" aria-label=\"Salvando a mem\u00f3ria\"",
      " class=\"mat-mdc-progress-spinner mdc-circular-progress mat-progress-spinner-reduced-motion mat-primary mdc-circular-progress--indeterminate ng-star-inserted\"",
      " aria-valuemin=\"0\" aria-valuemax=\"100\"",
      " style=\"width: 20px; height: 20px; --mat-progress-spinner-size: 20px; --mat-progress-spinner-active-indicator-width: 20px;\">",
      "<!---->",
      "<div aria-hidden=\"true\" class=\"mdc-circular-progress__determinate-container\">",
      "<svg xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" class=\"mdc-circular-progress__determinate-circle-graphic\" viewBox=\"0 0 12 12\">",
      "<circle cx=\"50%\" cy=\"50%\" class=\"mdc-circular-progress__determinate-circle\" r=\"5\" style=\"stroke-dasharray: 31.4159px; stroke-width: 10%;\"></circle>",
      "</svg>",
      "</div>",
      "<div aria-hidden=\"true\" class=\"mdc-circular-progress__indeterminate-container\">",
      "<div class=\"mdc-circular-progress__spinner-layer\">",
      "<div class=\"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left\">",
      "<svg xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" class=\"mdc-circular-progress__indeterminate-circle-graphic ng-star-inserted\" viewBox=\"0 0 12 12\">",
      "<circle cx=\"50%\" cy=\"50%\" r=\"5\" style=\"stroke-dasharray: 31.4159px; stroke-dashoffset: 15.708px; stroke-width: 10%;\"></circle>",
      "</svg>",
      "<!---->",
      "</div>",
      "<div class=\"mdc-circular-progress__gap-patch\">",
      "<svg xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" class=\"mdc-circular-progress__indeterminate-circle-graphic ng-star-inserted\" viewBox=\"0 0 12 12\">",
      "<circle cx=\"50%\" cy=\"50%\" r=\"5\" style=\"stroke-dasharray: 31.4159px; stroke-dashoffset: 15.708px; stroke-width: 10%;\"></circle>",
      "</svg>",
      "<!---->",
      "</div>",
      "<div class=\"mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right\">",
      "<svg xmlns=\"http://www.w3.org/2000/svg\" focusable=\"false\" class=\"mdc-circular-progress__indeterminate-circle-graphic ng-star-inserted\" viewBox=\"0 0 12 12\">",
      "<circle cx=\"50%\" cy=\"50%\" r=\"5\" style=\"stroke-dasharray: 31.4159px; stroke-dashoffset: 15.708px; stroke-width: 10%;\"></circle>",
      "</svg>",
      "<!---->",
      "</div>",
      "</div>",
      "</div>",
      "</mat-progress-spinner>",
      "<!----><!---->"
    ].join("");
  }

  function setEditMemorySubmitLoading(wrapper, loading, onComplete) {
    var submitButton = wrapper ? wrapper.querySelector("button.edit-memory-submit-button[data-test-id='submit-button']") : null;
    var label = submitButton ? submitButton.querySelector(".mdc-button__label") : null;

    if (!submitButton || !label) {
      return;
    }

    window.clearTimeout(submitButton.geminiEditMemoryLoadingTimer);
    submitButton.geminiEditMemoryLoadingTimer = null;

    if (loading) {
      submitButton.dataset.geminiMemoryLoading = "true";
      submitButton.disabled = false;
      submitButton.classList.remove("mat-mdc-button-disabled");
      submitButton.classList.add("cdk-focused", "cdk-mouse-focused");
      submitButton.removeAttribute("disabled");
      submitButton.removeAttribute("mat-ripple-loader-disabled");
      submitButton.removeAttribute("mat-ripple-loader-uninitialized");
      submitButton.setAttribute("aria-disabled", "false");
      label.innerHTML = getEditMemorySubmitSpinnerTemplate();
      submitButton.geminiEditMemoryLoadingTimer = window.setTimeout(function () {
        if (typeof onComplete === "function") {
          onComplete();
          return;
        }

        setEditMemorySubmitLoading(wrapper, false);
      }, EDIT_MEMORY_SUBMIT_LOADING_DURATION);
      return;
    }

    delete submitButton.dataset.geminiMemoryLoading;
    submitButton.classList.remove("cdk-focused", "cdk-mouse-focused");
    label.innerHTML = "<span _ngcontent-ng-c4208921684=\"\" class=\"ng-star-inserted\">Enviar</span><!----><!---->";
    syncEditMemorySubmitButton(wrapper);
  }

  function syncEditMemorySubmitButton(wrapper) {
    var textarea = wrapper ? wrapper.querySelector("textarea.edit-memory-input") : null;
    var submitButton = wrapper ? wrapper.querySelector("button.edit-memory-submit-button[data-test-id='submit-button']") : null;
    var hasText = textarea ? textarea.value.trim().length > 0 : false;

    if (!submitButton) {
      return;
    }

    if (submitButton.dataset.geminiMemoryLoading === "true") {
      return;
    }

    submitButton.disabled = !hasText;
    submitButton.classList.toggle("mat-mdc-button-disabled", !hasText);
    submitButton.toggleAttribute("disabled", !hasText);
    submitButton.toggleAttribute("mat-ripple-loader-disabled", !hasText);
    submitButton.setAttribute("aria-disabled", hasText ? "false" : "true");

    if (hasText) {
      submitButton.removeAttribute("mat-ripple-loader-uninitialized");
    } else {
      submitButton.setAttribute("mat-ripple-loader-uninitialized", "");
    }
  }

  function syncEditMemoryTextareaSize(textarea) {
    if (!textarea) {
      return;
    }

    textarea.setAttribute("wrap", "soft");
    textarea.style.height = EDIT_MEMORY_INPUT_MIN_HEIGHT + "px";
    textarea.style.height = Math.max(textarea.scrollHeight, EDIT_MEMORY_INPUT_MIN_HEIGHT) + "px";
    textarea.style.overflowY = "hidden";
  }

  function syncEditMemoryInput(wrapper) {
    var textarea = wrapper ? wrapper.querySelector("textarea.edit-memory-input") : null;

    syncEditMemoryTextareaSize(textarea);
    syncEditMemorySubmitButton(wrapper);
  }

  function bindEditMemoryInput(wrapper, options) {
    var textarea = wrapper ? wrapper.querySelector("textarea.edit-memory-input") : null;
    var submitButton = wrapper ? wrapper.querySelector("button.edit-memory-submit-button[data-test-id='submit-button']") : null;
    var mode = options && options.mode === "edit" ? "edit" : "create";
    var memoryIndex = options ? options.memoryIndex : -1;

    if (!textarea) {
      return;
    }

    textarea.addEventListener("input", function () {
      syncEditMemoryInput(wrapper);
    });

    textarea.addEventListener("keyup", function () {
      syncEditMemoryInput(wrapper);
    });

    textarea.addEventListener("paste", function () {
      window.requestAnimationFrame(function () {
        syncEditMemoryInput(wrapper);
      });
    });

    textarea.addEventListener("cut", function () {
      window.requestAnimationFrame(function () {
        syncEditMemoryInput(wrapper);
      });
    });

    if (submitButton) {
      submitButton.addEventListener("click", function (event) {
        var memoryText = textarea.value.trim();

        if (submitButton.disabled || submitButton.dataset.geminiMemoryLoading === "true") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        setEditMemorySubmitLoading(wrapper, true, function () {
          var snackbarMessage = "Informa\u00e7\u00f5es salvas";

          if (mode === "edit") {
            updateSavedMemory(memoryIndex, memoryText);
            snackbarMessage = "Mudan\u00e7as salvas";
          } else {
            addSavedMemory(memoryText);
          }

          closeEditMemoryDialog();
          syncSavedInfoPage();
          showSavedInfoSnackbar(snackbarMessage);
        });
      });
    }

    syncEditMemoryInput(wrapper);
  }

  function openEditMemoryDialog(options) {
    var wrapper = getEditMemoryDialogWrapper();
    var textarea;
    var initialValue = options && options.initialValue ? String(options.initialValue) : "";

    ensureEditMemoryDialogExtractedStyles();
    ensureEditMemoryDialogStyle();

    if (wrapper) {
      wrapper.remove();
    }

    wrapper = document.createElement("div");
    wrapper.id = EDIT_MEMORY_DIALOG_WRAPPER_ID;
    wrapper.innerHTML = getEditMemoryDialogTemplate();
    document.body.appendChild(wrapper);

    textarea = wrapper.querySelector("textarea.edit-memory-input");
    if (textarea) {
      textarea.setAttribute("wrap", "soft");
      textarea.value = initialValue;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }

    bindEditMemoryInput(wrapper, options || {});
  }

  function getPersonalMemoryToggleButton(target) {
    return target && target.closest
      ? target.closest("personal-intelligence-page mat-slide-toggle[data-test-id='enable-personal-gemini-context-toggle'] button[role='switch']")
      : null;
  }

  function getSavedInfoMemoryToggleButton(target) {
    return target && target.closest
      ? target.closest("saved-info-page mat-slide-toggle[data-test-id='enable-memory-toggle'] button[role='switch']")
      : null;
  }

  function setSlideToggleChecked(button, checked) {
    var slideToggle = button ? button.closest("mat-slide-toggle") : null;

    if (!button || !slideToggle) {
      return;
    }

    slideToggle.classList.toggle("mat-mdc-slide-toggle-checked", checked);
    button.classList.toggle("mdc-switch--selected", checked);
    button.classList.toggle("mdc-switch--checked", checked);
    button.classList.toggle("mdc-switch--unselected", !checked);
    button.setAttribute("aria-checked", checked ? "true" : "false");
  }

  function togglePersonalMemory(button) {
    var checked = button ? button.getAttribute("aria-checked") === "true" : false;

    setSlideToggleChecked(button, !checked);
  }

  function isSavedInfoMemoryEnabled() {
    return window.localStorage.getItem(SAVED_INFO_MEMORY_ENABLED_STORAGE_KEY) !== "false";
  }

  function setSavedInfoMemoryEnabled(enabled) {
    window.localStorage.setItem(SAVED_INFO_MEMORY_ENABLED_STORAGE_KEY, enabled ? "true" : "false");
  }

  function syncSavedInfoMemoryToggle() {
    var button = document.querySelector("saved-info-page mat-slide-toggle[data-test-id='enable-memory-toggle'] button[role='switch']");

    setSlideToggleChecked(button, isSavedInfoMemoryEnabled());
  }

  function toggleSavedInfoMemory(button) {
    var checked = button ? button.getAttribute("aria-checked") === "true" : false;
    var nextChecked = !checked;

    setSavedInfoMemoryEnabled(nextChecked);
    setSlideToggleChecked(button, nextChecked);
  }

  function ensurePersonalIntelligenceStyles() {
    var headTemplate = window.GEMINI_PERSONAL_INTELLIGENCE_HEAD_TEMPLATE || "";
    var template = document.createElement("template");
    var marker;

    if (!headTemplate || document.getElementById(PERSONAL_INTELLIGENCE_STYLES_ID)) {
      return;
    }

    marker = document.createElement("meta");
    marker.id = PERSONAL_INTELLIGENCE_STYLES_ID;
    document.head.appendChild(marker);

    template.innerHTML = headTemplate;
    Array.prototype.slice.call(template.content.children).forEach(function (node) {
      node.setAttribute("data-gemini-personal-intelligence-style", "");
      document.head.appendChild(node);
    });
  }

  function ensureSavedInfoStyles() {
    var headTemplate = window.GEMINI_SAVED_INFO_HEAD_TEMPLATE || "";
    var template = document.createElement("template");
    var marker;

    if (!headTemplate || document.getElementById(SAVED_INFO_STYLES_ID)) {
      return;
    }

    marker = document.createElement("meta");
    marker.id = SAVED_INFO_STYLES_ID;
    document.head.appendChild(marker);

    template.innerHTML = headTemplate;
    Array.prototype.slice.call(template.content.children).forEach(function (node) {
      node.setAttribute("data-gemini-saved-info-style", "");
      document.head.appendChild(node);
    });
  }

  function ensurePersonalIntelligenceTopControlsStyle() {
    var style;

    if (document.getElementById(PERSONAL_INTELLIGENCE_TOP_CONTROLS_STYLE_ID)) {
      return;
    }

    style = document.createElement("style");
    style.id = PERSONAL_INTELLIGENCE_TOP_CONTROLS_STYLE_ID;
    style.textContent = [
      "body." + PERSONAL_INTELLIGENCE_ACTIVE_CLASS + " top-bar-actions .buttons-container.adv-upsell,",
      "body." + PERSONAL_INTELLIGENCE_ACTIVE_CLASS + " top-bar-actions [data-test-id='g1-dynamic-advanced-upsell-button'],",
      "body." + PERSONAL_INTELLIGENCE_ACTIVE_CLASS + " top-bar-actions [data-test-id='temp-chat-button-container'],",
      "body." + PERSONAL_INTELLIGENCE_ACTIVE_CLASS + " top-bar-actions [data-test-id='temp-chat-button'] {",
      "  display: none !important;",
      "}"
    ].join("\n");
    document.head.appendChild(style);
  }

  function clearSideNavActiveState() {
    document.querySelectorAll("bard-sidenav .is-active, bard-sidenav .mdc-list-item--activated").forEach(function (element) {
      element.classList.remove("is-active", "mdc-list-item--activated");
    });

    document.querySelectorAll("bard-sidenav [aria-current]").forEach(function (element) {
      element.removeAttribute("aria-current");
    });

    document.querySelectorAll("bard-sidenav .trailing-text-container").forEach(function (element) {
      element.remove();
    });
  }

  function setNewChatActiveState() {
    var item = document.querySelector("bard-sidenav gem-nav-list-item[data-test-id='new-chat-button']");
    var iconButton = item ? item.querySelector("gem-icon-button") : null;
    var link = item ? item.querySelector("a") : null;

    clearSideNavActiveState();

    if (iconButton) {
      iconButton.classList.add("is-active");
      iconButton.setAttribute("aria-current", "page");
    }

    if (link) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");

      if (link.classList.contains("mat-mdc-list-item")) {
        link.classList.add("mdc-list-item--activated");
      }
    }
  }

  function renderChatIndexPage() {
    var content = document.querySelector("bard-sidenav-content");

    rememberInitialChatContentTemplate();

    if (!content || !initialChatContentTemplate) {
      return;
    }

    closeSettingsMenu();
    closeMemoryActionsMenu();
    closeDeleteMemoryDialog();
    closeDeleteAllMemoriesDialog();
    closeEditMemoryDialog();
    document.body.classList.remove(PERSONAL_INTELLIGENCE_ACTIVE_CLASS);
    content.outerHTML = initialChatContentTemplate;
    setNewChatActiveState();
  }

  function renderPersonalIntelligencePage() {
    var content = document.querySelector("bard-sidenav-content");
    var template = window.GEMINI_PERSONAL_INTELLIGENCE_TEMPLATE || "";

    if (!content || !template) {
      return;
    }

    ensurePersonalIntelligenceStyles();
    ensurePersonalIntelligenceTopControlsStyle();
    rememberInitialChatContentTemplate();
    document.body.classList.add(PERSONAL_INTELLIGENCE_ACTIVE_CLASS);
    clearSideNavActiveState();
    content.outerHTML = template;
    closeSettingsMenu();
  }

  function renderSavedInfoPage() {
    var content = document.querySelector("bard-sidenav-content");
    var template = window.GEMINI_SAVED_INFO_TEMPLATE || "";

    if (!content || !template) {
      return;
    }

    ensureSavedInfoStyles();
    ensurePersonalIntelligenceTopControlsStyle();
    rememberInitialChatContentTemplate();
    document.body.classList.add(PERSONAL_INTELLIGENCE_ACTIVE_CLASS);
    clearSideNavActiveState();
    content.outerHTML = template;
    syncSavedInfoPage();
  }

  function getThemeMenuButton(target) {
    return target && target.closest
      ? target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='desktop-theme-menu-button']")
      : null;
  }

  function getHelpMenuButton(target) {
    return target && target.closest
      ? target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='help-button']")
      : null;
  }

  function getThemeSubmenu() {
    return document.querySelector("#" + SETTINGS_MENU_WRAPPER_ID + " #" + THEME_SUBMENU_ID);
  }

  function getHelpSubmenu() {
    return document.querySelector("#" + SETTINGS_MENU_WRAPPER_ID + " #" + HELP_SUBMENU_ID);
  }

  function getThemeSubmenuTemplate() {
    var boxStyle = isSideNavExpanded() ? THEME_SUBMENU_EXPANDED_BOX_STYLE : THEME_SUBMENU_COLLAPSED_BOX_STYLE;

    return [
      "<div class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\" style=\"" + boxStyle + "\">",
      "<div id=\"cdk-overlay-9\" class=\"cdk-overlay-pane\" style=\"position: static; transform: translateY(-8px);\">",
      "<div tabindex=\"-1\" role=\"menu\" class=\"mat-mdc-menu-panel lm-menu-theme mat-menu-after mat-menu-below mat-menu-panel-animations-disabled ng-star-inserted\" id=\"" + THEME_SUBMENU_ID + "\" style=\"transform-origin: left top;\">",
      "<div class=\"mat-mdc-menu-content\">",
      "<button _ngcontent-ng-c2369618414=\"\" mat-menu-item=\"\" lmmenuitemtheme=\"\" role=\"menuitemradio\" class=\"mat-mdc-menu-item mat-focus-indicator lm-menu-item-theme\" aria-checked=\"true\" tabindex=\"0\" aria-disabled=\"false\"><span class=\"mat-mdc-menu-item-text\"><span _ngcontent-ng-c2369618414=\"\" class=\"menu-item-title-with-trailing-component\"><span _ngcontent-ng-c2369618414=\"\" class=\"gds-label-l gem-menu-item-label\">Sistema</span><gem-icon _ngcontent-ng-c2369618414=\"\" size=\"large\" class=\"gds-icon-l gem-menu-item-icon ng-star-inserted\" _nghost-ng-c206654976=\"\"><mat-icon _ngcontent-ng-c206654976=\"\" role=\"img\" class=\"mat-icon notranslate lm-icon-l lumi-symbols mat-ligature-font mat-icon-no-color ng-star-inserted\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"check_circle\" data-mat-icon-namespace=\"lumi-symbols\" fonticon=\"check_circle\"></mat-icon><!----><!----><!----></gem-icon><!----></span></span><div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!----></button>",
      "<button _ngcontent-ng-c2369618414=\"\" mat-menu-item=\"\" lmmenuitemtheme=\"\" role=\"menuitemradio\" class=\"mat-mdc-menu-item mat-focus-indicator lm-menu-item-theme\" aria-checked=\"false\" tabindex=\"0\" aria-disabled=\"false\"><span class=\"mat-mdc-menu-item-text\"><span _ngcontent-ng-c2369618414=\"\" class=\"menu-item-title-with-trailing-component\"><span _ngcontent-ng-c2369618414=\"\" class=\"gds-label-l gem-menu-item-label\">Claro</span><!----></span></span><div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!----></button>",
      "<button _ngcontent-ng-c2369618414=\"\" mat-menu-item=\"\" lmmenuitemtheme=\"\" role=\"menuitemradio\" class=\"mat-mdc-menu-item mat-focus-indicator lm-menu-item-theme\" aria-checked=\"false\" tabindex=\"0\" aria-disabled=\"false\"><span class=\"mat-mdc-menu-item-text\"><span _ngcontent-ng-c2369618414=\"\" class=\"menu-item-title-with-trailing-component\"><span _ngcontent-ng-c2369618414=\"\" class=\"gds-label-l gem-menu-item-label\">Escuro</span><!----></span></span><div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!----></button>",
      "</div></div></div></div>"
    ].join("");
  }

  function getHelpSubmenuTemplate() {
    var boxStyle = isSideNavExpanded() ? HELP_SUBMENU_EXPANDED_BOX_STYLE : HELP_SUBMENU_COLLAPSED_BOX_STYLE;

    return [
      "<div class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\" style=\"" + boxStyle + "\">",
      "<div id=\"cdk-overlay-7\" class=\"cdk-overlay-pane\" style=\"position: static; transform: translateY(-8px);\">",
      "<div tabindex=\"-1\" role=\"menu\" class=\"mat-mdc-menu-panel lm-menu-theme mat-menu-after mat-menu-below mat-menu-panel-animations-disabled ng-star-inserted\" id=\"" + HELP_SUBMENU_ID + "\" style=\"transform-origin: left top;\">",
      "<div class=\"mat-mdc-menu-content\">",
      "<button _ngcontent-ng-c2369618414=\"\" mat-menu-item=\"\" lmmenuitemtheme=\"\" data-test-id=\"help-and-support-button\" class=\"mat-mdc-menu-item mat-focus-indicator lm-menu-item-theme ng-star-inserted\" jslog=\"173917;track:generic_click,impression\" role=\"menuitem\" tabindex=\"0\" aria-disabled=\"false\"><span class=\"mat-mdc-menu-item-text\"><gem-icon _ngcontent-ng-c2369618414=\"\" size=\"large\" class=\"gds-icon-l gem-menu-item-icon\" _nghost-ng-c206654976=\"\"><mat-icon _ngcontent-ng-c206654976=\"\" role=\"img\" class=\"mat-icon notranslate lm-icon-l lumi-symbols mat-ligature-font mat-icon-no-color ng-star-inserted\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"help\" data-mat-icon-namespace=\"lumi-symbols\" fonticon=\"help\"></mat-icon><!----><!----><!----></gem-icon><span _ngcontent-ng-c2369618414=\"\" class=\"gds-label-l gem-menu-item-label\">Central de Ajuda</span></span><div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!----></button>",
      "<!----><a _ngcontent-ng-c2369618414=\"\" mat-menu-item=\"\" lmmenuitemtheme=\"\" queryparamshandling=\"merge\" target=\"_blank\" rel=\"noopener\" aria-describedby=\"describe-links-opening-new-window\" class=\"mat-mdc-menu-item mat-focus-indicator lm-menu-item-theme ng-star-inserted\" href=\"https://support.google.com/gemini?p=privacy_help&amp;authuser=4\" jslog=\"186613;track:generic_click,impression\" role=\"menuitem\" tabindex=\"0\" aria-disabled=\"false\"><span class=\"mat-mdc-menu-item-text\"><gem-icon _ngcontent-ng-c2369618414=\"\" size=\"large\" class=\"gds-icon-l gem-menu-item-icon\" _nghost-ng-c206654976=\"\"><mat-icon _ngcontent-ng-c206654976=\"\" role=\"img\" class=\"mat-icon notranslate lm-icon-l lumi-symbols mat-ligature-font mat-icon-no-color ng-star-inserted\" aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"privacy_tip\" data-mat-icon-namespace=\"lumi-symbols\" fonticon=\"privacy_tip\"></mat-icon><!----><!----><!----></gem-icon><span _ngcontent-ng-c2369618414=\"\" class=\"gds-label-l gem-menu-item-label\">Privacidade</span></span><div matripple=\"\" class=\"mat-ripple mat-mdc-menu-ripple\"></div><!----></a><!---->",
      "</div></div></div></div>"
    ].join("");
  }

  function isSideNavExpanded() {
    return Boolean(document.querySelector("bard-sidenav .sidenav-with-history-container.expanded"));
  }

  function getSettingsMenuTemplate() {
    var template = window.GEMINI_SETTINGS_MENU_EXPANDED_TEMPLATE || "";

    if (!template || isSideNavExpanded()) {
      return template;
    }

    return template
      .replace(SETTINGS_MENU_EXPANDED_BOX_STYLE, SETTINGS_MENU_COLLAPSED_BOX_STYLE)
      .replace(/class="mat-mdc-menu-panel[^"]*"/, "class=\"" + SETTINGS_MENU_COLLAPSED_PANEL_CLASS + "\"");
  }

  function closeSettingsMenu() {
    var wrapper = getSettingsMenuWrapper();

    if (wrapper) {
      wrapper.remove();
    }

    document.querySelectorAll("bard-sidenav button[data-test-id='mavatar-footer-settings-button'], bard-sidenav button[aria-label='Configurações']").forEach(function (button) {
      button.setAttribute("aria-expanded", "false");
    });
  }

  function setThemeMenuOpen(button, open) {
    if (!button) {
      return;
    }

    button.classList.toggle("mat-mdc-menu-item-highlighted", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      button.setAttribute("aria-controls", THEME_SUBMENU_ID);
    } else {
      button.removeAttribute("aria-controls");
    }
  }

  function setHelpMenuOpen(button, open) {
    if (!button) {
      return;
    }

    button.classList.toggle("mat-mdc-menu-item-highlighted", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      button.setAttribute("aria-controls", HELP_SUBMENU_ID);
    } else {
      button.removeAttribute("aria-controls");
    }
  }

  function closeThemeSubmenu() {
    var submenu = getThemeSubmenu();
    var box = submenu ? submenu.closest(".cdk-overlay-connected-position-bounding-box") : null;
    var button = document.querySelector("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='desktop-theme-menu-button']");

    if (box) {
      box.remove();
    }

    setThemeMenuOpen(button, false);
  }

  function closeHelpSubmenu() {
    var submenu = getHelpSubmenu();
    var box = submenu ? submenu.closest(".cdk-overlay-connected-position-bounding-box") : null;
    var button = document.querySelector("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='help-button']");

    if (box) {
      box.remove();
    }

    setHelpMenuOpen(button, false);
  }

  function openThemeSubmenu(button) {
    var wrapper = getSettingsMenuWrapper();
    var overlayContainer = wrapper ? wrapper.querySelector(".cdk-overlay-container") : null;

    closeHelpSubmenu();

    if (!button || !overlayContainer || getThemeSubmenu()) {
      setThemeMenuOpen(button, true);
      return;
    }

    overlayContainer.insertAdjacentHTML("beforeend", getThemeSubmenuTemplate());
    setThemeMenuOpen(button, true);
  }

  function openHelpSubmenu(button) {
    var wrapper = getSettingsMenuWrapper();
    var overlayContainer = wrapper ? wrapper.querySelector(".cdk-overlay-container") : null;

    closeThemeSubmenu();

    if (!button || !overlayContainer || getHelpSubmenu()) {
      setHelpMenuOpen(button, true);
      return;
    }

    overlayContainer.insertAdjacentHTML("beforeend", getHelpSubmenuTemplate());
    setHelpMenuOpen(button, true);
  }

  function isThemeMenuArea(target) {
    return Boolean(target && target.closest && (
      target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='desktop-theme-menu-button']") ||
      target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " #" + THEME_SUBMENU_ID)
    ));
  }

  function isHelpMenuArea(target) {
    return Boolean(target && target.closest && (
      target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " button[data-test-id='help-button']") ||
      target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " #" + HELP_SUBMENU_ID)
    ));
  }

  function openSettingsMenu(button) {
    var template = getSettingsMenuTemplate();
    var wrapper = getSettingsMenuWrapper();

    ensureSettingsMenuStyles();

    if (!template || !button) {
      return;
    }

    if (wrapper) {
      wrapper.remove();
    }

    wrapper = document.createElement("div");
    wrapper.id = SETTINGS_MENU_WRAPPER_ID;
    wrapper.innerHTML = template;
    document.body.appendChild(wrapper);
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "true");
  }

  function toggleSettingsMenu(button) {
    if (getSettingsMenuWrapper()) {
      closeSettingsMenu();
      return;
    }

    openSettingsMenu(button);
  }

  function syncOpenButton(expanded) {
    var button = getOpenButton();

    if (!button) {
      return;
    }

    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    button.style.display = expanded ? "none" : "flex";
  }

  function replaceSideNav(markup) {
    var container = getSideNavContainer();
    var currentContent = container ? container.querySelector("bard-sidenav-content") : null;
    var template;
    var nextContainer;
    var nextContent;

    if (!container || !markup) {
      return false;
    }

    template = document.createElement("template");
    template.innerHTML = markup.trim();
    nextContainer = template.content.querySelector("bard-sidenav-container");
    nextContent = nextContainer ? nextContainer.querySelector("bard-sidenav-content") : null;

    if (currentContent && nextContent) {
      nextContent.outerHTML = currentContent.outerHTML;
    }

    container.outerHTML = nextContainer ? nextContainer.outerHTML : markup;
    return true;
  }

  function openSideNav() {
    var openTemplate = window.GEMINI_SIDENAV_OPEN_TEMPLATE || "";

    closeSettingsMenu();
    ensureCloseButtonStyles();
    rememberCollapsedTemplate();

    if (replaceSideNav(openTemplate)) {
      syncOpenButton(true);
    }
  }

  function closeSideNav() {
    closeSettingsMenu();

    if (replaceSideNav(collapsedTemplate)) {
      syncOpenButton(false);
    }
  }

  function isOpenTrigger(target) {
    return Boolean(target && target.closest && target.closest(
      "side-nav-sparkle-button button.side-nav-sparkle-button[aria-label='Abrir barra lateral'], " +
      "button[data-test-id='side-nav-sparkle-button'][aria-label='Abrir barra lateral']"
    ));
  }

  function isCloseTrigger(target) {
    return Boolean(target && target.closest && target.closest(
      "button.close-sidenav-button, button[aria-label='Fechar barra lateral']"
    ));
  }

  function getExpandableSectionToggle(target) {
    return target && target.closest
      ? target.closest("expandable-section[data-test-id='notebooks-expandable-section'] button[data-test-id='expandable-section-toggle']")
      : null;
  }

  function getCloseButton(target) {
    return target && target.closest
      ? target.closest("button.close-sidenav-button, button[aria-label='Fechar barra lateral']")
      : null;
  }

  function isTooltipElement(target) {
    return Boolean(target && target.closest && target.closest(
      "#gemini-new-chat-tooltip-overlay, #gemini-input-tooltip-overlay, #gemini-top-tooltip-overlay, .mat-mdc-tooltip-panel, mat-tooltip-component"
    ));
  }

  function setCloseButtonHover(button, active) {
    var icon = button ? button.querySelector("mat-icon") : null;
    var iconName = active ? CLOSE_ICON_HOVER : CLOSE_ICON_DEFAULT;

    if (!icon) {
      return;
    }

    icon.setAttribute("data-mat-icon-name", iconName);
    icon.setAttribute("fonticon", iconName);
  }

  function setIconName(icon, iconName) {
    if (!icon) {
      return;
    }

    icon.setAttribute("data-mat-icon-name", iconName);
    icon.setAttribute("fonticon", iconName);
  }

  function setExpandableSectionExpanded(section, expanded) {
    var button = section ? section.querySelector("button[data-test-id='expandable-section-toggle']") : null;
    var icon = section ? section.querySelector(".toggle-icon mat-icon") : null;
    var content = section ? section.querySelector("[data-test-id='expandable-section-content']") : null;

    if (!section || !button) {
      return;
    }

    section.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    setIconName(icon, expanded ? NOTEBOOKS_ICON_EXPANDED : NOTEBOOKS_ICON_COLLAPSED);

    if (content) {
      content.setAttribute("aria-hidden", expanded ? "false" : "true");
    }
  }

  function getShortcutItem(target) {
    return target && target.closest
      ? target.closest("bard-sidenav gem-nav-list-item[data-test-id='new-chat-button'], bard-sidenav gem-nav-list-item[data-test-id='search-chats-button']")
      : null;
  }

  function getShortcutText(item) {
    var testId = item ? item.getAttribute("data-test-id") : "";

    if (testId === "new-chat-button") {
      return "Ctrl+Shift+O";
    }

    if (testId === "search-chats-button") {
      return "Ctrl+Shift+K";
    }

    return "";
  }

  function setShortcutHover(item, active) {
    var meta = item ? item.querySelector(".mat-mdc-list-item-meta") : null;
    var existing = meta ? meta.querySelector(".trailing-text-container") : null;
    var shortcut = getShortcutText(item);

    if (!meta || !shortcut) {
      return;
    }

    if (!active) {
      if (existing) {
        existing.remove();
      }

      return;
    }

    if (!existing) {
      existing = document.createElement("span");
      existing.setAttribute("_ngcontent-ng-c612841082", "");
      existing.className = "trailing-text-container gds-body-s ng-star-inserted";
      meta.insertBefore(existing, meta.firstChild);
    }

    existing.textContent = shortcut;
  }

  function clearShortcutHovers(exceptItem) {
    document.querySelectorAll("bard-sidenav gem-nav-list-item[data-test-id='new-chat-button'], bard-sidenav gem-nav-list-item[data-test-id='search-chats-button']").forEach(function (item) {
      if (item !== exceptItem) {
        setShortcutHover(item, false);
      }
    });
  }

  function syncShortcutHover(target) {
    var shortcutItem = getShortcutItem(target);

    clearShortcutHovers(shortcutItem);

    if (shortcutItem) {
      setShortcutHover(shortcutItem, true);
    }
  }

  document.addEventListener("click", function (event) {
    var settingsButton = getSettingsButton(event.target);
    var settingsWrapper = getSettingsMenuWrapper();
    var newChatButton = getNewChatButton(event.target);
    var personalIntelligenceItem = getPersonalIntelligenceMenuItem(event.target);
    var savedInfoLink = getSavedInfoLink(event.target);
    var savedInfoAddButton = getSavedInfoAddButton(event.target);
    var deleteAllMemoriesButton = getDeleteAllMemoriesButton(event.target);
    var memoryActionsButton = getMemoryActionsButton(event.target);
    var memoryActionDeleteButton = getMemoryActionDeleteButton(event.target);
    var memoryActionEditButton = getMemoryActionEditButton(event.target);
    var deleteMemoryCancelButton = getDeleteMemoryCancelButton(event.target);
    var deleteMemoryConfirmButton = getDeleteMemoryConfirmButton(event.target);
    var deleteAllMemoriesCancelButton = getDeleteAllMemoriesCancelButton(event.target);
    var deleteAllMemoriesConfirmButton = getDeleteAllMemoriesConfirmButton(event.target);
    var personalMemoryToggle = getPersonalMemoryToggleButton(event.target);
    var savedInfoMemoryToggle = getSavedInfoMemoryToggleButton(event.target);
    var expandableToggle = getExpandableSectionToggle(event.target);

    if (settingsButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleSettingsMenu(settingsButton);
      return;
    }

    if (newChatButton) {
      event.preventDefault();
      event.stopPropagation();
      renderChatIndexPage();
      return;
    }

    if (personalIntelligenceItem) {
      event.preventDefault();
      event.stopPropagation();
      renderPersonalIntelligencePage();
      return;
    }

    if (savedInfoLink) {
      event.preventDefault();
      event.stopPropagation();
      renderSavedInfoPage();
      return;
    }

    if (savedInfoAddButton) {
      event.preventDefault();
      event.stopPropagation();
      openEditMemoryDialog();
      return;
    }

    if (memoryActionsButton) {
      event.preventDefault();
      event.stopPropagation();
      openMemoryActionsMenu(memoryActionsButton);
      return;
    }

    if (memoryActionEditButton) {
      var editIndex = Number(memoryActionEditButton.getAttribute("data-memory-index"));
      var editMemory = getSavedMemories()[editIndex] || "";

      event.preventDefault();
      event.stopPropagation();
      closeMemoryActionsMenu();
      openEditMemoryDialog({
        mode: "edit",
        memoryIndex: editIndex,
        initialValue: editMemory
      });
      return;
    }

    if (memoryActionDeleteButton) {
      event.preventDefault();
      event.stopPropagation();
      openDeleteMemoryDialog(Number(memoryActionDeleteButton.getAttribute("data-memory-index")));
      return;
    }

    if (deleteMemoryCancelButton) {
      event.preventDefault();
      event.stopPropagation();
      closeDeleteMemoryDialog();
      return;
    }

    if (deleteMemoryConfirmButton) {
      event.preventDefault();
      event.stopPropagation();
      deleteSavedMemory(Number(deleteMemoryConfirmButton.closest("gem-button").getAttribute("data-memory-index")));
      closeDeleteMemoryDialog();
      syncSavedInfoPage();
      showSavedInfoSnackbar("Informa\u00e7\u00f5es exclu\u00eddas");
      return;
    }

    if (deleteAllMemoriesButton) {
      event.preventDefault();
      event.stopPropagation();
      openDeleteAllMemoriesDialog();
      return;
    }

    if (deleteAllMemoriesCancelButton) {
      event.preventDefault();
      event.stopPropagation();
      closeDeleteAllMemoriesDialog();
      return;
    }

    if (deleteAllMemoriesConfirmButton) {
      event.preventDefault();
      event.stopPropagation();
      setSavedMemories([]);
      closeDeleteAllMemoriesDialog();
      syncSavedInfoPage();
      showSavedInfoSnackbar("Todas as informa\u00e7\u00f5es foram exclu\u00eddas", "delete-all-snackbar");
      return;
    }

    if (event.target.closest && event.target.closest("#" + MEMORY_ACTIONS_MENU_WRAPPER_ID + " .cdk-overlay-backdrop")) {
      event.preventDefault();
      event.stopPropagation();
      closeMemoryActionsMenu();
      return;
    }

    if (event.target.closest && event.target.closest("#" + DELETE_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop")) {
      event.preventDefault();
      event.stopPropagation();
      closeDeleteMemoryDialog();
      return;
    }

    if (event.target.closest && event.target.closest("#" + DELETE_ALL_MEMORIES_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop")) {
      event.preventDefault();
      event.stopPropagation();
      closeDeleteAllMemoriesDialog();
      return;
    }

    if (event.target.closest && event.target.closest("#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " .cdk-overlay-backdrop, #" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " button[mat-dialog-close]")) {
      event.preventDefault();
      event.stopPropagation();
      closeEditMemoryDialog();
      return;
    }

    if (personalMemoryToggle) {
      event.preventDefault();
      event.stopPropagation();
      togglePersonalMemory(personalMemoryToggle);
      return;
    }

    if (savedInfoMemoryToggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleSavedInfoMemory(savedInfoMemoryToggle);
      return;
    }

    if (settingsWrapper && event.target.closest && event.target.closest("#" + SETTINGS_MENU_WRAPPER_ID + " .cdk-overlay-backdrop")) {
      event.preventDefault();
      event.stopPropagation();
      closeSettingsMenu();
      return;
    }

    if (settingsWrapper && (!event.target.closest || !event.target.closest("#" + SETTINGS_MENU_WRAPPER_ID))) {
      closeSettingsMenu();
    }

    if (expandableToggle) {
      var section = expandableToggle.closest("expandable-section[data-test-id='notebooks-expandable-section']");
      var expanded = section ? section.classList.contains("expanded") : false;

      event.preventDefault();
      event.stopPropagation();
      setExpandableSectionExpanded(section, !expanded);
      return;
    }

    if (isOpenTrigger(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      openSideNav();
      return;
    }

    if (isCloseTrigger(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      closeSideNav();
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && getDeleteAllMemoriesDialogWrapper()) {
      event.preventDefault();
      closeDeleteAllMemoriesDialog();
      return;
    }

    if (event.key === "Escape" && getDeleteMemoryDialogWrapper()) {
      event.preventDefault();
      closeDeleteMemoryDialog();
      return;
    }

    if (event.key === "Escape" && getMemoryActionsMenuWrapper()) {
      event.preventDefault();
      closeMemoryActionsMenu();
      return;
    }

    if (event.key === "Escape" && getEditMemoryDialogWrapper()) {
      event.preventDefault();
      closeEditMemoryDialog();
      return;
    }

    if (event.key === "Escape" && getSettingsMenuWrapper()) {
      event.preventDefault();
      closeSettingsMenu();
    }
  }, true);

  document.addEventListener("pointerover", function (event) {
    var themeButton = getThemeMenuButton(event.target);
    var helpButton = getHelpMenuButton(event.target);
    var button = getCloseButton(event.target);

    syncShortcutHover(event.target);

    if (themeButton) {
      openThemeSubmenu(themeButton);
    } else if (helpButton) {
      openHelpSubmenu(helpButton);
    } else if (getSettingsMenuWrapper()) {
      if (!isThemeMenuArea(event.target)) {
        closeThemeSubmenu();
      }

      if (!isHelpMenuArea(event.target)) {
        closeHelpSubmenu();
      }
    }

    if (button) {
      setCloseButtonHover(button, true);
    }
  }, true);

  document.addEventListener("pointermove", function (event) {
    syncShortcutHover(event.target);

    if (getSettingsMenuWrapper() && !isThemeMenuArea(event.target)) {
      closeThemeSubmenu();
    }

    if (getSettingsMenuWrapper() && !isHelpMenuArea(event.target)) {
      closeHelpSubmenu();
    }
  }, true);

  document.addEventListener("pointerout", function (event) {
    var button = getCloseButton(event.target);
    var relatedTarget = event.relatedTarget;

    syncShortcutHover(relatedTarget);

    if (getSettingsMenuWrapper() && !isThemeMenuArea(relatedTarget)) {
      closeThemeSubmenu();
    }

    if (getSettingsMenuWrapper() && !isHelpMenuArea(relatedTarget)) {
      closeHelpSubmenu();
    }

    if (button && !isTooltipElement(relatedTarget) && (!relatedTarget || !button.contains(relatedTarget))) {
      setCloseButtonHover(button, false);
    }
  }, true);

  document.addEventListener("mouseout", function (event) {
    var relatedTarget = event.relatedTarget;

    if (isTooltipElement(event.target) && !isTooltipElement(relatedTarget) && !getCloseButton(relatedTarget)) {
      document.querySelectorAll("button.close-sidenav-button, button[aria-label='Fechar barra lateral']").forEach(function (button) {
        setCloseButtonHover(button, false);
      });
    }
  }, true);

  document.addEventListener("mouseover", function (event) {
    var button = getCloseButton(event.target);

    if (button) {
      setCloseButtonHover(button, true);
    }
  });

  document.addEventListener("mouseout", function (event) {
    var button = getCloseButton(event.target);
    var relatedTarget = event.relatedTarget;

    if (button && !isTooltipElement(relatedTarget) && (!relatedTarget || !button.contains(relatedTarget))) {
      setCloseButtonHover(button, false);
    }
  });

  document.addEventListener("focusin", function (event) {
    var shortcutItem = getShortcutItem(event.target);
    var button = getCloseButton(event.target);

    if (shortcutItem) {
      setShortcutHover(shortcutItem, true);
    }

    if (button) {
      setCloseButtonHover(button, true);
    }
  });

  document.addEventListener("focusout", function (event) {
    var shortcutItem = getShortcutItem(event.target);
    var button = getCloseButton(event.target);

    if (shortcutItem) {
      setShortcutHover(shortcutItem, false);
    }

    if (button) {
      setCloseButtonHover(button, false);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      ensureCloseButtonStyles();
      rememberCollapsedTemplate();
      rememberInitialChatContentTemplate();
      syncOpenButton(false);
    });
  } else {
    ensureCloseButtonStyles();
    rememberCollapsedTemplate();
    rememberInitialChatContentTemplate();
    syncOpenButton(false);
  }
})();
