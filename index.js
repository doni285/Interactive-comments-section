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
  document.querySelectorAll('[id^="replyName"]').forEach(el => {
    el.innerText = userData.name;
  });

  document
    .querySelectorAll('[id^="replyInputImage"], [id^="replyRelayImage"], #mainInputImage')
    .forEach(img => {
      img.src = userData.image;
      img.style.display = 'block';
  });
}

function setupVoteButtons(voteBlock) {
  const plus = voteBlock.querySelector('img[class*="lus"]');
  const minus = voteBlock.querySelector('img[class*="inus"]');
  const display = voteBlock.querySelector('div[class*="isplay"]');
  let liked = false;

  if (plus && display) {
    plus.style.cursor = "pointer";
    plus.onclick = (e) => {
      e.stopPropagation();
      const currentValue = parseInt(display.innerText);

      if (liked) {
        display.innerText = currentValue - 1;
        liked = false;
      } else {
        display.innerText = currentValue + 1;
        liked = true;
      }
    };
  }

  if (minus && display) {
    minus.style.cursor = "pointer";
    minus.onclick = (e) => {
      e.stopPropagation();
      const currentValue = parseInt(display.innerText);

      if (currentValue > 0) {
        display.innerText = currentValue - 1;
        liked = false;
      }
    };
  }
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
          textArea.value = "";
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
    setupVoteButtons(voteBlock);
  });
}

// 1. SELECTORS
const mainSendBtn = document.getElementById('mainSendBtn');
const mainInput = document.getElementById('mainTextarea');
const mainInputContainer = document.getElementById('mainInputContainer');

// 2. SEND LOGIC
if (mainSendBtn) {
  mainSendBtn.onclick = () => {
    const textValue = mainInput.value.trim();

    if (textValue !== "") {
      createMainComment(textValue);
      mainInput.value = "";
    } else {
      alert("Abeg, write something before you send!");
    }
  };
}

function createMainComment(textValue) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'maine';

  commentDiv.innerHTML = `
    <div class="votes">
      <img class="plus" src="./images/icon-plus.svg" alt="">
      <div class="display">0</div>
      <img class="minus" src="./images/icon-minus.svg" alt="">
    </div>
    <div class="together">
      <div class="picture">
        <img src="${userData.image}" alt="">
        <p class="name mainCommentName"></p>
        <div class="you">you</div>
        <p class="ara">Just now</p>
        <div class="edit">
          <img src="./images/icon-edit.svg" alt="">
          <button class="mainEditBtn">Edit</button>
        </div>
        <div class="delete">
          <img src="./images/icon-delete.svg" alt="">
          <button class="mainDeleteBtn">Delete</button>
        </div>
      </div>
      <p class="mainRelayText"></p>
    </div>
  `;

  mainContent.insertBefore(commentDiv, mainInputContainer);

  const editBtn = commentDiv.querySelector('.mainEditBtn');
  const deleteBtn = commentDiv.querySelector('.mainDeleteBtn');
  const commentText = commentDiv.querySelector('.mainRelayText');
  const commentName = commentDiv.querySelector('.mainCommentName');

  commentName.innerText = userData.name;
  commentText.innerText = textValue;

  setupVoteButtons(commentDiv.querySelector('.votes'));

  editBtn.onclick = () => {
    if (editBtn.innerText === "Edit") {
      const currentText = commentText.innerText;
      commentText.innerHTML = `<textarea class="edit-box" style="width:90%; height:60px;">${currentText}</textarea>`;
      editBtn.innerText = "Update";
    } else {
      const newText = commentText.querySelector('textarea').value;
      commentText.innerText = newText;
      editBtn.innerText = "Edit";
    }
  };

  deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      commentDiv.remove();
    }
  };
}

