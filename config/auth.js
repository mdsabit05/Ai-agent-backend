

import { betterAuth }  from "better-auth";

//  export const auth = betterAuth({
//     secret : process.env.BETTER_AUTH_SECRET,

//     emailAndPassword : {
//       enabled : true
//     },
//       trustedOrigins: ["http://localhost:3000",
//   "https://ai-agent-frontend-up4l.vercel.app",
//   "https://ai-agent-frontend-up4l-git-main-mdsabit05s-projects.vercel.app"]
      
//   });



export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://ai-agent-frontend-up4l.vercel.app",
    // "https://ai-agent-frontend-up4l-git-main-mdsabit05s-projects.vercel.app"
  ],

  session: {
    cookie: {
      sameSite: "none",
      secure: true
    }
  }
});