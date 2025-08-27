# Tamil Nadu School Renovation Initiative



A full-stack web application designed to connect donors and volunteers with government schools in Tamil Nadu that require renovation and support. This platform empowers schools to showcase their needs and allows compassionate individuals to make a direct impact through financial contributions or by volunteering their time.

### ✨ Live Application Links

* **Live Site (Netlify):** **[https://kalvi-velicham.netlify.app/](https://kalvi-velicham.netlify.app/)**


---

## 🌟 Key Features

* **Bilingual Interface:** Seamless user experience in both **English** and **Tamil**.
* **Dynamic School Listings:** Schools can register their profiles, detailing their renovation needs, budget requirements, and current condition with photo uploads.
* **Secure Donor Authentication:** A complete login and registration system for donors to track their contributions.
* **Multi-Step Donation Form:** An intuitive and user-friendly process for making donations to specific schools.
* **Volunteer Registration:** A simple portal for individuals to sign up and offer their skills and time.
* **Permanent Image Storage:** All user-uploaded images are stored permanently in the cloud using Cloudinary, ensuring data integrity.
* **Automated Email Notifications:** Donors and volunteers receive instant confirmation and thank-you emails via Nodemailer.

---

## 📸 Project Screenshots


<img src="https://github.com/Dharaneesh017/Kalvi-Velicham/issues/1#issue-3359493469" alt="Click to view Project Screenshots" width="100%">
---

## 🛠️ Tech Stack

This project is built with the MEAN stack and deployed on a modern, robust infrastructure.

* **Frontend:** **Angular**
* **Backend:** **Node.js** with **Express.js**
* **Database:** **MongoDB** (with **MongoDB Atlas** for cloud hosting)
* **Image Storage:** **Cloudinary**
* **Deployment:**
    * **Frontend:** Deployed on **Netlify**.
    * **Backend:** Deployed on **Render**.

---

## 🚀 Getting Started Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed.
* Angular CLI installed (`npm install -g @angular/cli`).

### Setup & Installation

1.  **Clone the Repository**
    ```sh
    git clone [https://github.com/Dharaneesh017/Kalvi-Velicham.git](https://github.com/Dharaneesh017/Kalvi-Velicham.git)
    ```

2.  **Install Backend Dependencies**
    Navigate to the backend folder and install the necessary packages.
    ```sh
    cd Kalvi-Velicham/src/app/school-api-backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    Navigate back to the project's root folder and install the frontend packages.
    ```sh
    cd ../../../
    npm install
    ```

4.  **Set Up Environment Variables**
    In the backend folder (`src/app/school-api-backend`), create a `.env` file and add the following keys. This file should be in your `.gitignore`.
    ```env
    # MongoDB Connection String from Atlas
    MONGODB_URI=your_mongodb_connection_string_with_encoded_password

    # JWT Secret Key for authentication
    JWT_SECRET=your_super_secret_key

    # Nodemailer Credentials for sending emails
    EMAIL_USER=your_gmail_address@gmail.com
    EMAIL_PASS=your_16_digit_gmail_app_password

    # Cloudinary Credentials for image storage
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

5.  **Run the Application**
    * **Run the Backend Server:**
        ```sh
        # From the src/app/school-api-backend folder
        node server.js
        ```
    * **Run the Frontend Application:**
        ```sh
        # From the project's root folder
        ng serve
        ```
    Open your browser and navigate to `http://localhost:4200/`.
