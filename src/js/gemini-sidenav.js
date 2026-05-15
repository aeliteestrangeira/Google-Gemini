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

    if (!container || !markup) {
      return false;
    }

    container.outerHTML = markup;
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
    var expandableToggle = getExpandableSectionToggle(event.target);

    if (settingsButton) {
      event.preventDefault();
      event.stopPropagation();
      toggleSettingsMenu(settingsButton);
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
