import { useState } from "react";
import api from "../api";

function AIChat({ analysisData }) {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);


  const askQuestion = async () => {

    if (!question.trim()) {
      return;
    }

    const userQuestion = question;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        text: userQuestion
      }
    ]);

    setQuestion("");

    setLoading(true);


    try {

      const response = await api.post(
        "/api/chat",
        {
          question: userQuestion,
          analysis_data: analysisData
        }
      );


      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: response.data.answer
        }
      ]);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't analyze that question."
        }
      ]);

    } finally {

      setLoading(false);

    }
  };


  const handleKeyDown = (event) => {

    if (event.key === "Enter") {
      askQuestion();
    }

  };

const selectSuggestedQuestion = (question) => {
  setQuestion(question);
};
  return (

    <section className="ai-chat">

      <div className="ai-chat-header">

        <div>

          <span className="ai-label">
            🤖 GREENPULSE AI
          </span>

          <h3>
            Ask Your Energy Analyst
          </h3>

          <p>
            Ask questions about your uploaded
            energy data.
          </p>

        </div>

      </div>


      <div className="chat-messages">

        {messages.length === 0 && (

          <div className="chat-empty">

            <span>
              💬
            </span>

            <p>
              Try asking:
            </p>

            <button
  className="suggested-question"
  onClick={() =>
    selectSuggestedQuestion(
      "Why was my consumption high at 8 PM?"
    )
  }
>
  Why was my consumption high at 8 PM?
</button>

<button
  className="suggested-question"
  onClick={() =>
    selectSuggestedQuestion(
      "Which appliance uses the most energy?"
    )
  }
>
  Which appliance uses the most energy?
</button>

<button
  className="suggested-question"
  onClick={() =>
    selectSuggestedQuestion(
      "How can I reduce my energy consumption?"
    )
  }
>
  How can I reduce my energy consumption?
</button>

          </div>

        )}


        {messages.map(
          (message, index) => (

            <div
              key={index}
              className={`chat-message ${message.role}`}
            >

              <div className="message-avatar">

                {message.role === "user"
                  ? "👤"
                  : "🤖"}

              </div>

              <div className="message-content">

                <strong>
                  {message.role === "user"
                    ? "You"
                    : "GreenPulse AI"}
                </strong>

                <p>
                  {message.text}
                </p>

              </div>

            </div>

          )
        )}


        {loading && (

          <div className="chat-message ai">

            <div className="message-avatar">
              🤖
            </div>

            <div className="message-content">

              <strong>
                GreenPulse AI
              </strong>

              <p>
                Analyzing your energy data...
              </p>

            </div>

          </div>

        )}

      </div>


      <div className="chat-input">

        <input
          type="text"
          value={question}
          placeholder="Ask about your energy consumption..."
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={askQuestion}
          disabled={loading}
        >
          Ask
        </button>

      </div>

    </section>

  );
}

export default AIChat;