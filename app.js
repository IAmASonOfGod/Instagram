class App {
    constructor(){
        this.$app = document.querySelector("#app")
        this.$firebaseAuthContainer = document.querySelector("#firebaseui-auth-container")
        this.$authUser = document.querySelector(".auth-user")
        this.$uploadButton = document.querySelector(".upload-button")
        this.$uploadPage = document.querySelector("#upload-page")
        this.$uploadPage.style.display = "none";
 

        // Initialize the FirebaseUI Widget using Firebase.
        this.ui = new firebaseui.auth.AuthUI(auth);
        this.handleAuth()

        this.$authUser.addEventListener("click",(event)=>{
            this.handleLogout()
        })
               
        this.$uploadButton.addEventListener("click",(event)=>{
            this.handleUpload()
        })
        
    }

   
    handleUpload(){
        this.$firebaseAuthContainer.style.display = "none"
        this.$app.style.display = "none"
        this.$uploadPage.style.display = "block"
    }

    handleAuth(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              this.$authUser.innerHTML = "Logout"
              this.redirectToApp()
            } else {
              this.redirectToAuth()
            }
        });
    }

    handleLogout(){
        // Sign out the user
        firebase.auth().signOut().then(()=> {
         this.redirectToAuth()
        }).catch((error)=> {
         console.log("ERROR OCCURED", error)
        });

    }

    redirectToApp(){
        this.$firebaseAuthContainer.style.display = "none"
        this.$app.style.display = "block"


    }

    redirectToAuth(){
        this.$firebaseAuthContainer.style.display = "block"
        this.$app.style.display = "none"

        
        this.ui.start('#firebaseui-auth-container', {
            signInOptions: [
              firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            // Other config options...
        }); 
    }

   
   

}

const InstagramApp = new App() 