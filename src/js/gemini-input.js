(function () {
  "use strict";

  var PLACEHOLDER = "Pe\u00e7a ao Gemini";
  var editorSelector = ".ql-editor[contenteditable='true'][data-placeholder]";
  var inputAreaSelector = ".input-area";
  var overlayId = "gemini-plus-menu-overlay";
  var overlayTranslate = "translateY(8px)";
  var activePlusButton = null;
  var modeOverlayId = "gemini-mode-menu-overlay";
  var modeOverlayTranslate = "translateY(4px)";
  var activeModeButton = null;
  var newChatTooltipId = "gemini-new-chat-tooltip-overlay";
  var newChatTooltipTranslate = "translateX(8px)";
  var activeNewChatTooltipTarget = null;
  var activeNewChatTooltipLabel = "";
  var inputTooltipId = "gemini-input-tooltip-overlay";
  var inputTooltipTranslate = "translateY(8px)";
  var activeInputTooltipTarget = null;
  var activeInputTooltipLabel = "";
  var topTooltipId = "gemini-top-tooltip-overlay";
  var topTooltipTranslate = "translateX(-8px)";
  var activeTopTooltipTarget = null;
  var activeTopTooltipLabel = "";
  var modeStorageKey = "gemini-selected-mode";
  var modeOptions = [
    {
      id: "fbb127bbb056c959",
      label: "R\u00e1pido",
      sublabel: "Respostas r\u00e1pidas"
    },
    {
      id: "5bf011840784117a",
      label: "Racioc\u00ednio",
      sublabel: "Resolve problemas complexos"
    },
    {
      id: "9d8ca3786ebdfbea",
      label: "Pro",
      sublabel: "Matem\u00e1tica e programa\u00e7\u00e3o avan\u00e7adas com o 3.1 Pro"
    }
  ];

  function getText(editor) {
    return (editor.textContent || "").replace(/\u00a0/g, " ").trim();
  }

  function setAriaDisabled(element, disabled) {
    if (!element) {
      return;
    }

    element.setAttribute("aria-disabled", disabled ? "true" : "false");
  }

  function setTabIndex(element, enabled) {
    if (!element) {
      return;
    }

    element.setAttribute("tabindex", enabled ? "0" : "-1");
  }

  function syncEditor(editor) {
    var hasText = getText(editor).length > 0;
    var inputArea = editor.closest(inputAreaSelector);

    editor.setAttribute("data-placeholder", PLACEHOLDER);
    editor.classList.toggle("ql-blank", !hasText);

    if (!inputArea) {
      return;
    }

    var micContainer = inputArea.querySelector(".mic-button-container");
    var sendContainer = inputArea.querySelector(".send-button-container.inner");
    var sendButton = sendContainer ? sendContainer.querySelector(".send-button") : null;
    var sendNativeButton = sendContainer ? sendContainer.querySelector("button") : null;

    if (micContainer) {
      micContainer.classList.toggle("hidden", hasText);
    }

    if (sendContainer) {
      sendContainer.classList.toggle("visible", hasText);
      sendContainer.classList.toggle("disabled", !hasText);
      sendContainer.classList.toggle("mat-mdc-tooltip-disabled", !hasText);
    }

    if (sendButton) {
      sendButton.classList.toggle("has-input", hasText);
      setAriaDisabled(sendButton, !hasText);
      setTabIndex(sendButton, hasText);
    }

    setAriaDisabled(sendNativeButton, !hasText);
  }

  function bindEditor(editor) {
    if (editor.dataset.geminiInputBound === "true") {
      syncEditor(editor);
      return;
    }

    editor.dataset.geminiInputBound = "true";
    editor.setAttribute("data-placeholder", PLACEHOLDER);

    editor.addEventListener("input", function () {
      syncEditor(editor);
    });

    editor.addEventListener("keyup", function () {
      syncEditor(editor);
    });

    editor.addEventListener("paste", function () {
      window.requestAnimationFrame(function () {
        syncEditor(editor);
      });
    });

    editor.addEventListener("cut", function () {
      window.requestAnimationFrame(function () {
        syncEditor(editor);
      });
    });

    new MutationObserver(function () {
      syncEditor(editor);
    }).observe(editor, {
      childList: true,
      characterData: true,
      subtree: true
    });

    syncEditor(editor);
  }

  function bindEditors() {
    document.querySelectorAll(editorSelector).forEach(bindEditor);
  }

  function ensureSideNavHoverStyles() {
    if (document.getElementById("gemini-side-nav-hover-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "gemini-side-nav-hover-style";
    style.textContent = [
      "side-nav-sparkle-button button.side-nav-sparkle-button:hover gem-icon,",
      "side-nav-sparkle-button button.side-nav-sparkle-button:focus-visible gem-icon {",
      "  display: inline-flex !important;",
      "}",
      "side-nav-sparkle-button button.side-nav-sparkle-button:hover .sparkle-image-container,",
      "side-nav-sparkle-button button.side-nav-sparkle-button:focus-visible .sparkle-image-container {",
      "  display: none !important;",
      "}",
      "side-nav-sparkle-button button.side-nav-sparkle-button:hover .mat-ripple,",
      "side-nav-sparkle-button button.side-nav-sparkle-button:focus-visible .mat-ripple {",
      "  display: block;",
      "}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function getPlusButton(target) {
    var button = target.closest
      ? target.closest(".simplified-input-menu button[aria-haspopup='menu']")
      : null;

    if (button && button.querySelector("mat-icon[fonticon='plus'], mat-icon[data-mat-icon-name='plus']")) {
      return button;
    }

    return null;
  }

  function getModeButton(target) {
    return target.closest
      ? target.closest("button[data-test-id='bard-mode-menu-button'], button.input-area-switch[aria-haspopup='true']")
      : null;
  }

  function getSideNavTooltipInfo(target) {
    var closeButton = target.closest
      ? target.closest("button.close-sidenav-button, button[aria-label='Fechar barra lateral']")
      : null;

    if (closeButton) {
      return {
        item: closeButton,
        label: "Fechar barra lateral",
        target: closeButton
      };
    }

    var sparkleButton = target.closest
      ? target.closest("side-nav-sparkle-button button.side-nav-sparkle-button")
      : null;

    if (sparkleButton) {
      return {
        item: sparkleButton,
        label: "Abrir barra lateral",
        target: sparkleButton
      };
    }

    var sideNav = target.closest
      ? target.closest("bard-sidenav")
      : null;
    var sideNavContainer = sideNav
      ? sideNav.querySelector(".sidenav-with-history-container")
      : null;
    var isExpandedSideNav = Boolean(sideNavContainer && sideNavContainer.classList.contains("expanded"));

    if (isExpandedSideNav) {
      return null;
    }

    var settingsButton = target.closest
      ? target.closest("button[data-test-id='mavatar-footer-settings-button']")
      : null;

    if (settingsButton) {
      return {
        item: settingsButton,
        label: "Configura\u00e7\u00f5es",
        target: settingsButton
      };
    }

    var item = target.closest
      ? target.closest("gem-nav-list-item[data-test-id='new-chat-button'], gem-nav-list-item[data-test-id='search-chats-button'], gem-nav-list-item[data-test-id='my-stuff-side-nav-entry-button']")
      : null;

    if (!item) {
      return null;
    }

    var testId = item.getAttribute("data-test-id");
    var label = "Nova conversa";

    if (testId === "search-chats-button") {
      label = "Pesquisar conversas";
    }

    if (testId === "my-stuff-side-nav-entry-button") {
      label = "Biblioteca";
    }

    return {
      item: item,
      label: label,
      target: item.querySelector("a[aria-label='" + label + "']") || item
    };
  }

  function getInputTooltipInfo(target) {
    var micButton = target.closest
      ? target.closest(".mic-button-container button[aria-label='Microfone'], .speech_dictation_mic_button button[aria-label='Microfone']")
      : null;

    if (!micButton) {
      return null;
    }

    return {
      label: "Usar o microfone",
      target: micButton
    };
  }

  function getTopTooltipInfo(target) {
    var tempChatButton = target.closest
      ? target.closest("gem-icon-button[data-test-id='temp-chat-button'] button, temp-chat-button button[aria-label='Conversa moment\\u00e2nea']")
      : null;

    if (!tempChatButton) {
      return null;
    }

    return {
      label: "Ativar conversa moment\u00e2nea",
      target: tempChatButton
    };
  }

  function getOverlayContainer() {
    var container = document.querySelector(".cdk-overlay-container");

    if (!container) {
      container = document.createElement("div");
      container.className = "cdk-overlay-container";
      document.body.appendChild(container);
    }

    return container;
  }

  function ensureOverlayStyles() {
    if (document.getElementById("gemini-plus-menu-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "gemini-plus-menu-style";
    style.textContent = [
      "#" + overlayId + " .gemini-plus-menu-card {",
      "  min-width: 233px;",
      "  width: fit-content;",
      "  max-height: min(440px, 42vh);",
      "  overflow-y: auto;",
      "  box-sizing: border-box;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-list {",
      "  display: flex;",
      "  flex-direction: column;",
      "  gap: 0;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-item {",
      "  display: flex;",
      "  align-items: center;",
      "  width: 100%;",
      "  min-height: 36px;",
      "  border: 0;",
      "  border-radius: var(--gem-sys-shape--corner-medium, 12px);",
      "  background: transparent;",
      "  color: var(--lumi-sys-color--on-surface, var(--gem-sys-color--on-surface, #1f1f1f));",
      "  font: inherit;",
      "  text-align: start;",
      "  cursor: pointer;",
      "  padding: 0 var(--gem-sys-spacing--s, 8px);",
      "}",
      "#" + overlayId + " .gemini-plus-menu-item:hover {",
      "  background: var(--bard-color-lm-states-hover, rgba(31,31,31,.08));",
      "}",
      "#" + overlayId + " .gemini-plus-menu-item .mat-icon,",
      "#" + overlayId + " .gemini-plus-menu-item mat-icon {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  width: 24px;",
      "  height: 24px;",
      "  margin-inline-end: 12px;",
      "  flex: 0 0 auto;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-label-row,",
      "#" + overlayId + " .more-upload-button-content,",
      "#" + overlayId + " .more-tools-content {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 8px;",
      "  flex: 1;",
      "  white-space: nowrap;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-badge {",
      "  border-radius: 999px;",
      "  background: var(--gem-sys-color--primary-container, #d3e3fd);",
      "  color: var(--gem-sys-color--on-primary-container, #041e49);",
      "  font-size: 11px;",
      "  line-height: 16px;",
      "  padding: 0 6px;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-chevron {",
      "  margin-inline-start: auto;",
      "  margin-inline-end: 0;",
      "}",
      "#" + overlayId + " .gemini-plus-menu-divider {",
      "  margin: var(--gem-sys-spacing--s, 8px);",
      "}",
      ".simplified-input-menu .menu-button.gemini-plus-menu-open mat-icon[fonticon='plus'],",
      ".simplified-input-menu .menu-button.gemini-plus-menu-open mat-icon[data-mat-icon-name='plus'] {",
      "  transform: rotate(45deg);",
      "}",
      "#" + modeOverlayId + " {",
      "  pointer-events: auto;",
      "}",
      "#" + modeOverlayId + " .container {",
      "  display: block;",
      "}",
      "#" + modeOverlayId + " .popover-menu {",
      "  display: block;",
      "}",
      "#" + modeOverlayId + " gem-menu {",
      "  display: flex;",
      "  flex-direction: column;",
      "  min-width: 276px;",
      "  padding: var(--gem-sys-spacing--s, 8px);",
      "  border-radius: var(--gem-sys-shape--corner-large-increased, 16px);",
      "  background: var(--lumi-sys-color--surface-bright, var(--gem-sys-color--surface-bright, #fff));",
      "  box-shadow: var(--lumi-sys-elevation--level1-shadow-offset-x, 0) var(--lumi-sys-elevation--level1-shadow-offset-y, 2px) var(--lumi-sys-elevation--level1-shadow-blur, 8px) var(--lumi-sys-elevation--level1-shadow-spread, 0) var(--bard-color-lm-elevation-level1-color, rgba(60,64,67,.24));",
      "  color: var(--lumi-sys-color--on-surface, var(--gem-sys-color--on-surface, #1f1f1f));",
      "  outline: 0;",
      "}",
      "#" + modeOverlayId + " gem-menu-item {",
      "  display: block;",
      "  border-radius: var(--gem-sys-shape--corner-medium, 12px);",
      "  cursor: pointer;",
      "  outline: 0;",
      "}",
      "#" + modeOverlayId + " gem-menu-item:hover {",
      "  background: var(--bard-color-lm-states-hover, rgba(31,31,31,.08));",
      "}",
      "#" + modeOverlayId + " gem-menu-item.selected {",
      "  background: transparent;",
      "}",
      "#" + modeOverlayId + " gem-menu-item.selected:hover,",
      "#" + modeOverlayId + " gem-menu-item.selected.gemini-mode-item-hover {",
      "  background: var(--bard-color-lm-states-hover, rgba(31,31,31,.08));",
      "}",
      "#" + modeOverlayId + " gem-menu.gemini-mode-hovering-other gem-menu-item.selected:not(.gemini-mode-item-hover) {",
      "  background: transparent;",
      "}",
      "#" + modeOverlayId + " gem-menu-item-content {",
      "  display: grid;",
      "  grid-template-columns: 32px minmax(0, 1fr) auto;",
      "  align-items: center;",
      "  min-height: 58px;",
      "  padding: 6px 12px 6px 8px;",
      "  box-sizing: border-box;",
      "}",
      "#" + modeOverlayId + " .leading-container,",
      "#" + modeOverlayId + " .trailing-container {",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "}",
      "#" + modeOverlayId + " .label-container {",
      "  display: flex;",
      "  min-width: 0;",
      "  flex-direction: column;",
      "  gap: 2px;",
      "}",
      "#" + modeOverlayId + " .label {",
      "  color: var(--lumi-sys-color--on-surface, var(--gem-sys-color--on-surface, #1f1f1f));",
      "  font-size: 14px;",
      "  line-height: 20px;",
      "  white-space: nowrap;",
      "}",
      "#" + modeOverlayId + " .sublabel {",
      "  color: var(--gem-sys-color--on-surface-variant, #5f6368);",
      "  font-size: 12px;",
      "  line-height: 16px;",
      "  white-space: nowrap;",
      "}",
      "#" + modeOverlayId + " .mat-icon {",
      "  display: inline-flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  width: 20px;",
      "  height: 20px;",
      "}",
      ".input-area-switch.gemini-mode-menu-open {",
      "  background: var(--bard-color-lm-states-pressed, rgba(31,31,31,.12));",
      "}",
      "#" + newChatTooltipId + " {",
      "  pointer-events: none;",
      "}",
      "#" + newChatTooltipId + " .cdk-overlay-pane {",
      "  pointer-events: auto;",
      "}",
      "#" + newChatTooltipId + " .mat-mdc-tooltip-surface {",
      "  white-space: nowrap;",
      "}",
      "#" + inputTooltipId + " {",
      "  pointer-events: none;",
      "}",
      "#" + inputTooltipId + " .cdk-overlay-pane {",
      "  pointer-events: auto;",
      "}",
      "#" + inputTooltipId + " .mat-mdc-tooltip-surface {",
      "  white-space: nowrap;",
      "}",
      "#" + topTooltipId + " {",
      "  pointer-events: none;",
      "}",
      "#" + topTooltipId + " .cdk-overlay-pane {",
      "  pointer-events: auto;",
      "}",
      "#" + topTooltipId + " .mat-mdc-tooltip-surface {",
      "  white-space: nowrap;",
      "}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function iconMarkup(name, namespaceClass) {
    var iconClass = namespaceClass || "lumi-symbols";

    return [
      "<mat-icon role=\"img\" matlistitemicon=\"\" fonticon=\"", name, "\"",
      " class=\"mat-icon notranslate mat-mdc-list-item-icon menu-icon gem-menu-item-icon ",
      iconClass,
      " mat-ligature-font mat-icon-no-color mdc-list-item__start\"",
      " aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"", name, "\">",
      "</mat-icon>"
    ].join("");
  }

  function menuItem(icon, label, options) {
    var settings = options || {};
    var badge = settings.badge
      ? "<span class=\"toolbox-drawer-item-new-badge gds-label-m gem-menu-item-badge gem-menu-item-badge-label gemini-plus-menu-badge\">" + settings.badge + "</span>"
      : "";
    var chevron = settings.chevron
      ? iconMarkup("chevron_right", "lumi-symbols").replace("mdc-list-item__start", "mdc-list-item__start gemini-plus-menu-chevron")
      : "";
    var role = settings.checkbox ? "menuitemcheckbox" : "menuitem";
    var checked = settings.checkbox ? " aria-checked=\"false\"" : "";

    return [
      "<button _ngcontent-ng-c3479086838=\"\" mat-list-item=\"\" lmmenuitemtheme=\"\" role=\"", role, "\"",
      checked,
      " class=\"mat-mdc-list-item mdc-list-item mat-mdc-list-item-interactive mdc-list-item--with-leading-icon _mat-animation-noopable lm-menu-item-theme mat-mdc-list-item-single-line mdc-list-item--with-one-line ng-star-inserted gemini-plus-menu-item\"",
      " type=\"button\" aria-disabled=\"false\">",
      iconMarkup(icon, settings.googleIcon ? "google-symbols" : "lumi-symbols"),
      "<span class=\"mdc-list-item__content\"><span class=\"mat-mdc-list-item-unscoped-content mdc-list-item__primary-text\">",
      "<div class=\"toolbox-drawer-item-content-wrapper lm-theme gemini-plus-menu-label-row\">",
      "<span class=\"label gem-menu-item-label\">", label, "</span>",
      badge,
      chevron,
      "</div></span></span><div class=\"mat-focus-indicator\"></div></button>"
    ].join("");
  }

  function buildPlusMenu() {
    return [
      "<div id=\"", overlayId, "\" class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\" style=\"align-items: flex-start; justify-content: flex-start;\">",
      "<div id=\"cdk-overlay-gemini-plus\" class=\"cdk-overlay-pane\" style=\"position: static; transform: ", overlayTranslate, ";\">",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "<mat-card _ngcontent-ng-c3537748181=\"\" cdktrapfocus=\"\" tabindex=\"-1\" cdkfocusregionstart=\"\" data-test-id=\"card-container\" lmmenutheme=\"\"",
      " class=\"mat-mdc-card mdc-card card-container lm-menu-theme ng-star-inserted gemini-plus-menu-card\">",
      "<mat-action-list _ngcontent-ng-c3537748181=\"\" role=\"menu\" aria-label=\"Op\u00e7\u00f5es do menu\"",
      " class=\"mat-mdc-action-list mat-mdc-list-base mdc-list menu-list-container gemini-plus-menu-list\" aria-disabled=\"false\">",
      "<div _ngcontent-ng-c3537748181=\"\" class=\"ng-star-inserted\">",
      "<uploader _ngcontent-ng-c3537748181=\"\" trace=\"\" _nghost-ng-c1634698457=\"\"><div _ngcontent-ng-c1634698457=\"\" class=\"simplified-file-uploader ng-star-inserted\">",
      "<mat-action-list _ngcontent-ng-c1634698457=\"\" role=\"menu\" aria-label=\"Op\u00e7\u00f5es de upload do arquivo\" class=\"mat-mdc-action-list mat-mdc-list-base mdc-list ui-improvements-phase-1 simplified-input-menu ng-star-inserted gemini-plus-menu-list\" aria-disabled=\"false\">",
      menuItem("attach_file", "Enviar arquivos"),
      menuItem("drive", "Adicionar do Drive", { googleIcon: true }),
      "</mat-action-list>",
      menuItem("more_horiz", "Mais uploads", { googleIcon: true, chevron: true }),
      "</div></uploader>",
      "</div>",
      "<mat-divider _ngcontent-ng-c3537748181=\"\" role=\"separator\" class=\"mat-divider divider mat-divider-horizontal ng-star-inserted gemini-plus-menu-divider\" aria-orientation=\"horizontal\"></mat-divider>",
      "<div _ngcontent-ng-c3537748181=\"\" class=\"ng-star-inserted\">",
      "<toolbox-drawer _ngcontent-ng-c3537748181=\"\" trace=\"\" _nghost-ng-c1199634318=\"\" class=\"ng-tns-c1199634318-10 ng-star-inserted\">",
      "<div _ngcontent-ng-c1199634318=\"\" class=\"content-only-container simplified-input ng-tns-c1199634318-10 ng-star-inserted gemini-plus-menu-list\">",
      menuItem("image_create", "Criar imagem", { checkbox: true, badge: "Novo" }),
      menuItem("canvas", "Canvas", { checkbox: true }),
      menuItem("deep_research", "Deep Research", { checkbox: true }),
      menuItem("music", "Criar m\u00fasica", { checkbox: true, badge: "Novo" }),
      menuItem("more_horiz", "Mais ferramentas", { googleIcon: true, chevron: true }),
      "</div></toolbox-drawer>",
      "</div>",
      "</mat-action-list>",
      "</mat-card>",
      "<div tabindex=\"0\" class=\"cdk-visually-hidden cdk-focus-trap-anchor\" aria-hidden=\"true\"></div>",
      "</div></div>"
    ].join("");
  }

  function positionPlusMenu(button) {
    var overlay = document.getElementById(overlayId);

    if (!overlay || !button) {
      return;
    }

    var origin = button.closest("[cdk-overlay-origin], [cdkoverlayorigin]") || button;
    var rect = origin.getBoundingClientRect();
    var top = Math.round(rect.bottom * 10) / 10;
    var left = Math.round(rect.left * 10) / 10;

    overlay.style.inset = top + "px auto auto " + left + "px";
    overlay.style.width = Math.max(1, window.innerWidth - left) + "px";
    overlay.style.height = Math.max(1, window.innerHeight - top) + "px";
    overlay.style.alignItems = "flex-start";
    overlay.style.justifyContent = "flex-start";

    var pane = overlay.querySelector(".cdk-overlay-pane");
    if (pane) {
      pane.style.position = "static";
      pane.style.transform = overlayTranslate;
    }
  }

  function getModeById(modeId) {
    return modeOptions.find(function (option) {
      return option.id === modeId;
    }) || modeOptions[0];
  }

  function getSavedMode() {
    var savedModeId = "";

    try {
      savedModeId = window.localStorage.getItem(modeStorageKey) || "";
    } catch (error) {
      savedModeId = "";
    }

    return getModeById(savedModeId);
  }

  function saveMode(modeId) {
    try {
      window.localStorage.setItem(modeStorageKey, modeId);
    } catch (error) {
      // The visual state still updates when storage is blocked.
    }
  }

  function updateModeButtonLabel(button, mode) {
    var label = button
      ? button.querySelector(".logo-pill-label-container > span, .input-area-switch-label > span")
      : null;

    if (label) {
      if ((label.textContent || "").trim() !== mode.label) {
        label.textContent = mode.label;
      }
    }
  }

  function syncModeButtons() {
    var mode = getSavedMode();

    document.querySelectorAll("button[data-test-id='bard-mode-menu-button'], button.input-area-switch[aria-haspopup='true']").forEach(function (button) {
      updateModeButtonLabel(button, mode);
    });
  }

  function modeCheckMarkup() {
    return [
      "<gem-icon _ngcontent-ng-c3465594705=\"\" _nghost-ng-c206654976=\"\" class=\"ng-star-inserted\">",
      "<mat-icon _ngcontent-ng-c206654976=\"\" role=\"img\" class=\"mat-icon notranslate lm-icon-m lumi-symbols mat-ligature-font mat-icon-no-color ng-star-inserted\"",
      " aria-hidden=\"true\" data-mat-icon-type=\"font\" data-mat-icon-name=\"check\" data-mat-icon-namespace=\"lumi-symbols\" fonticon=\"check\"></mat-icon>",
      "</gem-icon>"
    ].join("");
  }

  function modeMenuItem(mode, selected) {
    var check = selected
      ? modeCheckMarkup()
      : "";
    var itemClass = selected ? "selected ng-star-inserted" : "ng-star-inserted";
    var contentClass = selected ? "checkmark-only selected active" : "checkmark-only";
    var active = selected ? "true" : "false";
    var tabIndex = selected ? "0" : "-1";

    return [
      "<gem-menu-item _ngcontent-ng-c3954899709=\"\" role=\"menuitem\" _nghost-ng-c581113809=\"\" data-mode-id=\"", mode.id, "\"",
      " data-test-id=\"bard-mode-option-", mode.id, "\" tabindex=\"", tabIndex, "\" data-active=\"", active, "\"",
      " aria-haspopup=\"false\" aria-disabled=\"false\" class=\"", itemClass, "\">",
      "<gem-menu-item-content _ngcontent-ng-c581113809=\"\" _nghost-ng-c3465594705=\"\" class=\"", contentClass, "\">",
      "<div _ngcontent-ng-c3465594705=\"\" class=\"leading-container\">", check, "</div>",
      "<div _ngcontent-ng-c3465594705=\"\" class=\"label-container\">",
      "<span _ngcontent-ng-c3465594705=\"\" class=\"label\"> ", mode.label, " </span>",
      "<div _ngcontent-ng-c3465594705=\"\" class=\"sublabel ng-star-inserted\">", mode.sublabel, "</div>",
      "</div>",
      "<div _ngcontent-ng-c3465594705=\"\" class=\"trailing-container\"></div>",
      "</gem-menu-item-content></gem-menu-item>"
    ].join("");
  }

  function buildModeMenu(button) {
    var controls = button.getAttribute("aria-controls") || "ng-menu-a66998-0";
    var selectedMode = getSavedMode();

    return [
      "<div popover=\"manual\" id=\"", modeOverlayId, "\" class=\"cdk-overlay-popover cdk-overlay-connected-position-bounding-box\" dir=\"ltr\"",
      " style=\"align-items: flex-end; justify-content: flex-start;\">",
      "<div id=\"cdk-overlay-gemini-mode\" class=\"cdk-overlay-pane\" style=\"position: static; transform: ", modeOverlayTranslate, ";\">",
      "<div _ngcontent-ng-c1760435172=\"\" class=\"container ng-star-inserted\">",
      "<div _ngcontent-ng-c3954899709=\"\" data-test-id=\"bard-mode-desktop-gem-menu\" class=\"popover-menu\">",
      "<gem-menu _ngcontent-ng-c3954899709=\"\" role=\"menu\" data-test-id=\"gem-mode-menu\" _nghost-ng-c2999607715=\"\"",
      " id=\"", controls, "\" aria-disabled=\"false\" tabindex=\"-1\" data-visible=\"true\" class=\"ng-star-inserted\">",
      modeOptions.map(function (mode) {
        return modeMenuItem(mode, mode.id === selectedMode.id);
      }).join(""),
      "</gem-menu>",
      "</div></div></div></div>"
    ].join("");
  }

  function positionModeMenu(button) {
    var overlay = document.getElementById(modeOverlayId);

    if (!overlay || !button) {
      return;
    }

    var rect = button.getBoundingClientRect();
    var top = Math.round(rect.bottom * 10) / 10;
    var right = Math.round((window.innerWidth - rect.right) * 10) / 10;

    overlay.style.inset = top + "px " + right + "px auto auto";
    overlay.style.width = Math.max(1, window.innerWidth - right) + "px";
    overlay.style.height = Math.max(1, window.innerHeight - top) + "px";
    overlay.style.alignItems = "flex-end";
    overlay.style.justifyContent = "flex-start";

    var pane = overlay.querySelector(".cdk-overlay-pane");
    if (pane) {
      pane.style.position = "static";
      pane.style.transform = modeOverlayTranslate;
    }
  }

  function syncModeHoverState(menu, hoveredItem) {
    var selectedItem = menu.querySelector("gem-menu-item.selected");

    menu.querySelectorAll("gem-menu-item").forEach(function (item) {
      item.classList.toggle("gemini-mode-item-hover", item === hoveredItem);
    });

    menu.classList.toggle(
      "gemini-mode-hovering-other",
      Boolean(hoveredItem && selectedItem && hoveredItem !== selectedItem)
    );
  }

  function bindModeHoverState(overlay) {
    var menu = overlay ? overlay.querySelector("gem-menu") : null;

    if (!menu) {
      return;
    }

    menu.addEventListener("mouseover", function (event) {
      var item = event.target.closest("gem-menu-item");

      if (item && menu.contains(item)) {
        syncModeHoverState(menu, item);
      }
    });

    menu.addEventListener("mouseleave", function () {
      syncModeHoverState(menu, null);
    });
  }

  function selectModeItem(item) {
    var menu = item.closest("gem-menu");
    var mode = getModeById(item.getAttribute("data-mode-id"));

    saveMode(mode.id);

    if (activeModeButton) {
      updateModeButtonLabel(activeModeButton, mode);
    }

    syncModeButtons();

    if (!menu) {
      return;
    }

    menu.querySelectorAll("gem-menu-item").forEach(function (menuItem) {
      var isSelected = menuItem === item;
      var content = menuItem.querySelector("gem-menu-item-content");
      var leading = menuItem.querySelector(".leading-container");

      menuItem.classList.toggle("selected", isSelected);
      menuItem.setAttribute("data-active", isSelected ? "true" : "false");
      menuItem.setAttribute("tabindex", isSelected ? "0" : "-1");

      if (content) {
        content.classList.toggle("selected", isSelected);
        content.classList.toggle("active", isSelected);
      }

      if (leading) {
        leading.innerHTML = isSelected ? modeCheckMarkup() : "";
      }
    });

    syncModeHoverState(menu, item);
  }

  function closeModeMenu() {
    var overlay = document.getElementById(modeOverlayId);

    if (overlay) {
      overlay.remove();
    }

    if (activeModeButton) {
      activeModeButton.setAttribute("aria-expanded", "false");
      activeModeButton.classList.remove("gemini-mode-menu-open", "pressed");
      activeModeButton = null;
    }
  }

  function openModeMenu(button) {
    var container = getOverlayContainer();

    ensureOverlayStyles();
    closePlusMenu();
    closeModeMenu();
    container.insertAdjacentHTML("beforeend", buildModeMenu(button));
    activeModeButton = button;
    button.setAttribute("aria-expanded", "true");
    button.classList.add("gemini-mode-menu-open", "pressed");

    var overlay = document.getElementById(modeOverlayId);

    if (overlay && typeof overlay.showPopover === "function") {
      try {
        overlay.showPopover();
      } catch (error) {
        // The overlay is still positioned normally when popover is unavailable.
      }
    }

    bindModeHoverState(overlay);
    positionModeMenu(button);
  }

  function closePlusMenu() {
    var overlay = document.getElementById(overlayId);

    if (overlay) {
      overlay.remove();
    }

    if (activePlusButton) {
      activePlusButton.setAttribute("aria-expanded", "false");
      var menuButton = activePlusButton.closest(".menu-button");

      if (menuButton) {
        menuButton.classList.remove("gemini-plus-menu-open", "active", "rotate-icon");
      }

      activePlusButton = null;
    }
  }

  function openPlusMenu(button) {
    var container = getOverlayContainer();

    ensureOverlayStyles();
    closeModeMenu();
    closePlusMenu();
    container.insertAdjacentHTML("beforeend", buildPlusMenu());
    activePlusButton = button;
    button.setAttribute("aria-expanded", "true");

    var menuButton = button.closest(".menu-button");

    if (menuButton) {
      menuButton.classList.add("gemini-plus-menu-open", "active", "rotate-icon");
    }

    positionPlusMenu(button);
  }

  function buildNewChatTooltip(label) {
    return [
      "<div id=\"", newChatTooltipId, "\" class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\"",
      " style=\"inset: 0px auto auto 0px; height: 100%; width: 100%;\">",
      "<div id=\"cdk-overlay-gemini-new-chat-tooltip\" class=\"cdk-overlay-pane mat-mdc-tooltip-panel mat-mdc-tooltip-panel-right\"",
      " style=\"transform: ", newChatTooltipTranslate, ";\">",
      "<mat-tooltip-component aria-hidden=\"true\" class=\"ng-star-inserted\">",
      "<div class=\"mdc-tooltip mat-mdc-tooltip gds-body-s gem-tooltip lm-enabled mat-mdc-tooltip-show _mat-animation-noopable\"",
      " style=\"transform-origin: left center;\">",
      "<div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">", label, "</div>",
      "</div></mat-tooltip-component></div></div>"
    ].join("");
  }

  function positionNewChatTooltip(target) {
    var overlay = document.getElementById(newChatTooltipId);

    if (!overlay || !target) {
      return;
    }

    var rect = target.getBoundingClientRect();
    var pane = overlay.querySelector(".cdk-overlay-pane");
    var tooltipHeight = pane ? pane.offsetHeight || 24 : 24;
    var top = Math.round((rect.top + rect.height / 2 - tooltipHeight / 2) * 10) / 10;
    var left = Math.round(rect.right * 10) / 10;

    overlay.style.inset = "0px auto auto 0px";
    overlay.style.height = "100%";
    overlay.style.width = "100%";

    if (pane) {
      pane.style.top = top + "px";
      pane.style.left = left + "px";
      pane.style.transform = newChatTooltipTranslate;
    }
  }

  function closeNewChatTooltip() {
    var overlay = document.getElementById(newChatTooltipId);

    if (overlay) {
      overlay.remove();
    }

    activeNewChatTooltipTarget = null;
    activeNewChatTooltipLabel = "";
  }

  function openNewChatTooltip(target, label) {
    var container = getOverlayContainer();

    ensureOverlayStyles();
    closeNewChatTooltip();
    container.insertAdjacentHTML("beforeend", buildNewChatTooltip(label));
    activeNewChatTooltipTarget = target;
    activeNewChatTooltipLabel = label;
    positionNewChatTooltip(target);
  }

  function buildInputTooltip(label) {
    return [
      "<div id=\"", inputTooltipId, "\" class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\"",
      " style=\"inset: 0px auto auto 0px; height: 100%; width: 100%;\">",
      "<div id=\"cdk-overlay-gemini-input-tooltip\" class=\"cdk-overlay-pane mat-mdc-tooltip-panel-below mat-mdc-tooltip-panel\"",
      " style=\"transform: ", inputTooltipTranslate, ";\">",
      "<mat-tooltip-component aria-hidden=\"true\" class=\"ng-star-inserted\">",
      "<div class=\"mdc-tooltip mat-mdc-tooltip gds-body-s gem-tooltip lm-enabled mat-mdc-tooltip-show _mat-animation-noopable\"",
      " style=\"transform-origin: center top;\">",
      "<div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">", label, "</div>",
      "</div></mat-tooltip-component></div></div>"
    ].join("");
  }

  function positionInputTooltip(target) {
    var overlay = document.getElementById(inputTooltipId);

    if (!overlay || !target) {
      return;
    }

    var rect = target.getBoundingClientRect();
    var pane = overlay.querySelector(".cdk-overlay-pane");
    var tooltipWidth = pane ? pane.offsetWidth || 120 : 120;
    var top = Math.round(rect.bottom * 10) / 10;
    var left = Math.round((rect.left + rect.width / 2 - tooltipWidth / 2) * 10) / 10;

    overlay.style.inset = "0px auto auto 0px";
    overlay.style.height = "100%";
    overlay.style.width = "100%";

    if (pane) {
      pane.style.top = top + "px";
      pane.style.left = left + "px";
      pane.style.transform = inputTooltipTranslate;
    }
  }

  function closeInputTooltip() {
    var overlay = document.getElementById(inputTooltipId);

    if (overlay) {
      overlay.remove();
    }

    activeInputTooltipTarget = null;
    activeInputTooltipLabel = "";
  }

  function openInputTooltip(target, label) {
    var container = getOverlayContainer();

    ensureOverlayStyles();
    closeInputTooltip();
    container.insertAdjacentHTML("beforeend", buildInputTooltip(label));
    activeInputTooltipTarget = target;
    activeInputTooltipLabel = label;
    positionInputTooltip(target);
  }

  function buildTopTooltip(label) {
    return [
      "<div id=\"", topTooltipId, "\" class=\"cdk-overlay-connected-position-bounding-box\" dir=\"ltr\"",
      " style=\"inset: 0px auto auto 0px; height: 100%; width: 100%;\">",
      "<div id=\"cdk-overlay-gemini-top-tooltip\" class=\"cdk-overlay-pane mat-mdc-tooltip-panel-left mat-mdc-tooltip-panel\"",
      " style=\"transform: ", topTooltipTranslate, ";\">",
      "<mat-tooltip-component aria-hidden=\"true\" class=\"ng-star-inserted\">",
      "<div class=\"mdc-tooltip mat-mdc-tooltip gds-body-s gem-tooltip lm-enabled mat-mdc-tooltip-show _mat-animation-noopable\"",
      " style=\"transform-origin: right center;\">",
      "<div class=\"mat-mdc-tooltip-surface mdc-tooltip__surface\">", label, "</div>",
      "</div></mat-tooltip-component></div></div>"
    ].join("");
  }

  function positionTopTooltip(target) {
    var overlay = document.getElementById(topTooltipId);

    if (!overlay || !target) {
      return;
    }

    var rect = target.getBoundingClientRect();
    var pane = overlay.querySelector(".cdk-overlay-pane");
    var tooltipHeight = pane ? pane.offsetHeight || 24 : 24;
    var top = Math.round((rect.top + rect.height / 2 - tooltipHeight / 2) * 10) / 10;
    var right = Math.round((window.innerWidth - rect.left) * 10) / 10;

    overlay.style.inset = "0px auto auto 0px";
    overlay.style.height = "100%";
    overlay.style.width = "100%";

    if (pane) {
      pane.style.top = top + "px";
      pane.style.right = right + "px";
      pane.style.transform = topTooltipTranslate;
    }
  }

  function closeTopTooltip() {
    var overlay = document.getElementById(topTooltipId);

    if (overlay) {
      overlay.remove();
    }

    activeTopTooltipTarget = null;
    activeTopTooltipLabel = "";
  }

  function openTopTooltip(target, label) {
    var container = getOverlayContainer();

    ensureOverlayStyles();
    closeTopTooltip();
    container.insertAdjacentHTML("beforeend", buildTopTooltip(label));
    activeTopTooltipTarget = target;
    activeTopTooltipLabel = label;
    positionTopTooltip(target);
  }

  function isInsideTooltipOverlay(target, id) {
    return Boolean(target && target.closest && target.closest("#" + id));
  }

  function isInsideTooltipTarget(target, tooltipTarget) {
    return Boolean(tooltipTarget && target && tooltipTarget.contains(target));
  }

  function shouldKeepTooltipOpen(relatedTarget, tooltipTarget, id) {
    return Boolean(
      isInsideTooltipTarget(relatedTarget, tooltipTarget) ||
      isInsideTooltipOverlay(relatedTarget, id)
    );
  }

  function isLeavingTooltipOverlay(event, id, tooltipTarget) {
    return isInsideTooltipOverlay(event.target, id) &&
      !shouldKeepTooltipOpen(event.relatedTarget, tooltipTarget, id);
  }

  document.addEventListener("click", function (event) {
    var plusButton = getPlusButton(event.target);
    var modeButton = getModeButton(event.target);
    var overlay = document.getElementById(overlayId);
    var modeOverlay = document.getElementById(modeOverlayId);
    var modeItem = modeOverlay && event.target.closest
      ? event.target.closest("#" + modeOverlayId + " gem-menu-item")
      : null;

    if (plusButton) {
      event.preventDefault();
      event.stopPropagation();

      if (overlay && activePlusButton === plusButton) {
        closePlusMenu();
        return;
      }

      openPlusMenu(plusButton);
      return;
    }

    if (modeItem) {
      event.preventDefault();
      event.stopPropagation();
      selectModeItem(modeItem);
      closeModeMenu();
      return;
    }

    if (modeButton) {
      event.preventDefault();
      event.stopPropagation();

      if (modeOverlay && activeModeButton === modeButton) {
        closeModeMenu();
        return;
      }

      openModeMenu(modeButton);
      return;
    }

    if (overlay && !overlay.contains(event.target)) {
      closePlusMenu();
    }

    if (modeOverlay && !modeOverlay.contains(event.target)) {
      closeModeMenu();
    }
  }, true);

  document.addEventListener("mouseover", function (event) {
    var info = getSideNavTooltipInfo(event.target);
    var inputInfo = getInputTooltipInfo(event.target);
    var topInfo = getTopTooltipInfo(event.target);

    if (info && (activeNewChatTooltipTarget !== info.target || activeNewChatTooltipLabel !== info.label)) {
      openNewChatTooltip(info.target, info.label);
    }

    if (inputInfo && (activeInputTooltipTarget !== inputInfo.target || activeInputTooltipLabel !== inputInfo.label)) {
      openInputTooltip(inputInfo.target, inputInfo.label);
    }

    if (topInfo && (activeTopTooltipTarget !== topInfo.target || activeTopTooltipLabel !== topInfo.label)) {
      openTopTooltip(topInfo.target, topInfo.label);
    }
  });

  document.addEventListener("mouseout", function (event) {
    var info = getSideNavTooltipInfo(event.target);
    var inputInfo = getInputTooltipInfo(event.target);
    var topInfo = getTopTooltipInfo(event.target);
    var relatedTarget = event.relatedTarget;

    if (info && !shouldKeepTooltipOpen(relatedTarget, info.item, newChatTooltipId)) {
      closeNewChatTooltip();
    }

    if (inputInfo && !shouldKeepTooltipOpen(relatedTarget, inputInfo.target, inputTooltipId)) {
      closeInputTooltip();
    }

    if (topInfo && !shouldKeepTooltipOpen(relatedTarget, topInfo.target, topTooltipId)) {
      closeTopTooltip();
    }

    if (isLeavingTooltipOverlay(event, newChatTooltipId, activeNewChatTooltipTarget)) {
      closeNewChatTooltip();
    }

    if (isLeavingTooltipOverlay(event, inputTooltipId, activeInputTooltipTarget)) {
      closeInputTooltip();
    }

    if (isLeavingTooltipOverlay(event, topTooltipId, activeTopTooltipTarget)) {
      closeTopTooltip();
    }
  });

  document.addEventListener("focusin", function (event) {
    var info = getSideNavTooltipInfo(event.target);
    var inputInfo = getInputTooltipInfo(event.target);
    var topInfo = getTopTooltipInfo(event.target);

    if (info) {
      openNewChatTooltip(info.target, info.label);
    }

    if (inputInfo) {
      openInputTooltip(inputInfo.target, inputInfo.label);
    }

    if (topInfo) {
      openTopTooltip(topInfo.target, topInfo.label);
    }
  });

  document.addEventListener("focusout", function (event) {
    if (getSideNavTooltipInfo(event.target)) {
      closeNewChatTooltip();
    }

    if (getInputTooltipInfo(event.target)) {
      closeInputTooltip();
    }

    if (getTopTooltipInfo(event.target)) {
      closeTopTooltip();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePlusMenu();
      closeModeMenu();
      closeNewChatTooltip();
      closeInputTooltip();
      closeTopTooltip();
    }
  });

  window.addEventListener("resize", function () {
    positionPlusMenu(activePlusButton);
    positionModeMenu(activeModeButton);
    positionNewChatTooltip(activeNewChatTooltipTarget);
    positionInputTooltip(activeInputTooltipTarget);
    positionTopTooltip(activeTopTooltipTarget);
  });

  window.addEventListener("scroll", function () {
    positionPlusMenu(activePlusButton);
    positionModeMenu(activeModeButton);
    positionNewChatTooltip(activeNewChatTooltipTarget);
    positionInputTooltip(activeInputTooltipTarget);
    positionTopTooltip(activeTopTooltipTarget);
  }, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindEditors();
      syncModeButtons();
      ensureSideNavHoverStyles();
    });
  } else {
    bindEditors();
    syncModeButtons();
    ensureSideNavHoverStyles();
  }

  new MutationObserver(function () {
    bindEditors();
    syncModeButtons();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
