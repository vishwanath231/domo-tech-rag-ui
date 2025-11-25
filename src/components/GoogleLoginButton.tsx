/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function GoogleLoginButton() {
  const handleCallbackResponse = async (response: any) => {
    const user = jwtDecode(response.credential);
    await loginWithGoogle(user);
  };

  async function loginWithGoogle(user: any) {

    const data = {
      email: user.email,
      name: user.name,
      avatar: user.picture,
      google_id: user.sub
    }
    const res = await fetch("http://127.0.0.1:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const response = await res.json();

    // data = { accessToken, user }
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("user", JSON.stringify(response.user));
    window.location.reload();
  }

  useEffect(() => {
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id:
        "344946814384-99umjvqbndim8lsdps2ht1rho31iuoou.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );

  }, []);

  return <div id="googleSignInDiv"></div>;
}
