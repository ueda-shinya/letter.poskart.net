/**
 * Accessible Tabs (3 buttons, extensible)
 * - BEM: .c-tabs__tab / .c-tabs__panel
 * - ARIA: role="tablist" / "tab" / "tabpanel", aria-selected, aria-controls, hidden
 * - Keyboard: ← → Home End でタブ移動、Enter/Space で選択
 * - No dependencies
 */

(() => {
  'use strict';

  /** 初期化（ページ内の data-tabs コンポーネントを全て対象） */
  const tabRoots = document.querySelectorAll('[data-tabs]');
  tabRoots.forEach(initTabs);

  /** @param {HTMLElement} root */
  function initTabs(root) {
    const tabs = Array.from(root.querySelectorAll('.c-tabs__tab[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('.c-tabs__panel[role="tabpanel"]'));

    // 安全チェック
    if (!tabs.length || !panels.length) return;

    // クリックで切替
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(root, tab.id));
      tab.addEventListener('keydown', (e) => onKeydown(e, root, tabs));
    });
  }

  /**
   * キーボード操作
   * @param {KeyboardEvent} e
   * @param {HTMLElement} root
   * @param {HTMLElement[]} tabs
   */
  function onKeydown(e, root, tabs) {
    const currentIndex = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabs.length;
        e.preventDefault();
        tabs[nextIndex].focus();
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        e.preventDefault();
        tabs[nextIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        tabs[0].focus();
        break;
      case 'End':
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activateTab(root, document.activeElement.id);
        break;
      default:
        // noop
    }
  }

  /**
   * タブの有効化（aria / hidden / class を一括更新）
   * @param {HTMLElement} root
   * @param {string} tabId
   */
  function activateTab(root, tabId) {
    const tabs = Array.from(root.querySelectorAll('.c-tabs__tab[role="tab"]'));
    const panels = Array.from(root.querySelectorAll('.c-tabs__panel[role="tabpanel"]'));

    tabs.forEach((tab) => {
      const isActive = tab.id === tabId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const controlId = panel.getAttribute('aria-labelledby');
      const match = controlId === tabId;
      panel.toggleAttribute('hidden', !match);
      panel.classList.toggle('u-hidden', !match);
    });
  }
})();
