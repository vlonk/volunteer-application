import React, {useState} from "react";

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }
    return (
        <form onSubmit={handleSubmit}>
            <label> Enter email:
                <input>
                type = "email"
                value = {email}
                onChange = {e => setEmail(e.target.value)}
                </input>
            </label>
            <br />
            <label> Enter password:
                <input>
                type = "password"
                value = {password}
                onChange = {e => setPassword(e.target.value)}
                </input>
            </label>
            <input> type = "submit" </input>
        </form>
    )
}