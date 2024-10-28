// custom style
import "./style.css";

// import icons
import aiButtonIcon from "../assets/ai-button.svg";
import generateIcon from "../assets/generate.svg";
import insertIcon from "../assets/insert.svg";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],

  main() {
    document.onclick = ({ target }) => {
      // console.log(target)
      const container = document.querySelectorAll(
        ".msg-form__msg-content-container"
      );

      container.forEach((ele) => {
        addFocusBlurEventsToContentEditable(ele as HTMLElement);
      });
    };

    const aiButton = document.querySelector(".ai-button") as HTMLImageElement;
    if (aiButton) {
      aiButton.onclick = () => {
        console.log("clicked");
      };
    }
  },
});

function addFocusBlurEventsToContentEditable(target: HTMLElement) {
  const ele = target.querySelector(
    ".msg-form__contenteditable"
  ) as HTMLElement | null;

  target.click();
  if (ele) {
    ele.onfocus = () => {
      showAIButton();
    };

    ele.onblur = () => {
      hideAIButton();
    };
  }
}

function showAIButton() {
  const aiButton = document.createElement("img");
  aiButton.src = aiButtonIcon;
  aiButton.classList.add("ai-button");

  aiButton.onclick = () => showModal();

  document.querySelector(".msg-form__contenteditable")!.appendChild(aiButton);
}

function hideAIButton() {
  const aiButton = document.querySelector(".ai-button");
  aiButton?.remove();
}

function showModal() {
  console.log("show modal");
  const customModal = document.createElement("div");
  customModal.id = "custom-modal";
  const modelOverlay = document.createElement("div");
  const modelDialog = document.createElement("div");

  modelDialog.id = "model-dialog";
  modelOverlay.id = "model-overlay";

  modelOverlay.classList.add(
    "artdeco-modal-overlay",
    "artdeco-modal-overlay--layer-default",
    "artdeco-modal-overlay--is-top-layer",
    "ember-view"
  );

  modelDialog.classList.add("artdeco-modal");

  // modelDialog.attributes["size"] = "medium";
  modelDialog.setAttribute("size", "medium");
  modelOverlay.onclick = () => hideModal();

  modelDialog.innerHTML = "hello";

  //  create close button

  // <button aria-label="Dismiss" id="ember466" class="artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view artdeco-modal__dismiss" data-test-modal-close-btn="">        <svg role="none" aria-hidden="true" class="artdeco-button__icon " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" data-supported-dps="24x24" data-test-icon="close-medium">
  // <!---->
  //     <use href="#close-medium" width="24" height="24"></use>
  // </svg>

  // <span class="artdeco-button__text">

  // </span></button>
  const closeButton = document.createElement("button");
  closeButton.id = "modal-close-btn";
  closeButton.setAttribute("aria-label", "Dismiss");
  closeButton.classList.add(
    "artdeco-button",
    "artdeco-button--circle",
    "artdeco-button--muted",
    "artdeco-button--2",
    "artdeco-button--tertiary",
    "ember-view",
    "artdeco-modal__dismiss"
  );
  closeButton.innerHTML = `
<svg role="none" aria-hidden="true" class="artdeco-button__icon " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" data-supported-dps="24x24" data-test-icon="close-medium">
<!---->    
    <use href="#close-medium" width="24" height="24"></use>
</svg>
  `;

  closeButton.onclick = () => hideModal();

  modelDialog.innerHTML = `
  <div
    class="artdeco-modal__header display-flex align-items-center ember-view"
  >
    <h3 id="-header">LinkedIn AI Reply</h3>

  </div>

  `;

  const modelDialogContent = document.createElement("div");
  modelDialogContent.id = "model-dialog-content";
  modelDialogContent.classList.add("ph5", "pv3");

  // chat list
  const chatList = document.createElement("div");
  chatList.id = "chat-list";
  modelDialogContent.appendChild(chatList);

  // form
  const promptForm = document.createElement("form");

  promptForm.id = "prompt-form";

  promptForm.onsubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  const messageInput = document.createElement("input");
  messageInput.id = "message-input";
  messageInput.placeholder = "Your prompt";
  messageInput.type = "text";
  messageInput.required = true;
  messageInput.autofocus = true;
  messageInput.classList.add("custom-modal-input");

  // buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const submitButton = document.createElement("button");
  submitButton.id = "submit-button";
  submitButton.innerHTML = `
  <img src="${generateIcon}" class="generate-icon" />
  <span class="generate-text">Generate</span>
  `;
  submitButton.type = "submit";

  promptForm.appendChild(messageInput);

  buttonsContainer.appendChild(submitButton);
  promptForm.appendChild(buttonsContainer);

  modelDialogContent.appendChild(promptForm);

  modelDialog.appendChild(modelDialogContent);
  modelDialog.appendChild(closeButton);

  customModal.appendChild(modelOverlay);
  customModal.appendChild(modelDialog);
  document.body.appendChild(customModal);
}

function hideModal() {
  console.log("hide modal");
  document.querySelector("#custom-modal")?.remove();
}

function submitForm() {
  console.log("submit form");
  const prompt = (document.querySelector("#message-input") as HTMLInputElement)
    ?.value;
  if (prompt) {
    console.log(prompt);

    const chatList = document.querySelector("#chat-list") as HTMLDivElement;
    const message = document.createElement("div");
    const receivedMessage = document.createElement("div");

    receivedMessage.classList.add("message");
    receivedMessage.innerHTML = `
    <p class="message-text">
    Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.
    </p>
    <p class="message-timestamp">${new Date().toLocaleTimeString()}</p>
    `;
    message.classList.add("message", "sent");

    message.innerHTML = `
    <p class="message-text">
    ${prompt}
    </p>
    <p class="message-timestamp">${new Date().toLocaleTimeString()}</p>
    `;

    chatList.appendChild(message);

    const generatingMessage = document.createElement("div");
    generatingMessage.classList.add("message");
    generatingMessage.innerHTML = `
    <p class="message-text">Generating response...</p>
    `;
    chatList.appendChild(generatingMessage);

    setTimeout(() => {
      generatingMessage.remove();
      chatList.appendChild(receivedMessage);

      const buttonsContainer = document.querySelector(
        ".buttons-container"
      ) as HTMLDivElement;

      const insertButton = document.createElement("button");
      insertButton.id = "insert-button";
      insertButton.innerHTML = `
      <img src="${insertIcon}" class="insert-icon" />
      <span class="insert-text">Insert</span>
      `;
      insertButton.type = "button";

      insertButton.onclick = () => addTextToMessage();
      buttonsContainer.prepend(insertButton);
    }, 1000);

    (document.querySelector("#message-input") as HTMLInputElement).value = "";
  }
}

function addTextToMessage() {
  console.log("add text to message");

  const contentEditable = document.querySelector(
    ".msg-form__contenteditable"
  ) as HTMLElement;
  if (contentEditable) {
    // // Focus on the contenteditable element
    // contentEditable.focus();

    // Create and dispatch keyboard events to simulate typing
    // const inputEvent = new InputEvent("input", {
    //   bubbles: true,
    //   cancelable: true,
    //   inputType: "insertText",
    //   data: "Your message",
    // });

    // contentEditable.textContent = "Your message";
    // contentEditable.dispatchEvent(inputEvent);

    // const paragraph = contentEditable.querySelector("p");
    // if (paragraph) {
    //   paragraph.textContent =
    //     "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    //   document.querySelector(".msg-form__placeholder")?.remove();
    //   paragraph.click();
    //   paragraph.focus();
    // }

    injectMessage(
      "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
    );

    // Close the modal
    hideModal();
  }
}

// content.js
function injectMessage(message: string) {
  // Find LinkedIn's message container
  const messageContainer = document.querySelector(
    '.msg-form__contenteditable[contenteditable="true"]'
  ) as HTMLElement;

  if (!messageContainer) {
    console.log("Message container not found");
    return;
  }

  // Clear existing content first
  messageContainer.innerHTML = "";

  // Create and append a new paragraph
  const paragraph = document.createElement("p");

  // Split message into characters to simulate typing
  const chars = message.split("");

  // Function to simulate typing each character
  function typeChar(index: number) {
    if (index >= chars.length) return;

    // Get current content and add new character
    const currentContent = paragraph.textContent;
    paragraph.textContent = currentContent + chars[index];

    // Create and dispatch necessary events
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: chars[index],
    });

    const beforeInputEvent = new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: chars[index],
    });

    // Dispatch composition events (important for IME and internal state)
    const compositionStartEvent = new CompositionEvent("compositionstart", {
      bubbles: true,
      cancelable: true,
      data: chars[index],
    });

    const compositionEndEvent = new CompositionEvent("compositionend", {
      bubbles: true,
      cancelable: true,
      data: chars[index],
    });

    // Simulate keyboard events
    const keyDownEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: chars[index],
      code: `Key${chars[index].toUpperCase()}`,
      keyCode: chars[index].charCodeAt(0),
      which: chars[index].charCodeAt(0),
    });

    const keyPressEvent = new KeyboardEvent("keypress", {
      bubbles: true,
      cancelable: true,
      key: chars[index],
      code: `Key${chars[index].toUpperCase()}`,
      keyCode: chars[index].charCodeAt(0),
      which: chars[index].charCodeAt(0),
    });

    const keyUpEvent = new KeyboardEvent("keyup", {
      bubbles: true,
      cancelable: true,
      key: chars[index],
      code: `Key${chars[index].toUpperCase()}`,
      keyCode: chars[index].charCodeAt(0),
      which: chars[index].charCodeAt(0),
    });

    // Fire all events in the correct order
    messageContainer.dispatchEvent(keyDownEvent);
    messageContainer.dispatchEvent(keyPressEvent);
    messageContainer.dispatchEvent(compositionStartEvent);
    messageContainer.dispatchEvent(beforeInputEvent);

    // Set content
    messageContainer.innerHTML = "";
    messageContainer.appendChild(paragraph);

    messageContainer.dispatchEvent(inputEvent);
    messageContainer.dispatchEvent(compositionEndEvent);
    messageContainer.dispatchEvent(keyUpEvent);

    // Focus the container
    messageContainer.focus();

    // Type next character
    setTimeout(() => typeChar(index + 1), 1);
  }

  // Start typing simulation
  messageContainer.appendChild(paragraph);
  typeChar(0);

  // Trigger a final input event after all characters are typed
  setTimeout(() => {
    messageContainer.dispatchEvent(new Event("input", { bubbles: true }));
    messageContainer.focus();
  }, message.length * 10 + 100);
}
