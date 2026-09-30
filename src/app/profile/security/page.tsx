"use client"

import { useState } from "react";
import {PageHeader} from "@/components/PageHeader";
import { BackPill } from "@/components/AuthShell";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { PasswordField } from "@/components/PasswordField";

export default function SecurityPage() {
    const [userId, setUserId] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [password, setPassword] = useState("");
    const [editPassword, setEditPassword] = useState("");

    function handleSUbmit(e:React.FormEvent) {
        e.preventDefault();
    }

    return(
        <div className= "dashboard-shell">
            <PageHeader right ={<BackPill href="/profile" />} />
            <form onSubmit = {handleSUbmit} className="stack " style={{marginTop: 20}}>
                <div>
                    <p className= "field-label">User ID</p>
                    <TextField placeholder="Duke Marget" value={userId} onChange={(e) => setUserId(e.target.value)} /> 
                </div>
                 <div>
                <p className="field-label">Private key</p>
                <TextField placeholder="Duke Margret" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
                </div>
                <PasswordField placeholder="Create Password" value={password} onChange={setPassword} />
                <PasswordField placeholder="Edit password" value={editPassword} onChange={setEditPassword} />
                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}