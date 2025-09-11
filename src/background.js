const PREVIEW_WIDTH = 160;
const PREVIEW_HEIGHT = PREVIEW_WIDTH * 1.5;

/**
 * This function reads all attachments and extracts audio data 
 * and sends those to the requesting tab for display.
 *
 * @param {Integer} tabId - the id of the WebExtension message display Tab
 * @param {Integer} messageId - the id of the WebExtension MessageHeader
 */
async function addInlinePreviews(tabId, messageId) {

  let showAttachmentsInline = await browser.LegacyPrefs.getPref("mail.inline_attachments");

  if (!showAttachmentsInline) {
    // Do not show audio previews if the setting is off.
    return;
  }

  // Get a list of all attachments.
  let attachments = await browser.messages.listAttachments(messageId);
  let loadingSpinnerShown = false;

  for (let attachment of attachments) {
    // Only audio attachments are handled.
    if (
      !attachment.contentType.toLowerCase().startsWith("audio/")
    ) {
      continue;
    }

    // There is at least one inline preview. Send a message to the tab to
    // prepare the message body and to display a loading spinner. We do this
    // only once.
    if (!loadingSpinnerShown) {
      await browser.tabs.sendMessage(tabId, { command: "prepareMessageBody" });
      loadingSpinnerShown = true;
    }

    // Get the requested attachment.
    let file = await browser.messages.getAttachmentFile(
      messageId,
      attachment.partName
    );

    // Get a data URL from the attachment.
    let reader = new FileReader();
    attachment.url = await new Promise(resolve => {
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });

    // Send a message to the tab to display the preview.
    await browser.tabs.sendMessage(tabId, {
      command: "addAudioPreview",
      name: attachment.name,
      audioDataUrl: attachment.url,
      partName: attachment.partName,
      pageNumber: 0,
      messageId,
    });

  }

  // Send a message to the tab to hide the loading spinner again (if shown).
  if (loadingSpinnerShown) {
    await browser.tabs.sendMessage(tabId, { command: "hideSpinner" });
    loadingSpinnerShown = false;
  }
}

browser.runtime.onMessage.addListener((data, sender) => {
  // Handle inline-preview requests.
  if (data.command == "addInlinePreviews") {
    let tabId = sender.tab.id;
    browser.messageDisplay.getDisplayedMessages(tabId).then((messageList) => {
      for (let message of messageList.messages) {
        addInlinePreviews(tabId, message.id);
      }      
    });
  }
});

browser.scripting.messageDisplay.registerScripts([{
  id: "audio-preview-script",
  js: ["src/initial.js"],
}]);
