// js/auth.js

window.auth = {
  isLoggedIn: false,

  async init() {
    const { data: { session } } = await window.supabaseClient.auth.getSession()

    this.isLoggedIn = !!session
    this.render()
  },

  render() {
    const container = document.getElementById("auth-links")
    if (!container) return

    if (this.isLoggedIn) {
      container.innerHTML = `
        <a href="#" id="logout-link">Logout</a>
      `

      document.getElementById("logout-link").addEventListener("click", async (e) => {
        e.preventDefault()
        await window.supabaseClient.auth.signOut()
        location.reload()
      })

    } else {
      container.innerHTML = `
        <a href="#" id="login-link">Login</a>
      `

      document.getElementById("login-link").addEventListener("click", async (e) => {
        e.preventDefault()

        await window.supabaseClient.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "https://noire-fashion.github.io/Noire-Website/"
          }
        })
      })
    }
  },

  showModal(callback) {
    alert("Please login first.")
    // You can improve this later
  }
}
