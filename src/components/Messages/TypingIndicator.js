import React from "react";

const TypingIndicator = () => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span className="user___typing">User is typing</span>
      <div class="typing">
        <span className="typing__dot"></span>
        <span className="typing__dot"></span>
        <span className="typing__dot"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
