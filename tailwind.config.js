// const withMT = require("@material-tailwind/react/utils/withMT");

// module.exports = withMT({
//  
// theme: {
// extend: {},
// },
// 
// });
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
       "./index.html",
         "./src/**/*.{js,ts,jsx,tsx}",
         ],
         theme: {  extend: {
          keyframes: {
            shimmer: {
              '0%': { backgroundPosition: '-200% 0' },
              '100%': { backgroundPosition: '200% 0' },
            },
          },
          animation: {
            shimmer: 'shimmer 1.5s infinite linear',
          },
         
            animation: {
              'spin-slow': 'spin 3s linear infinite',
            
          }
        },
          fontFamily: {
            Kanit : ["Kanit" , "sans-serif"],
            Caveat : ["Caveat" , "sans-serif"],
            gothic : ["Special Gothic Expanded One" , "sans-serif"]
          },
          
        },
  plugins: [require("daisyui")],
});

