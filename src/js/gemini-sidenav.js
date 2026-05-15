(function () {
  "use strict";

  var collapsedTemplate = "";
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

  function getSavedInfoAddButton(target) {
    return target && target.closest
      ? target.closest("saved-info-page button.create-memory-button")
      : null;
  }

  function getEditMemoryDialogWrapper() {
    return document.getElementById(EDIT_MEMORY_DIALOG_WRAPPER_ID);
  }

  function getEditMemoryDialogTemplate() {
    return "<div class=\"cdk-overlay-container\"><div class=\"cdk-overlay-backdrop cdk-overlay-backdrop-noop-animation cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing\"></div><div class=\"cdk-global-overlay-wrapper\" dir=\"ltr\" style=\"justify-content: center; align-items: center;\"><div id=\"cdk-overlay-5\" class=\"cdk-overlay-pane mat-mdc-dialog-panel\" style=\"width: calc(-48px + 100vw); max-width: 600px; position: static;\"><div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div><mat-dialog-container tabindex=\"-1\" class=\"mat-mdc-dialog-container mdc-dialog cdk-dialog-container mdc-dialog--open _mat-animation-noopable mat-mdc-dialog-container-with-actions\" id=\"mat-mdc-dialog-0\" role=\"dialog\" aria-modal=\"false\" aria-labelledby=\"mat-mdc-dialog-title-0\"><div class=\"mat-mdc-dialog-inner-container mdc-dialog__container\"><div class=\"mat-mdc-dialog-surface mdc-dialog__surface\"><edit-memory-dialog _nghost-ng-c4208921684=\"\" class=\"mat-mdc-dialog-component-host ng-star-inserted\"><h1 _ngcontent-ng-c4208921684=\"\" mat-dialog-title=\"\" class=\"mat-mdc-dialog-title mdc-dialog__title gds-title-l\" id=\"mat-mdc-dialog-title-0\">O que você quer que o Gemini memorize?</h1><mat-dialog-content _ngcontent-ng-c4208921684=\"\" class=\"mat-mdc-dialog-content mdc-dialog__content\"><mat-form-field _ngcontent-ng-c4208921684=\"\" appearance=\"outline\" subscriptsizing=\"dynamic\" class=\"mat-mdc-form-field edit-memory-form-field mat-mdc-form-field-type-mat-input mat-form-field-appearance-outline mat-primary ng-valid ng-touched\"><!----><div class=\"mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label\"><!----><div class=\"mat-mdc-form-field-flex\"><div matformfieldnotchedoutline=\"\" class=\"mdc-notched-outline mdc-notched-outline--no-label ng-star-inserted\"><div class=\"mat-mdc-notch-piece mdc-notched-outline__leading\"></div><div class=\"mat-mdc-notch-piece mdc-notched-outline__notch\"><!----><!----><!----></div><div class=\"mat-mdc-notch-piece mdc-notched-outline__trailing\"></div></div><!----><!----><!----><div class=\"mat-mdc-form-field-infix\"><!----><textarea _ngcontent-ng-c4208921684=\"\" rows=\"1\" matinput=\"\" cdktextareaautosize=\"\" aria-label=\"Inserir nova memória\" placeholder=\"Por exemplo: &quot;Prefiro respostas curtas e concisas&quot;\" class=\"cdk-textarea-autosize mat-mdc-input-element edit-memory-input mat-mdc-form-field-textarea-control mat-mdc-form-field-input-control mdc-text-field__input ng-pristine ng-valid cdk-text-field-autofill-monitored ng-touched\" id=\"mat-input-0\" aria-invalid=\"false\" aria-required=\"false\" maxlength=\"10000\" style=\"height: 24px;\">    </textarea></div><!----><!----></div><!----></div><div aria-atomic=\"true\" aria-live=\"polite\" class=\"mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align mat-mdc-form-field-subscript-dynamic-size\"><!----><div class=\"mat-mdc-form-field-hint-wrapper ng-star-inserted\"><!----><div class=\"mat-mdc-form-field-hint-spacer\"></div></div><!----></div></mat-form-field></mat-dialog-content><mat-dialog-actions _ngcontent-ng-c4208921684=\"\" align=\"end\" class=\"mat-mdc-dialog-actions mdc-dialog__actions mat-mdc-dialog-actions-align-end\"><button _ngcontent-ng-c4208921684=\"\" mat-button=\"\" mat-dialog-close=\"\" color=\"primary\" class=\"mdc-button mat-mdc-button-base mat-mdc-button mat-primary _mat-animation-noopable\" mat-ripple-loader-uninitialized=\"\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" type=\"button\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\">Cancelar</span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span></button><button _ngcontent-ng-c4208921684=\"\" mat-flat-button=\"\" data-test-id=\"submit-button\" color=\"primary\" class=\"mdc-button mat-mdc-button-base edit-memory-submit-button mdc-button--unelevated mat-mdc-unelevated-button mat-primary mat-mdc-button-disabled _mat-animation-noopable\" mat-ripple-loader-uninitialized=\"\" mat-ripple-loader-class-name=\"mat-mdc-button-ripple\" mat-ripple-loader-disabled=\"\" disabled=\"true\"><span class=\"mat-mdc-button-persistent-ripple mdc-button__ripple\"></span><span class=\"mdc-button__label\"><span _ngcontent-ng-c4208921684=\"\" class=\"ng-star-inserted\">Enviar</span><!----><!----></span><!----><span class=\"mat-focus-indicator\"></span><span class=\"mat-mdc-button-touch-target\"></span></button></mat-dialog-actions></edit-memory-dialog><!----></div></div></mat-dialog-container><div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div></div></div></div>";
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
      "#" + EDIT_MEMORY_DIALOG_WRAPPER_ID + " textarea.edit-memory-input {",
      "  resize: none;",
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

    if (wrapper) {
      wrapper.remove();
    }
  }

  function openEditMemoryDialog() {
    var wrapper = getEditMemoryDialogWrapper();
    var textarea;

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
      textarea.value = "";
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }

  function getPersonalMemoryToggleButton(target) {
    return target && target.closest
      ? target.closest("personal-intelligence-page mat-slide-toggle[data-test-id='enable-personal-gemini-context-toggle'] button[role='switch']")
      : null;
  }

  function togglePersonalMemory(button) {
    var slideToggle = button ? button.closest("mat-slide-toggle[data-test-id='enable-personal-gemini-context-toggle']") : null;
    var checked = button ? button.getAttribute("aria-checked") === "true" : false;
    var nextChecked = !checked;

    if (!button || !slideToggle) {
      return;
    }

    slideToggle.classList.toggle("mat-mdc-slide-toggle-checked", nextChecked);
    button.classList.toggle("mdc-switch--selected", nextChecked);
    button.classList.toggle("mdc-switch--checked", nextChecked);
    button.classList.toggle("mdc-switch--unselected", !nextChecked);
    button.setAttribute("aria-checked", nextChecked ? "true" : "false");
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

  function renderPersonalIntelligencePage() {
    var content = document.querySelector("bard-sidenav-content");
    var template = window.GEMINI_PERSONAL_INTELLIGENCE_TEMPLATE || "";

    if (!content || !template) {
      return;
    }

    ensurePersonalIntelligenceStyles();
    ensurePersonalIntelligenceTopControlsStyle();
    document.body.classList.add(PERSONAL_INTELLIGENCE_ACTIVE_CLASS);
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
    document.body.classList.add(PERSONAL_INTELLIGENCE_ACTIVE_CLASS);
    content.outerHTML = template;
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
    var personalIntelligenceItem = getPersonalIntelligenceMenuItem(event.target);
    var savedInfoLink = getSavedInfoLink(event.target);
    var savedInfoAddButton = getSavedInfoAddButton(event.target);
    var personalMemoryToggle = getPersonalMemoryToggleButton(event.target);
    var expandableToggle = getExpandableSectionToggle(event.target);

    if (settingsButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleSettingsMenu(settingsButton);
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
      syncOpenButton(false);
    });
  } else {
    ensureCloseButtonStyles();
    rememberCollapsedTemplate();
    syncOpenButton(false);
  }
})();
