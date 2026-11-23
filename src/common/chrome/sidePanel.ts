export async function getCurrentWindowId(): Promise<number | undefined> {
  const window = await browser.windows.getCurrent();
  return window.id;
}

export function openSidePanel(windowId: number): Promise<void> {
  return browser.sidePanel.open({ windowId });
}
