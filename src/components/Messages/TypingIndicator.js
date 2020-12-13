import React from "react";

const TypingIndicator = (props) => {
  const { username } = props;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span className="user___typing">{username} is typing</span>
      <div className="typing">
        <span className="typing__dot"></span>
        <span className="typing__dot"></span>
        <span className="typing__dot"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
