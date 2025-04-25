const keywords = ["спам", "оскорбление", "бот", "фейк", "лох", "тупой"];

function sendComment(comment, author = "unknown", postId = window.location.pathname, userId = "guest_user") {
  fetch("http://127.0.0.1:5000/add-comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      post_id: postId,
      author: author,
      comment: comment
    })
  })
  .then(res => res.json())
  .then(data => console.log("✅ Отправлено в сервер:", data))
  .catch(err => console.error("❌ Ошибка отправки:", err));
}

function handleNewComment(el) {
  const commentText = el.textContent || "";
  const author = el.closest("article")?.querySelector("h3")?.textContent || "Аноним";

  const isSus = keywords.some(word => commentText.toLowerCase().includes(word));
  if (isSus) {
    el.style.backgroundColor = "#ffdddd";
    el.style.border = "1px solid red";
    el.title = "⚠️ Подозрительный комментарий";

    sendComment(commentText, author);
  }
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const spans = node.querySelectorAll("span");
        spans.forEach(span => handleNewComment(span));
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });