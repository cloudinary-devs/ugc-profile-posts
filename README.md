This is a social media-style application that handles user-generated content (UGC) using Cloudinary's advanced capabilities. The app features a Profile page where users can manage their personal information and upload a profile picture, along with a Posts page where they can share thoughts and images.

It's a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run the app

To run the app yourself:

1. Clone or fork this GitHub repo.
1. In **app/config/cloudinary.ts**, replace **MY_CLOUD_NAME** with your Cloudinary product environment cloud name. You can find your **Cloud name** near the top of the Programmable Media [Dashboard](https://console.cloudinary.com/pm/developer-dashboard) of the Cloudinary Console. [Sign up for free](https://cloudinary.com/users/register_free) if you don't yet have a Cloudinary account.
1. To try out your app locally, you need to set up a secure tunnel connecting the internet to your locally-running application so that the webhooks sent by Cloudinary on upload are caught and handled by the app. You can use a tool such as [Ngrok](https://ngrok.com/) to do this. Otherwise, you need to deploy the app using a service such as [Vercel](https://vercel.com/). Whichever method you choose, make a note of your app's domain (for example, `a-b-c-d.ngrok-free.app` or `a-b-c-d.vercel.app`). By default, the app runs on port 3000.
1. Create an upload preset called **ugc-profile-photo**. (You can use a different name, but if you do, you also need update the `uploadPreset` value in **cloudinary.ts**.) See instructions on how to [configure your upload preset](https://cloudinary.com/documentation/profile_picture_sample_project#upload_preset_configuration).
1. Ensure that the **Notification URL** in your upload preset is set to:<br>`https://<your app's domain>/api/moderate`
1. Upload an image to use as the default image (for example <a href="https://res.cloudinary.com/cld-demo-ugc/image/upload/v1729679379/avatar-pic.jpg" target=_blank>this image</a>), and set its public ID to `avatar-pic`. Alternatively, use an image that's already in your product environment, and change the value of `defaultImage` in **cloudinary.ts** to its public ID. 
1. If running locally, run the development server:
   
      ```terminal
      npm i
      ```
      then

      ```terminal
      npm run dev
      ```
 
    Then open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.     


## Learn More

Learn more about this app: [Cloudinary docs](https://cloudinary.com/documentation/profile_picture_sample_project).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
