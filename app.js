class App {
    constructor(){
        this.storage = firebase.storage();
        console.log(this.storage)
        this.$fileInput = document.querySelector("#upload-file");
        this.$caption = document.querySelector("#create-caption");
        this.$uploadFileButton = document.querySelector("#upload-button");
         
            
        this.$app = document.querySelector("#app")
        this.$firebaseAuthContainer = document.querySelector("#firebaseui-auth-container")
        this.$authUser = document.querySelector(".auth-user")
        this.$uploadButton = document.querySelector(".upload-button")
        this.$uploadPage = document.querySelector("#upload-page")
        this.$uploadPage.style.display = "none";
    

        this.ui = new firebaseui.auth.AuthUI(auth);
        this.handleAuth()

        this.$authUser.addEventListener("click",(event)=>{
            this.handleLogout()
        })
                
        this.$uploadButton.addEventListener("click",(event)=>{
            this.handleUpload()
        })
            
        this.handleUploadToStorage()
    }
    
    
    
    handleUploadToStorage() {
    
        this.$uploadFileButton.addEventListener("click", (event) => {
            
            const captionValue = this.$caption.value;
            const file = this.$fileInput.files[0]; 

            if (!file) {
                console.error("No file selected.");
                return;
            }
            const storageRef = this.storage.ref('images/' + file.name);
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed', (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                console.error("Error during upload:", error);
            }, () => {
                // Handle successful uploads on complete
                storageRef.getDownloadURL().then((url) => {
                    console.log('File available at', url);
            
                    const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : "anonymous";
            
                    const db = firebase.database();
                    const imagesRef = db.ref('images');
            
                    const imageKey = imagesRef.push().key;
            
                    const imageData = {
                        userId: userId,
                        caption: captionValue, // Use the current caption value
                        url: url
                    };
            
                    return imagesRef.child(imageKey).set(imageData);
                }).then(() => {
                    console.log('Data stored successfully');
                    // Optionally, reset the input fields
                    this.$fileInput.value = '';
                    this.$caption.value = '';
                }).catch((error) => {
                    console.error('Error:', error);
                });
            });
            
        });
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

   save(){

   }

   read(){
    
   }

   update(){

   }

   delete(){

   }

   

}

const InstagramApp = new App() 