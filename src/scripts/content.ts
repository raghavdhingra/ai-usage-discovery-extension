export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Straiker content script running');
  },
});
