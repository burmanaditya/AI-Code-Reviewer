import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(``)
  const [review, setReview] = useState(``)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
   
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  async function reviewCode() {
    if (!code.trim()) {
      setReview("Please enter some code to review.")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ai/get-review`, { code })
      setReview(response.data)
    } catch (error) {
      setReview("Error occurred while reviewing code. Please try again.")
      console.error('Review error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Logo"
              className="logo"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <h1 className="app-title">✨ Code Reviewer</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            <span style={{ fontSize: '1.6rem' }}>
              {isDarkMode ? '🌞' : '🌙'}
            </span>
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="editor-section">
          <div className="section-header">
            <h2>🚀 Code Editor</h2>
            <span className="section-subtitle">Write your code here and get AI-powered insights</span>
          </div>
          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={20}
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                backgroundColor: 'transparent',
                outline: 'none'
              }}
              placeholder=""
            />
          </div>
          <button
            onClick={reviewCode}
            disabled={isLoading || !code.trim()}
            className={`review-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                🔄 Analyzing Code...
              </>
            ) : (
              <>
                <span className="review-icon">🔍</span>
                ✨ Review My Code
              </>
            )}
          </button>
        </div>

        <div className="review-section">
          <div className="section-header">
            <h2>🤖 AI Code Review</h2>
            <span className="section-subtitle">Intelligent feedback and suggestions</span>
          </div>
          <div className="review-container">
            {review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <p>Ready to analyze your code! Click <strong>"✨ Review My Code"</strong> to get AI-powered feedback with suggestions for improvements, best practices, and potential issues.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App