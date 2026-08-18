import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [showRedirectModal, setShowRedirectModal] = useState(false)
    const [countdown, setCountdown] = useState(3)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result.success) {
            navigate('/')
        } else {
            if (result.message === 'Email not registered') {
                setShowRedirectModal(true)
            } else {
                setError(result.message)
            }
        }
    }

    useEffect(() => {
        if (!showRedirectModal) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    navigate('/register')
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [showRedirectModal, navigate])

    if (loading && !showRedirectModal) {
        return (<main><h1>Loading.......</h1></main>)
    }


    return (
        <main>
            {showRedirectModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Email Not Registered</h2>
                        <p>We couldn't find an account for <strong>{email}</strong>.</p>
                        <p>Redirecting you to the registration page in {countdown} seconds...</p>
                        <div className="countdown-bar">
                            <div className="countdown-progress"></div>
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="button primary-button"
                                onClick={() => navigate('/register')}
                            >
                                Register Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="form-container">
                <h1>Login</h1>
                {error && (
                    <div className="error-banner">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' required />
                    </div>
                    <button className='button primary-button' type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
            </div>
        </main>
    )
}

export default Login