// 1. SELECTORS
const startScreen = document.getElementById('start');
const mainContent = document.getElementById('main');
const startBtn = document.getElementById('button');
const nameInput = document.getElementById('nameInput');
const imageInput = document.getElementById('imageInput');

let userData = { name: "", image: "" };
mainContent.style.display = 'none';

// 2. GATEKEEPER
startBtn.addEventListener('click', () => {
  const nameValue = nameInput.value.trim();
  if (nameValue === "" || imageInput.files.length === 0) {
    alert("Please input your image and your username to begin!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    userData.name = nameValue;
    userData.image = e.target.result;
    startScreen.style.display = 'none';
    mainContent.style.display = 'block';

    // Run these AFTER the main content is visible
    updateUserUI();
    setupAllLogic();
  };
  reader.readAsDataURL(imageInput.files[0]);
});

// 3. IMAGE & NAME SYNC
function updateUserUI() {
  // Update all names
  document.querySelectorAll('[id^="replyName"]').forEach(el => {
    el.innerText = userData.name;
  });

  // Update ALL images that start with "replyImag" 
  // This catches replyImage1, replyImag2, etc.
  document.querySelectorAll('img').forEach(img => {
    if (img.id.includes('replyImag')) {
      img.src = userData.image;
    }
  });
}

// 4. THE MAIN LOGIC ENGINE
function setupAllLogic() {
  [1, 2, 3].forEach(num => {
    const trigger = document.getElementById(`reply${num}`);
    const inputArea = document.getElementById(`replies${num}`);
    const sendBtn = document.getElementById(num === 1 ? 'actualReplies' : `actualReplies${num}`);
    const relayDiv = document.getElementById(`relay${num}`);
    const textArea = document.getElementById(num === 1 ? 'replyInput' : `replyInput${num}`);
    const contentP = document.getElementById(num === 1 ? 'replyContent' : `replyContent${num}`);
    const deleteBtn = document.getElementById(num === 1 ? 'deleteBtn' : `deleteBtn${num}`);
    const editBtn = document.getElementById(num === 1 ? 'editBtn' : `editBtn${num}`);

    // Initial state
    if (inputArea) inputArea.style.display = 'none';
    if (relayDiv) relayDiv.style.display = 'none';

    // Reply Toggle
    if (trigger) {
      trigger.onclick = () => {
        const isHidden = inputArea.style.display === 'none';
        inputArea.style.display = isHidden ? 'flex' : 'none';
      };
    }

    // Send Logic
    if (sendBtn) {
      sendBtn.onclick = () => {
        if (textArea.value.trim() !== "") {
          contentP.innerText = textArea.value;
          relayDiv.style.display = 'flex';
          inputArea.style.display = 'none';
        }
      };
    }

    // Edit Logic
    if (editBtn) {
      editBtn.onclick = () => {
        if (editBtn.innerText === "Edit") {
          const currentText = contentP.innerText;
          contentP.innerHTML = `<textarea class="edit-box" style="width:90%; height:60px;">${currentText}</textarea>`;
          editBtn.innerText = "Update";
        } else {
          const newText = contentP.querySelector('textarea').value;
          contentP.innerText = newText;
          editBtn.innerText = "Edit";
        }
      };
    }

    // Delete Logic
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        if (confirm("Delete this?")) relayDiv.style.display = 'none';
      };
    }
  });

  // 5. VOTING (INSIDE setupAllLogic to ensure elements are ready)
  document.querySelectorAll('.votes').forEach(voteBlock => {
    const plus = voteBlock.querySelector('img[class*="lus"]'); // Matches 'plus', 'replyPlus1'
    const minus = voteBlock.querySelector('img[class*="inus"]'); // Matches 'minus', 'replyMinus1'
    const display = voteBlock.querySelector('div[class*="isplay"]'); // Matches 'display', 'replyDisplay1'

    if (plus && display) {
      plus.style.cursor = "pointer";
      plus.onclick = (e) => {
        e.stopPropagation(); // Prevents click bubbling
        display.innerText = parseInt(display.innerText) + 1;
      };
    }

    if (minus && display) {
      minus.style.cursor = "pointer";
      minus.onclick = (e) => {
        e.stopPropagation();
        let val = parseInt(display.innerText);
        if (val > 0) display.innerText = val - 1;
      };
    }
  });
}

// 1. SELECTORS
const mainSendBtn = document.getElementById('mainSendBtn');
const mainInput = document.getElementById('mainTextarea');
const mainRelay = document.getElementById('mainRelayContainer');
const mainDisplay = document.getElementById('mainRelayText');

// 2. SEND LOGIC
if (mainSendBtn) {
  mainSendBtn.onclick = () => {
    const textValue = mainInput.value.trim();

    if (textValue !== "") {
      // Put the typed text into the display paragraph
      mainDisplay.innerText = textValue;
      // Show the finished comment and hide the input box
      mainRelay.style.display = 'flex';
      document.getElementById('mainInputContainer').style.display = 'none';
    } else {
      alert("Abeg, write something before you send!");
    }
  };
}

// 3. EDIT/UPDATE LOGIC
const mainEditBtn = document.getElementById('mainEditBtn');
if (mainEditBtn) {
  mainEditBtn.onclick = () => {
    if (mainEditBtn.innerText === "Edit") {
      const currentText = mainDisplay.innerText;
      // Turn paragraph into a textarea
      mainDisplay.innerHTML = `<textarea class="edit-box" style="width:90%; height:60px;">${currentText}</textarea>`;
      mainEditBtn.innerText = "Update";
    } else {
      // Save new text and turn back into paragraph
      const newText = mainDisplay.querySelector('textarea').value;
      mainDisplay.innerText = newText;
      mainEditBtn.innerText = "Edit";
    }
  };
}

// 4. DELETE LOGIC
const mainDeleteBtn = document.getElementById('mainDeleteBtn');
if (mainDeleteBtn) {
  mainDeleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      mainRelay.style.display = 'none';
      // Bring back the empty input box so they can write a new one
      document.getElementById('mainInputContainer').style.display = 'flex';
      mainInput.value = "";
    }
  };
}

function updateUserUI() {
  // Update your name in the new section
  const mainName = document.getElementById('mainRelayUsername');
  if (mainName) mainName.innerText = userData.name;

  // Update your images in the new section
  const img1 = document.getElementById('mainInputImage');
  const img2 = document.getElementById('mainRelayImage');

  if (img1) img1.src = userData.image;
  if (img2) img2.src = userData.image;
}